'use client';

import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface CoinflipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoinflipViewModal({ isOpen, onClose }: CoinflipViewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(100);
  const [showOrange, setShowOrange] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

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
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
      setShowOrange(false);
      setShowVideo(false);
      setVideoEnded(false);
    }
  }, [isOpen]);

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
          position: isMobile ? 'relative' : 'relative',
          width: isMobile ? '100%' : '1066px',
          height: isMobile ? '100vh' : '734px',
          left: isMobile ? '0' : '0',
          top: isMobile ? '0' : '0',
          maxHeight: isMobile ? '100vh' : '734px',
          overflowY: isMobile ? 'auto' : 'visible',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main content frame */}
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '1066px',
            height: isMobile ? 'auto' : '658px',
            left: isMobile ? '0' : '0px',
            top: isMobile ? '0' : '76px',
            padding: isMobile ? '16px' : '0',
            zIndex: 1,
          }}
        >
          {/* Background rectangle */}
          <div
            style={{
              boxSizing: 'border-box',
              position: isMobile ? 'absolute' : 'absolute',
              width: isMobile ? '100%' : '1062px',
              height: isMobile ? 'auto' : '655px',
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

          {/* Close button */}
          <img
            src="/x.svg"
            alt="Close"
            width={18}
            height={18}
            onClick={onClose}
            style={{
              position: isMobile ? 'absolute' : 'absolute',
              left: isMobile ? 'calc(100% - 30px)' : '96.06%',
              right: isMobile ? '16px' : '2.25%',
              top: isMobile ? '16px' : '4.12%',
              bottom: isMobile ? 'auto' : '92.65%',
              cursor: 'pointer',
              zIndex: 10,
            }}
          />

          {/* Content wrapper - ensures all content is above background */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
            }}
          >

          {/* Round counter circle */}
          {!showVideo && !isMobile && (
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
              width={isMobile ? "80" : "120"}
              height={isMobile ? "80" : "120"}
              viewBox="0 0 120 120"
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
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
          )}

        
        
          {/* Video animation - plays after orange.png */}
          {showVideo && (
            <video
              ref={videoRef}
              src="/assets/svg/coinflip/blue.webm"
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
                left: isMobile ? '50%' : '374px',
                top: isMobile ? '-50px' : '-5px',
                transform: isMobile ? 'translateX(-50%)' : 'none',
                zIndex: 20,
                objectFit: 'cover',
                mixBlendMode: 'screen',
              }}
            />
          )}

          {/* Players container */}
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
            {/* Left player (jakep) */}
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? 'auto' : '159px',
                height: isMobile ? 'auto' : '203px',
                left: isMobile ? '0' : '89px',
                top: isMobile ? '0' : '32px',
                display: isMobile ? 'flex' : 'block',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '8px' : '0',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: '57px',
                  height: '30px',
                  left: isMobile ? '0' : '55px',
                  top: isMobile ? '0' : '174px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '30px',
                  color: '#FFFFFF',
                  display: isMobile ? 'none' : 'flex',
                }}
              >
                jakep
              </span>
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

          {/* VS section */}
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              display: isMobile ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flex: isMobile ? 1 : 'none',
            }}
          >
            {!showVideo && (
              <div
                style={{
                  position: 'relative',
                  width: isMobile ? '80px' : '120px',
                  height: isMobile ? '80px' : '120px',
                  marginTop: isMobile ? '20px' : '0',
                }}
              >
                <svg
                  width={isMobile ? "80" : "120"}
                  height={isMobile ? "80" : "120"}
                  viewBox="0 0 120 120"
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100%',
                    height: '100%',
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
            )}
          </div>

            {/* Right player (Waiting..) */}
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? 'auto' : '159px',
                height: isMobile ? 'auto' : '207px',
                left: isMobile ? '0' : '814px',
                top: isMobile ? '0' : '32px',
                display: isMobile ? 'flex' : 'block',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                gap: isMobile ? '8px' : '0',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: '91px',
                  height: '30px',
                  left: isMobile ? '0' : '44px',
                  top: isMobile ? '0' : '172px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '30px',
                  color: '#FFFFFF',
                  display: isMobile ? 'none' : 'flex',
                }}
              >
                Waiting..
              </span>
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
                  width: '120.25px',
                  height: '120.25px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '240.493px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '123.89px',
                  height: '127.53px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: '#11151D',
                  borderRadius: '240.493px',
                }}
              />
              <svg
                width="31"
                height="52"
                viewBox="0 0 31 52"
                fill="none"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <defs>
                  <linearGradient id="questionGradient" x1="15.4863" y1="0" x2="15.4863" y2="51.0137" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0276FF"/>
                    <stop offset="1" stop-color="#7CB8FF"/>
                  </linearGradient>
                </defs>
                <path
                  d="M30.9726 14.889C30.976 11.6119 29.7963 8.42554 27.6169 5.82479C25.4374 3.22405 22.3801 1.35451 18.9198 0.506573C15.4596 -0.341364 11.7901 -0.120234 8.48139 1.13561C5.17265 2.39146 2.40984 4.61173 0.622126 7.45154C0.00606608 8.42823 -0.160649 9.58879 0.158661 10.6779C0.47797 11.7671 1.25715 12.6955 2.32478 13.2591C3.39241 13.8227 4.66105 13.9752 5.8516 13.6831C7.04215 13.391 8.05709 12.6782 8.67315 11.7015C9.28515 10.7318 10.1656 9.92665 11.2258 9.3671C12.286 8.80754 13.4886 8.51332 14.7126 8.51404C16.5608 8.51404 18.3333 9.18568 19.6401 10.3812C20.947 11.5767 21.6812 13.1982 21.6812 14.889C21.6812 16.5797 20.947 18.2012 19.6401 19.3968C18.3333 20.5923 16.5608 21.2639 14.7126 21.2639H14.6986C14.3992 21.2929 14.1036 21.3484 13.816 21.4297C13.5039 21.4578 13.1957 21.5148 12.8961 21.5997C12.6414 21.7275 12.4003 21.8769 12.176 22.0459C11.909 22.1789 11.657 22.3354 11.4234 22.5134C11.2144 22.7418 11.0322 22.9897 10.8799 23.2529C10.7105 23.4446 10.5598 23.6493 10.4292 23.8649C10.3272 24.1578 10.2602 24.4599 10.2295 24.7659C10.1509 25.0103 10.0965 25.2606 10.0669 25.5139V29.7639L10.0762 29.8106V31.8973C10.0786 33.023 10.5692 34.1019 11.4401 34.897C12.3111 35.6922 13.4914 36.1388 14.7219 36.1388H14.7358C15.3459 36.1377 15.9498 36.0267 16.5129 35.8121C17.0761 35.5974 17.5876 35.2835 18.0181 34.888C18.4486 34.4926 18.7898 34.0234 19.0222 33.5074C19.2545 32.9913 19.3735 32.4385 19.3722 31.8804L19.3629 29.0669C22.7078 28.1607 25.6441 26.2918 27.7356 23.7376C29.827 21.1834 30.9623 18.0803 30.9726 14.889ZM11.4466 43.7463C10.7943 44.3382 10.3484 45.0937 10.1655 45.9174C9.98249 46.7411 10.0706 47.596 10.4187 48.3738C10.7668 49.1517 11.3592 49.8177 12.121 50.2876C12.8828 50.7575 13.7799 51.0102 14.6986 51.0137C15.9296 51.0023 17.1094 50.5614 17.9971 49.7812C18.8597 48.975 19.3428 47.8918 19.3428 46.7637C19.3428 45.6356 18.8597 44.5524 17.9971 43.7463C17.1079 42.988 15.9375 42.5664 14.7219 42.5664C13.5063 42.5664 12.3359 42.988 11.4466 43.7463Z"
                  fill="url(#questionGradient)"
                />
              </svg>
            </div>
            </div>
          </div>

          {/* Time text */}
          <span
            style={{
              position: isMobile ? 'absolute' : 'absolute',
              width: isMobile ? 'auto' : '299px',
              height: '27px',
              left: isMobile ? '50%' : '379px',
              top: isMobile ? 'auto' : '545px',
              bottom: isMobile ? '-490px' : 'auto',
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

          {/* PROVABLY FAIR button */}
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '297px',
              height: isMobile ? 'auto' : '42px',
              left: isMobile ? '0' : '383px',
              top: isMobile ? '0' : '584px',
              display: isMobile ? 'none' : 'block',
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
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '297px',
              height: isMobile ? 'auto' : '42px',
              left: isMobile ? '0' : '741px',
              top: isMobile ? '0' : '584px',
              display: isMobile ? 'none' : 'block',
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
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '394px',
              height: isMobile ? 'auto' : '38px',
              left: isMobile ? '0' : '565px',
              top: isMobile ? '0' : '254px',
              display: isMobile ? 'none' : 'block',
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
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '394px',
              height: isMobile ? 'auto' : '38px',
              left: isMobile ? '0' : '123px',
              top: isMobile ? '0' : '254px',
              display: isMobile ? 'none' : 'block',
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
              display: isMobile ? 'flex' : 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '12px',
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '445px',
              height: isMobile ? 'auto' : '46px',
              left: isMobile ? '0' : '66px',
              top: isMobile ? '0' : '305px',
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
              display: isMobile ? 'flex' : 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '12px',
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '445px',
              height: isMobile ? 'auto' : '46px',
              left: isMobile ? '0' : '512px',
              top: isMobile ? '0' : '305px',
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
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '276px',
              height: isMobile ? 'auto' : '65px',
              left: isMobile ? '0' : '390px',
              top: isMobile ? '0' : '0px',
              display: isMobile ? 'none' : 'block',
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
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? 'auto' : '276px',
              height: isMobile ? 'auto' : '65px',
              left: isMobile ? '0' : '390px',
              top: isMobile ? '0' : '0px',
              display: isMobile ? 'none' : 'block',
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
    </div>
  );
}
