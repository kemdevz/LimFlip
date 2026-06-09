'use client';

import { useEffect, useState, useRef } from 'react';
import Subnavbar from '@/components/Subnavbar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import SignUpModal from '@/components/SignUpModal';

function LoadingScreen({ isFadingOut }: { isFadingOut: boolean }) {
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.98) translateY(-20px);
          }
        }
        .logo-animate {
          animation: pulse 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#131721',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      <div
        className="logo-animate"
        style={{
          position: 'relative',
        }}
      >
        <img
          src="/logo.svg"
          alt="Loading"
          style={{
            width: '300px',
            height: '162px',
          }}
        />
      </div>

      <div
        className="logo-animate"
        style={{
          position: 'absolute',
          width: '276px',
          height: '65px',
          background: 'rgba(2, 118, 255, 0.13)',
          filter: 'blur(45.65px)',
          borderRadius: '66px',
        }}
      />
    </div>
  );
}

function MaintenancePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#131721]">
      {/* Background image with color-dodge blend mode */}
      <div
        className="absolute inset-0"
        style={{
          width: '2022px',
          height: '1205px',
          left: '-13px',
          top: '-84px',
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'color-dodge',
        }}
      />

      {/* Logo */}
      <div
        className="absolute"
        style={{
          width: '459px',
          height: '248px',
          left: 'calc(50% - 229.5px)',
          top: '485px',
        }}
      >
        <img
          src="/logo.svg"
          alt="bloxbash logo"
          width={459}
          height={248}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Maintenance text */}
      <div
        className="absolute font-bold text-center"
        style={{
          width: '464px',
          height: '53px',
          left: 'calc(50% - 219px)',
          top: '650px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '35px',
          lineHeight: '52px',
          color: '#FFFFFF',
        }}
      >
        Down for maintenance...
      </div>

      {/* Twitter icon */}
      <div
        className="absolute"
        style={{
          width: '54px',
          height: '54px',
          left: 'calc(50% - 88px)',
          bottom: '40px',
        }}
      >
        <svg
          width="54"
          height="54"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Discord icon placeholder */}
      <div
        className="absolute"
        style={{
          width: '52px',
          height: '52px',
          left: 'calc(50% + 14px)',
          bottom: '41px',
        }}
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </div>
    </div>
  );
}

