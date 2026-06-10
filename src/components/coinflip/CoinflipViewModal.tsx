'use client';

import { useState, useEffect } from 'react';

interface CoinflipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoinflipViewModal({ isOpen, onClose }: CoinflipViewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      setCountdown(5);
      setProgress(100);
      
      // Countdown animation
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 1;
          }
          return prev - 1;
        });
      }, 1000);

      // Progress bar animation
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
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '1066px',
          height: '634px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main content frame */}
        <div
          style={{
            position: 'absolute',
            width: '1066px',
            height: '558px',
            left: '0px',
            top: '76px',
          }}
        >
          {/* Background rectangle */}
          <div
            style={{
              boxSizing: 'border-box',
              position: 'absolute',
              width: '1062px',
              height: '555px',
              left: '0px',
              top: '0px',
              background: '#191B25',
              border: '1px solid #222530',
              boxShadow: '0px 4px 12.6px rgba(0, 0, 0, 0.25)',
              borderRadius: '26px',
            }}
          />

          {/* Close button */}
          <img
            src="/x.svg"
            alt="Close"
            width={18}
            height={18}
            onClick={onClose}
            style={{
              position: 'absolute',
              left: '96.06%',
              right: '2.25%',
              top: '4.12%',
              bottom: '92.65%',
              cursor: 'pointer',
            }}
          />

          {/* Round counter circle */}
          <div
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              left: '464px',
              top: '75px',
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
              }}
            >
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#13151E"
                strokeWidth="4"
              />
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#006EFF"
                strokeWidth="3"
                strokeDasharray="345"
                strokeDashoffset={345 - (345 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: 'stroke-dashoffset 1s linear',
                }}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              {countdown}
            </span>
          </div>

          {/* Right player (Waiting..) */}
          <div
            style={{
              position: 'absolute',
              width: '159px',
              height: '207px',
              left: '814px',
              top: '32px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '91px',
                height: '30px',
                left: '44px',
                top: '172px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              Waiting..
            </span>
            <div
              style={{
                position: 'absolute',
                width: '159px',
                height: '176px',
                left: '0px',
                top: '0px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '125px',
                  height: '125px',
                  left: '20px',
                  top: '34px',
                  background: 'url(/assets/images/ui/rightside.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '125px',
                  height: '125px',
                  left: '20px',
                  top: '34px',
                  borderRadius: '132px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '136px',
                  height: '137px',
                  left: '0px',
                  top: '-4px',
                  background: 'url(/assets/images/ui/cornerpng.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </div>

          {/* Left player (jakep) */}
          <div
            style={{
              position: 'absolute',
              width: '159px',
              height: '203px',
              left: '89px',
              top: '32px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '57px',
                height: '30px',
                left: '55px',
                top: '174px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              jakep
            </span>
            <div
              style={{
                position: 'absolute',
                width: '159px',
                height: '176px',
                left: '0px',
                top: '0px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '129px',
                  height: '129px',
                  left: '15px',
                  top: '29px',
                  background: 'url(/assets/images/ui/cornerpng.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '140px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '127px',
                  height: '127px',
                  left: '16px',
                  top: '31px',
                  background: 'url(/assets/images/coinflip/1SIDE.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '1000px',
                }}
              />
            </div>
          </div>

          {/* Time text */}
          <span
            style={{
              position: 'absolute',
              width: '299px',
              height: '27px',
              left: '379px',
              top: '445px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#474D67',
            }}
          >
            Created less than a minute ago..
          </span>

          {/* PROVABLY FAIR button */}
          <div
            style={{
              position: 'absolute',
              width: '297px',
              height: '42px',
              left: '383px',
              top: '484px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '160px',
                height: '42px',
                left: '65px',
                top: '0px',
                background: '#262937',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '25.93%',
                right: '24.58%',
                top: '19.05%',
                bottom: '28.57%',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#AAB1D0',
                opacity: 0.5,
              }}
            >
              PROVABLY FAIR
            </span>
          </div>

          {/* Cancel button */}
          <div
            style={{
              position: 'absolute',
              width: '297px',
              height: '42px',
              left: '741px',
              top: '484px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '86px',
                height: '42px',
                left: '213px',
                top: '0px',
                background: '#0276FF',
                opacity: 0.08,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '75.76%',
                right: '-25.25%',
                top: '19.05%',
                bottom: '28.57%',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#2B86FF',
                opacity: 0.5,
              }}
            >
              Cancel
            </span>
          </div>

          {/* Blue progress bar */}
          <div
            style={{
              position: 'absolute',
              width: '394px',
              height: '38px',
              left: '565px',
              top: '254px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '435px',
                height: '38px',
                left: '-33px',
                top: '0px',
                background: '#262937',
                boxShadow: '0px 0px 17.8px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '26px',
                height: '23px',
                left: '-18px',
                top: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              0 %
            </span>
            <img
              src="/assets/wallet/wallet.svg"
              alt="Wallet"
              style={{
                position: 'absolute',
                width: '16px',
                height: '14px',
                left: '320px',
                top: '12px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '50px',
                height: '23px',
                left: '345px',
                top: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              B$90K
            </span>
          </div>

          {/* Red progress bar */}
          <div
            style={{
              position: 'absolute',
              width: '394px',
              height: '38px',
              left: '123px',
              top: '254px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '435px',
                height: '38px',
                left: '-33px',
                top: '0px',
                background: '#262937',
                boxShadow: '0px 0px 17.8px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '26px',
                height: '23px',
                left: '-18px',
                top: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              0 %
            </span>
            <img
              src="/assets/wallet/wallet.svg"
              alt="Wallet"
              style={{
                position: 'absolute',
                width: '16px',
                height: '14px',
                left: '320px',
                top: '11px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '50px',
                height: '23px',
                left: '345px',
                top: '7px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              R$90K
            </span>
          </div>

          {/* Left item */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '12px',
              position: 'absolute',
              width: '445px',
              height: '46px',
              left: '66px',
              top: '305px',
            }}
          >
            <div
              style={{
                width: '445px',
                height: '46px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '155px',
                  height: '23px',
                  left: '85px',
                  top: '13px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#F3F3F3',
                }}
              >
                Huge Cosmic Agony
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '49px',
                  height: '23px',
                  left: '396px',
                  top: '13px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#006EFF',
                  textShadow: '0px 0px 4px rgba(0, 110, 255, 0.25)',
                }}
              >
                R$90K
              </span>
              <img
                src="/assets/images/coinflip/knife.png"
                alt="Knife"
                style={{
                  position: 'absolute',
                  width: '44px',
                  height: '43px',
                  left: '28px',
                  top: '1px',
                  borderRadius: '8px',
                }}
              />
            </div>
          </div>

          {/* Right item */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '12px',
              position: 'absolute',
              width: '445px',
              height: '46px',
              left: '512px',
              top: '305px',
            }}
          >
            <div
              style={{
                width: '445px',
                height: '46px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '155px',
                  height: '23px',
                  left: '85px',
                  top: '13px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#F3F3F3',
                }}
              >
                Huge Cosmic Agony
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '49px',
                  height: '23px',
                  left: '396px',
                  top: '13px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#006EFF',
                  textShadow: '0px 0px 4px rgba(0, 110, 255, 0.25)',
                }}
              >
                R$90K
              </span>
              <img
                src="/assets/images/coinflip/knife.png"
                alt="Knife"
                style={{
                  position: 'absolute',
                  width: '44px',
                  height: '43px',
                  left: '28px',
                  top: '1px',
                  borderRadius: '8px',
                }}
              />
            </div>
          </div>

          {/* Left logo */}
          <div
            style={{
              position: 'absolute',
              width: '276px',
              height: '65px',
              left: '390px',
              top: '0px',
            }}
          >
            <img
              src="/assets/svg/ui/logo.svg"
              alt="bloxbash logo"
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

          {/* Right logo */}
          <div
            style={{
              position: 'absolute',
              width: '276px',
              height: '65px',
              left: '390px',
              top: '0px',
            }}
          >
            <img
              src="/assets/svg/ui/logo.svg"
              alt="bloxbash logo"
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
        </div>
      </div>
    </div>
  );
}
