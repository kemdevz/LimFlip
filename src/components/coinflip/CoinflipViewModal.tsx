'use client';

import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import ValidateFairnessModal from './ValidateFairnessModal';

interface CoinflipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: any;
}

export default function CoinflipViewModal({ isOpen, onClose, game }: CoinflipViewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(100);
  const [showOrange, setShowOrange] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `B$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `B$${amount.toFixed(0)}`;
    }
  };

  useEffect(() => {
    if (isOpen && game?.status === 'active') {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      setCountdown(5);
      setProgress(100);

      // Countdown animation
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowOrange(true);
            // Show video after orange display
            setTimeout(() => {
              setShowVideo(true);
            }, 500);
            return 1;
          }
          return prev - 1;
        });
      }, 1000);

      // Progress bar animation - decrease every second starting from 100%
      setTimeout(() => setProgress(80), 10); // Start decreasing immediately
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return prev - 20;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        clearInterval(progressInterval);
      };
    } else if (isOpen && game?.status === 'completed') {
      // Modal is open for a completed game - play video then show result
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      setShowOrange(true);
      // Show video after short delay
      setTimeout(() => {
        setShowVideo(true);
      }, 500);
    } else if (isOpen) {
      // Modal is open but game is not active yet (waiting for joiner)
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 300);
      setShowOrange(false);
      setShowVideo(false);
      setVideoEnded(false);
    }
  }, [isOpen, game?.status]);

  if (!shouldRender) return null;

  return (
    <div
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        position: 'fixed',
        inset: 0,
      }}
      onClick={onClose}
    >
      <div
        className="responsive-modal-panel"
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '900px',
          height: isMobile ? '100vh' : '650px',
          left: isMobile ? '0' : '50%',
          top: isMobile ? '0' : '50%',
          transform: isMobile ? 'none' : `translate(-50%, -50%) scale(${isVisible ? 1 : 0.9})`,
          maxHeight: isMobile ? '100vh' : '650px',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx>{`
          .responsive-modal-panel::-webkit-scrollbar {
            display: none;
          }
          .responsive-modal-panel {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '900px',
            height: isMobile ? 'auto' : '580px',
            left: isMobile ? '0' : '0px',
            top: isMobile ? '0' : '70px',
            padding: isMobile ? '16px' : '0',
            zIndex: 1,
          }}
        >
          
          <div
            style={{
              boxSizing: 'border-box',
              position: isMobile ? 'absolute' : 'absolute',
              width: isMobile ? '100%' : '900px',
              height: isMobile ? 'auto' : '580px',
              left: isMobile ? '0' : '0px',
              top: isMobile ? '0' : '0px',
              background: isMobile ? '#191C25' : '#191B25',
              border: '1px solid #222530',
              boxShadow: '0px 4px 12.6px rgba(0, 0, 0, 0.25)',
              borderRadius: isMobile ? '0' : '26px',
              padding: isMobile ? '16px' : '0',
              zIndex: 0,
              minHeight: isMobile ? '100vh' : 'auto',
            }}
          />

          
          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >

        
        

          {showVideo && (
            <video
              ref={videoRef}
              src={game?.result === 'heads' ? '/assets/svg/coinflip/blue.webm' : '/assets/svg/coinflip/tails.webm'}
              autoPlay
              muted
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = videoRef.current.duration;
                }
                setVideoEnded(true);
              }}
              style={{
                position: isMobile ? 'absolute' : 'absolute',
                width: isMobile ? '216px' : '300px',
                height: isMobile ? '216px' : '300px',
                left: isMobile ? '50%' : '300px',
                top: isMobile ? '-50px' : '-5px',
                transform: isMobile ? 'translateX(-50%)' : 'none',
                zIndex: 10,
                objectFit: 'cover',
                mixBlendMode: 'screen',
              }}
            />
          )}

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : 'auto',
              height: isMobile ? 'auto' : 'auto',
              left: isMobile ? '0' : 'auto',
              top: isMobile ? '0' : 'auto',
              display: isMobile ? 'flex' : 'block',
              flexDirection: isMobile ? 'row' : 'column',
              justifyContent: isMobile ? 'center' : 'flex-start',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '20px' : '0',
              margin: isMobile ? '20px 0' : '0',
            }}
          >
            
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? 'auto' : '159px',
                height: isMobile ? 'auto' : '203px',
                left: isMobile ? '0' : '100px',
                top: isMobile ? '0' : '32px',
                display: isMobile ? 'flex' : 'block',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '8px' : '0',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <div
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '80px' : '159px',
                  height: isMobile ? '80px' : '176px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '0px',
                }}
              >
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '80px' : '129px',
                  height: isMobile ? '80px' : '129px',
                  left: isMobile ? '50%' : '15px',
                  top: isMobile ? '50%' : '29px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: '#131620',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '80px' : '129px',
                  height: isMobile ? '80px' : '129px',
                  left: isMobile ? '50%' : '15px',
                  top: isMobile ? '50%' : '29px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: 'url(/assets/images/ui/cornerpng.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '78px' : '127px',
                  height: isMobile ? '78px' : '127px',
                  left: isMobile ? '50%' : '16px',
                  top: isMobile ? '50%' : '31px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: game?.creator?.avatarUrl ? `url(${game.creator.avatarUrl})` : 'url(/assets/images/coinflip/item_1side.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '1000px',
                }}
              />
            </div>
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? 'auto' : 'auto',
                  height: '30px',
                  left: isMobile ? '0' : '50%',
                  top: isMobile ? '0' : '174px',
                  transform: isMobile ? 'none' : 'translateX(-50%)',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: isMobile ? '17px' : '20px',
                  lineHeight: isMobile ? '26px' : '30px',
                  color: '#FFFFFF',
                  display: 'flex',
                  marginTop: isMobile ? '8px' : '0',
                  textAlign: isMobile ? 'center' : 'center',
                }}
              >
                {game?.creator?.username || 'Unknown'}
              </span>
            </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              display: isMobile ? 'flex' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: isMobile ? 1 : 'none',
              left: isMobile ? '0' : '390px',
              top: isMobile ? '0' : '70px',
            }}
          >
            {game?.status === 'active' && !showVideo && (
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? '40px' : '50px',
                  height: isMobile ? '40px' : '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: isMobile ? '0' : '30px',
                  marginTop: isMobile ? '0' : '30px',
                }}
              >
                <svg
                  width={isMobile ? "40" : "50"}
                  height={isMobile ? "40" : "50"}
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: '100%',
                    height: '100%',
                    animation: 'spin 1s linear infinite',
                  }}
                >
                  <path d="M9.5 2C5.26205 1.99984 1.99996 5.37499 2 9.50002C2.00005 13.325 5.03178 17 9.5 17C13.6568 17 17 13.625 17 9.50002" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="9.5" y1="18.25" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1983FF"/>
                      <stop offset="1" stopColor="#1983FF" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
            {game?.status === 'waiting' && !showVideo && (
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? '112px' : '140px',
                  height: isMobile ? '112px' : '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width={isMobile ? "112" : "140"}
                  height={isMobile ? "112" : "140"}
                  viewBox="0 0 140 140"
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <circle
                    cx="70"
                    cy="70"
                    r="65"
                    fill="none"
                    stroke="#13151E"
                    strokeWidth="4"
                  />
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '45px' : '59px',
                    lineHeight: '1',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  ?
                </span>
              </div>
            )}
          </div>

            
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? 'auto' : '159px',
                height: isMobile ? 'auto' : '207px',
                left: isMobile ? '0' : '640px',
                top: isMobile ? '0' : '32px',
                display: isMobile ? 'flex' : 'block',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '8px' : '0',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <div
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '80px' : '159px',
                  height: isMobile ? '80px' : '176px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '0px',
                }}
              >
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '80px' : '129px',
                  height: isMobile ? '80px' : '129px',
                  left: isMobile ? '50%' : '15px',
                  top: isMobile ? '50%' : '29px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: '#131620',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '80px' : '129px',
                  height: isMobile ? '80px' : '129px',
                  left: isMobile ? '50%' : '15px',
                  top: isMobile ? '50%' : '29px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: 'url(/assets/images/ui/cornerpng.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: isMobile ? '78px' : '127px',
                  height: isMobile ? '78px' : '127px',
                  left: isMobile ? '50%' : '16px',
                  top: isMobile ? '50%' : '31px',
                  transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                  background: game?.joiner?.avatarUrl ? `url(${game.joiner.avatarUrl})` : 'url(/assets/images/coinflip/item_1side.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '1000px',
                }}
              />
            </div>
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? 'auto' : 'auto',
                  height: '30px',
                  left: isMobile ? '0' : '50%',
                  top: isMobile ? '0' : '172px',
                  transform: isMobile ? 'none' : 'translateX(-50%)',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: isMobile ? '17px' : '20px',
                  lineHeight: isMobile ? '26px' : '30px',
                  color: '#FFFFFF',
                  display: 'flex',
                  marginTop: isMobile ? '8px' : '0',
                  textAlign: isMobile ? 'center' : 'center',
                }}
              >
                {game?.joiner?.username || 'Waiting..'}
              </span>
              {game?.status !== 'waiting' && (
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? 'auto' : 'auto',
                    height: '20px',
                    left: isMobile ? '0' : '50%',
                    top: isMobile ? '0' : '200px',
                    transform: isMobile ? 'none' : 'translateX(-50%)',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: isMobile ? '14px' : '16px',
                    lineHeight: '20px',
                    color: game?.status === 'active' ? '#00FF00' : '#FFFFFF',
                    display: 'flex',
                    marginTop: isMobile ? '4px' : '0',
                    textAlign: isMobile ? 'center' : 'center',
                  }}
                >
                </span>
              )}
            </div>
          </div>

          
          {isMobile && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: '40px',
              }}
            >
              
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  width: '100%',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                }}
              >
                
                <div
                  style={{
                    flex: 1,
                    height: '38px',
                    background: '#262937',
                    boxShadow: '0px 0px 17.8px rgba(0, 0, 0, 0.05)',
                    borderRadius: '6px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: '41px',
                      height: '23px',
                      left: '12px',
                      top: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    50 %
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: '49px',
                      height: '23px',
                      right: '12px',
                      top: '7px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    {formatAmount(game?.creatorItems?.reduce((sum: number, item: any) => sum + item.value, 0) || 0)}
                  </span>
                </div>

                
                <div
                  style={{
                    flex: 1,
                    height: '38px',
                    background: '#262937',
                    boxShadow: '0px 0px 17.8px rgba(0, 0, 0, 0.05)',
                    borderRadius: '6px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: '41px',
                      height: '23px',
                      left: '12px',
                      top: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    50 %
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: '49px',
                      height: '23px',
                      right: '12px',
                      top: '7px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    {formatAmount(game?.joinerItems?.reduce((sum: number, item: any) => sum + item.value, 0) || 0)}
                  </span>
                </div>
              </div>

              
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  width: '100%',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                }}
              >
                
                {game?.joinerItems?.slice(0, 2).map((item: any) => (
                  <div
                    key={`joiner-${item.itemId || item.name}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span
                        style={{
                          fontFamily: 'Proxima Nova, Poppins, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '13px',
                          lineHeight: '13px',
                          color: '#F3F3F3',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Proxima Nova, Poppins, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '13px',
                          lineHeight: '13px',
                          color: '#006EFF',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatAmount(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          <span
            style={{
              position: isMobile ? 'absolute' : 'absolute',
              width: isMobile ? 'auto' : '299px',
              height: '27px',
              left: isMobile ? '50%' : '300px',
              top: isMobile ? '620px' : '480px',
              bottom: isMobile ? 'auto' : 'auto',
              transform: isMobile ? 'translateX(-50%)' : 'none',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#474D67',
              margin: isMobile ? '0' : '0',
              textAlign: 'center',
            }}
          >
            Created less than a minute ago..
          </span>

          
          <div
            style={{
              position: isMobile ? 'absolute' : 'absolute',
              width: isMobile ? 'auto' : '151px',
              height: isMobile ? 'auto' : '42px',
              left: isMobile ? '50%' : '374px',
              top: isMobile ? '655px' : '510px',
              transform: isMobile ? 'translateX(-50%)' : 'none',
              display: isMobile ? 'flex' : 'block',
            }}
          >
            <div
              onClick={() => setIsValidateFairnessOpen(true)}
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '160px' : '149px',
                height: isMobile ? '42px' : '39px',
                left: isMobile ? '0' : '2px',
                top: isMobile ? '0' : '0px',
                cursor: 'pointer',
                display: isMobile ? 'flex' : 'block',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '149px',
                  height: '39px',
                  left: '0px',
                  top: '0px',
                  background: '#202634',
                  borderRadius: '15px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '12.08%',
                  right: '-10.74%',
                  top: '23.08%',
                  bottom: '20.51%',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#9FAED1',
                  opacity: 0.5,
                }}
              >
                PROVABLY FAIR
              </span>
            </div>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '323px',
              height: isMobile ? 'auto' : '36px',
              left: isMobile ? '0' : '460px',
              top: isMobile ? '0' : '254px',
              display: isMobile ? 'none' : 'block',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '323px',
                height: '36px',
                left: '0px',
                top: '0px',
                background: '#202634',
                borderRadius: '15px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '61px',
                height: '24px',
                left: '13px',
                top: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
              }}
            >
              50.00 %
            </span>
            <span
              style={{
                position: 'absolute',
                width: 'auto',
                height: '24px',
                right: '13px',
                top: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
              }}
            >
              {formatAmount(game?.joinerItems?.reduce((sum: number, item: any) => sum + item.value, 0) || 0)}
            </span>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '323px',
              height: isMobile ? 'auto' : '36px',
              left: isMobile ? '0' : '100px',
              top: isMobile ? '0' : '254px',
              display: isMobile ? 'none' : 'block',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '323px',
                height: '36px',
                left: '0px',
                top: '0px',
                background: '#202634',
                borderRadius: '15px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '61px',
                height: '24px',
                left: '13px',
                top: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
              }}
            >
              50.00 %
            </span>
            <span
              style={{
                position: 'absolute',
                width: 'auto',
                height: '24px',
                right: '13px',
                top: '6px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
              }}
            >
              {formatAmount(game?.creatorItems?.reduce((sum: number, item: any) => sum + item.value, 0) || 0)}
            </span>
          </div>

      
{!isMobile && (
<div
style={{
position: 'absolute',
width: '301px',
height: '138px',
left: '100px',
top: '305px',
overflowY: 'auto',
scrollbarWidth: 'thin',
}}
>
<div
style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'flex-start',
padding: '0px',
gap: '12px',
}}
>
{game?.creatorItems?.map((item: any, i: number) => (
<div
key={`creator-${item.itemId || item.name}-${i}`}
style={{
width: '301px',
height: '38px',
position: 'relative',
}}
>
<img
src={item.image}
alt={item.name}
style={{
position: 'absolute',
width: '38px',
height: '38px',
left: '0px',
top: '0px',
borderRadius: '100px',
}}
/>
<span
style={{
position: 'absolute',
width: '142px',
height: '24px',
left: '62px',
top: '8px',
fontFamily: 'Poppins, sans-serif',
fontStyle: 'normal',
fontWeight: '600',
fontSize: '15px',
lineHeight: '24px',
display: 'flex',
alignItems: 'center',
color: '#FFFFFF',
}}
>
{item.name}
</span>
<span
style={{
position: 'absolute',
width: 'auto',
height: '24px',
right: '13px',
top: '8px',
fontFamily: 'Poppins, sans-serif',
fontStyle: 'normal',
fontWeight: '600',
fontSize: '15px',
lineHeight: '24px',
display: 'flex',
alignItems: 'center',
color: '#FFFFFF',
}}
>
{formatAmount(item.value)}
</span>
</div>
))}
</div>
</div>
)}

          
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                width: '301px',
                height: '138px',
                left: '460px',
                top: '305px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '12px',
                }}
              >
              {game?.joiner && game?.joinerItems?.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    width: '301px',
                    height: '38px',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      width: '38px',
                      height: '38px',
                      left: '0px',
                      top: '0px',
                      borderRadius: '100px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: '142px',
                      height: '24px',
                      left: '62px',
                      top: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: 'auto',
                      height: '24px',
                      right: '13px',
                      top: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    {formatAmount(item.value)}
                  </span>
                </div>
              ))}
              </div>
            </div>
          )}

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '276px',
              height: isMobile ? 'auto' : '65px',
              left: isMobile ? '0' : '312px',
              top: isMobile ? '0' : '0px',
              display: isMobile ? 'none' : 'block',
            }}
          >
            <img
              src="/assets/svg/ui/logo.svg"
              alt="MM2Stake logo"
              style={{
                position: 'absolute',
                width: '1870px',
                height: '330px',
                left: '-7px',
                top: '-200px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '276px',
                height: '65px',
                left: '0px',
                top: '-90px',
                background: 'rgba(2, 118, 255, 0.07)',
                filter: 'blur(45.65px)',
                borderRadius: '66px',
              }}
            />
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '276px',
              height: isMobile ? 'auto' : '65px',
              left: isMobile ? '0' : '312px',
              top: isMobile ? '0' : '0px',
              display: isMobile ? 'none' : 'block',
            }}
          >
            <img
              src="/assets/svg/ui/logo.svg"
              alt="MM2Stake logo"
              style={{
                position: 'absolute',
                width: '1870px',
                height: '330px',
                left: '-7px',
                top: '-200px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '276px',
                height: '65px',
                left: '0px',
                top: '-180px',
                background: 'rgba(2, 118, 255, 0.07)',
                filter: 'blur(45.65px)',
                borderRadius: '66px',
              }}
            />
          </div>

          
          <div
            onClick={onClose}
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'calc(100% - 32px)' : '120px',
              height: '44px',
              left: isMobile ? '16px' : 'calc(100% - 140px)',
              top: isMobile ? 'calc(100% - 60px)' : '580px',
              background: '#333845',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 30,
            }}
          >
            <span
              style={{
                position: 'relative',
                width: 'auto',
                height: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              Close
            </span>
          </div>

          
          {(() => {
            const creatorId = typeof game?.creator === 'object' ? game?.creator?._id : game?.creator;
            const joinerId = typeof game?.joiner === 'object' ? game?.joiner?._id : game?.joiner;
            const canCancel = user?.id === creatorId && !joinerId;
            console.log('Cancel button check:', { userId: user?.id, creatorId, joinerId, canCancel, gameCreator: game?.creator, gameJoiner: game?.joiner });
            return canCancel;
          })() && (
            <div
              onClick={async () => {
                if (!game?._id || !user?.id) return;
                setIsCancelling(true);
                try {
                  const response = await fetch(`https://api-bash.onrender.com/coinflip/cancel/${game._id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                  });
                  const data = await response.json();
                  if (!response.ok) {
                    throw new Error(data.error || 'Failed to cancel game');
                  }
                  onClose();
                  window.location.reload();
                } catch (err) {
                  console.error('Error cancelling game:', err);
                  alert(err instanceof Error ? err.message : 'Failed to cancel game');
                } finally {
                  setIsCancelling(false);
                }
              }}
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? 'calc(100% - 32px)' : '120px',
                height: '44px',
                left: isMobile ? '16px' : 'calc(100% - 270px)',
                top: isMobile ? 'calc(100% - 112px)' : '580px',
                background: '#EF4444',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isCancelling ? 'not-allowed' : 'pointer',
                opacity: isCancelling ? 0.5 : 1,
                zIndex: 30,
              }}
            >
              <span
                style={{
                  position: 'relative',
                  width: 'auto',
                  height: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Game'}
              </span>
            </div>
          )}
          </div>
        </div>
      </div>
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
        showOverlay={false}
      />
    </div>
  );
}