function NotFoundPage({ onSignUpClick }: { onSignUpClick: () => void }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#12151C]">
      {/* Background image with luminosity blend mode */}
      <div
        className="absolute inset-0"
        style={{
          width: '2662px',
          height: '1248px',
          left: '-371px',
          top: '-84px',
          backgroundImage: 'url(/mainbg.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'luminosity',
        }}
      />

      {/* Blur effects */}
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '1652px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '241px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />

      <Subnavbar
        onTermsClick={() => window.location.href = '/tos'}
      />
      <Navbar
        onSignUpClick={onSignUpClick}
        onLogInClick={onSignUpClick}
      />
      <Sidebar />

      {/* Bet Input */}
      <div
        style={{
          position: 'absolute',
          width: '246px',
          height: '44px',
          left: 'calc(min(22vw, 352px) + 20px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
          background: '#191D29',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '18px',
            lineHeight: '27px',
            color: '#006EFF',
            marginRight: '10px',
          }}
        >
          $
        </span>
        <input
          type="text"
          placeholder="Enter bet amount ..."
          style={{
            width: '156px',
            height: '24px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#525D7D',
            background: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      {/* Place Bet Button */}
      <div
        style={{
          position: 'absolute',
          width: '141px',
          height: '42px',
          left: 'calc(min(22vw, 352px) + 20px + 246px + 5px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '121px',
            height: '42px',
            left: '9px',
            top: '-2px',
            background: '#0276FF',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '17px',
              lineHeight: '17px',
              color: '#FFFFFF',
            }}
          >
            PLACE BET
          </span>
        </div>
      </div>

      {/* Heads/Tails Selection */}
      <div
        style={{
          position: 'absolute',
          width: '86px',
          height: '42px',
          left: 'calc(min(22vw, 352px) + 20px + 246px + 5px + 141px + 5px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: '2px',
        }}
      >
        <img
          src="/heads.png"
          alt="Heads"
          style={{
            width: '42px',
            height: '42px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            cursor: 'pointer',
          }}
        />
        <img
          src="/tails.png"
          alt="Tails"
          style={{
            width: '42px',
            height: '42px',
            flex: 'none',
            order: 1,
            flexGrow: 0,
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Bet Items Button */}
      <div
        style={{
          position: 'absolute',
          width: '141px',
          height: '42px',
          left: 'calc(min(22vw, 352px) + 20px + 246px + 5px + 141px + 5px + 86px + 30px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '121px',
            height: '42px',
            left: '9px',
            top: '-2px',
            background: '#0276FF',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '17px',
              lineHeight: '17px',
              color: '#FFFFFF',
            }}
          >
            BET ITEMS
          </span>
        </div>
      </div>

      {/* Stats Display */}
      <div
        style={{
          position: 'absolute',
          width: '245px',
          height: '22px',
          left: 'calc(min(22vw, 352px) + 20px + 246px + 5px + 141px + 5px + 86px + 30px + 141px + 100px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 15px)',
        }}
      >
        {/* Players count */}
        <div
          style={{
            position: 'absolute',
            width: '59px',
            height: '22px',
            left: '0px',
            top: '0px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <img
            src="/assets/svg/home/dice.svg"
            alt="Players"
            style={{
              width: '27px',
              height: '22px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
            }}
          >
            36
          </span>
        </div>

        {/* Total bets */}
        <div
          style={{
            position: 'absolute',
            width: '77px',
            height: '22px',
            left: '81px',
            top: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <img
            src="/assets/svg/home/wallet.svg"
            alt="Total Bets"
            style={{
              width: '20px',
              height: '16px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '18px',
              lineHeight: '27px',
              color: '#0276FF',
            }}
          >
            R$1.59m
          </span>
        </div>

        {/* Your bets */}
        <div
          style={{
            position: 'absolute',
            width: '77px',
            height: '22px',
            left: '198px',
            top: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <img
            src="/assets/svg/home/wallet.svg"
            alt="Your Bets"
            style={{
              width: '20px',
              height: '16px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: '18px',
              lineHeight: '27px',
              color: '#0276FF',
            }}
          >
            $56.13
          </span>
        </div>
      </div>

      {/* Price Sort Dropdown */}
      <div
        style={{
          position: 'absolute',
          width: '279px',
          height: '53px',
          right: 'calc(20px + 53px + 10px)',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '266px',
            height: '53px',
            left: '0px',
            top: '0px',
            boxSizing: 'border-box',
            border: '1px solid #333845',
            borderRadius: '13px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 15px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/home/down.svg"
            alt="Sort"
            style={{
              width: '28px',
              height: '21px',
              marginRight: '10px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '22px',
              color: '#FFFFFF',
            }}
          >
            Price sort low to high
          </span>
          <img
            src="/assets/svg/home/arrow.svg"
            alt="Sort"
            style={{
              width: '17px',
              height: '9px',
              marginLeft: 'auto',
            }}
          />
        </div>
      </div>

      {/* Sort Button */}
      <div
        style={{
          position: 'absolute',
          width: '53px',
          height: '53px',
          right: '20px',
          top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 5px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '53px',
            height: '53px',
            left: '0px',
            top: '0px',
            background: '#181B22',
            border: '1px solid #0276FF',
            boxShadow: 'inset 0px 0px 58.9px rgba(2, 118, 255, 0.25)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/home/sort.svg"
            alt="Sort"
            style={{
              width: '20px',
              height: '18px',
            }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const isMaintenance = process.env.MAINTENANCE === 'true';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
      {isMaintenance ? (
        <MaintenancePage />
      ) : (
        <NotFoundPage onSignUpClick={() => setIsSignUpModalOpen(true)} />
      )}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </>
  );
}
