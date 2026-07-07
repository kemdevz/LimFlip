'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <div
      className="app-footer"
      style={{
        bottom: isVisible ? '0px' : '-211px',
      }}
    >
      {/* Container */}
      <div
        className="absolute app-footer__inner"
        style={{
          width: '1080px',
          height: '324.93px',
          left: 'calc(50% - 1080px/2 - 174px)',
          top: '-18px',
        }}
      >
        {/* Logo */}
        <div
          className="absolute app-footer__logo"
          style={{
            width: '300px',
            height: '162px',
            left: '-60px',
            top: '-20px',
          }}
        >
          <img
            src="/assets/svg/ui/logo.svg"
            alt="bloxbash logo"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Social icons */}
        <div
          className="absolute"
          style={{
            width: '51px',
            height: '51px',
            left: '0.46px',
            top: '144px',
            border: '1px solid #252A32',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/svg/social/footerdiscord.svg"
            alt="Discord"
            style={{
              width: '29px',
              height: '23px',
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            width: '51px',
            height: '51px',
            left: '60.46px',
            top: '144px',
            border: '1px solid #252A32',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/svg/social/footertwitter.svg"
            alt="Twitter"
            style={{
              width: '28px',
              height: '23px',
            }}
          />
        </div>

        {/* Disclaimer */}
        <div
          className="absolute font-semibold"
          style={{
            width: '477px',
            height: '60px',
            left: '1px',
            top: '84px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '11px',
            lineHeight: '20px',
            color: '#626977',
          }}
        >
          ETHEREAL ENTERTAINMENT is not affiliated, associated, or partnered with Roblox Corporation in any way. We are not authorized, endorsed, or sponsored by Roblox.
        </div>

        {/* Home section */}
        <div
          className="absolute font-semibold app-footer__columns"
          style={{
            width: '51px',
            height: '24px',
            left: '632px',
            top: '40px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15.75px',
            lineHeight: '24px',
            color: '#FFFFFF',
          }}
        >
          Home
        </div>
        <div
          className="absolute"
          style={{
            width: '179px',
            height: '104px',
            left: '632px',
            top: '74px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
        </div>

        {/* About section */}
        <div
          className="absolute font-semibold"
          style={{
            width: '51px',
            height: '24px',
            left: '1213px',
            top: '40px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15.75px',
            lineHeight: '24px',
            color: '#FFFFFF',
          }}
        >
          About
        </div>
        <div
          className="absolute"
          style={{
            width: '179px',
            height: '104px',
            left: '1213px',
            top: '74px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13.8906px',
              lineHeight: '20px',
              color: '#626977',
            }}
          >
            Case Opening
          </span>
        </div>
      </div>

      {/* Blur effect */}
      <div
        className="absolute"
        style={{
          width: '276px',
          height: '65px',
          left: '33px',
          top: '12px',
          background: 'rgba(2, 118, 255, 0.13)',
          filter: 'blur(45.65px)',
          borderRadius: '66px',
        }}
      />
    </div>
  );
}
