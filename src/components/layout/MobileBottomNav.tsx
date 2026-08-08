'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';
import { useMobileLayout } from '@/context/MobileLayoutContext';
import { useState, useEffect, useRef } from 'react';

export default function MobileBottomNav() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useMobileLayout();
  const [activeIndex, setActiveIndex] = useState(1); // Default to coinflip (index 1)
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0); // Default to Home (index 0)
  const [menuIndicatorStyle, setMenuIndicatorStyle] = useState<{ top?: string; left?: string }>({});
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleButtonClick = (index: number, onClick: () => void) => {
    setActiveIndex(index);
    onClick();
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
    }
  };

  const buttons = [
    { index: 0, onClick: toggleSidebar },
    { index: 1, onClick: () => window.location.href = '/' },
    { index: 2, onClick: toggleMenu },
  ];

  useEffect(() => {
    if (buttonRefs.current[activeIndex]) {
      const button = buttonRefs.current[activeIndex];
      const container = button.parentElement;
      const containerRect = container?.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      
      if (containerRect) {
        setUnderlineStyle({
          left: buttonRect.left - containerRect.left + (buttonRect.width / 2) - 54,
          width: '108px',
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    if (menuItemRefs.current[activeMenuItem]) {
      const item = menuItemRefs.current[activeMenuItem];
      const itemRect = item.getBoundingClientRect();
      
      setMenuIndicatorStyle({
        top: `${itemRect.top + (itemRect.height / 2) - 2}px`,
        left: '20px',
      });
    }
  }, [activeMenuItem, menuOpen]);

  if (!isMobile) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(100%);
            }
          }
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          button {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        `}
      </style>
      
      {(menuOpen || isClosing) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#191C25',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'row',
            margin: 0,
            padding: 0,
            animation: isClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
          }}
        >
          
          <div
            style={{
              position: 'absolute',
              width: '42px',
              height: '4px',
              left: '0px',
              top: menuIndicatorStyle.top || '50%',
              transform: 'translateY(-50%) rotate(90deg)',
              background: '#006EFF',
              boxShadow: '0px 0px 4px rgba(0, 110, 255, 0.25)',
              borderRadius: '40px 8px 0px 0px',
              transition: 'top 0.3s ease',
            }}
          />

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingLeft: '62px',
              paddingTop: '60px',
              gap: '32px',
            }}
          >
            
            <button
              ref={(el) => { menuItemRefs.current[0] = el; }}
              onClick={() => {
                setActiveMenuItem(0);
                closeMenu();
                window.location.href = '/';
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Proxima Nova, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '18px',
                color: activeMenuItem === 0 ? '#286DFF' : '#535C7A',
                textShadow: activeMenuItem === 0 ? '0px 0px 4px rgba(0, 110, 255, 0.25)' : 'none',
                textAlign: 'left',
              }}
            >
              Coinflip
            </button>

            
            <button
              ref={(el) => { menuItemRefs.current[1] = el; }}
              onClick={() => {
                setActiveMenuItem(1);
                closeMenu();
                window.location.href = '/jackpot';
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Proxima Nova, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '18px',
                color: activeMenuItem === 1 ? '#286DFF' : '#535C7A',
                textShadow: activeMenuItem === 1 ? '0px 0px 4px rgba(0, 110, 255, 0.25)' : 'none',
                textAlign: 'left',
              }}
            >
              Jackpot
            </button>

            
            <button
              ref={(el) => { menuItemRefs.current[2] = el; }}
              onClick={() => {
                setActiveMenuItem(2);
                closeMenu();
                window.location.href = '/upgrader';
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Proxima Nova, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '18px',
                color: activeMenuItem === 2 ? '#286DFF' : '#535C7A',
                textShadow: activeMenuItem === 2 ? '0px 0px 4px rgba(0, 110, 255, 0.25)' : 'none',
                textAlign: 'left',
              }}
            >
              Upgrader
            </button>

            
            <button
              ref={(el) => { menuItemRefs.current[3] = el; }}
              onClick={() => {
                setActiveMenuItem(3);
                closeMenu();
                window.location.href = '/market';
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Proxima Nova, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '18px',
                color: activeMenuItem === 3 ? '#286DFF' : '#535C7A',
                textShadow: activeMenuItem === 3 ? '0px 0px 4px rgba(0, 110, 255, 0.25)' : 'none',
                textAlign: 'left',
              }}
            >
              Market
            </button>
          </div>

          
          <button
            onClick={closeMenu}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '59px',
              background: '#191C25',
              borderRadius: '10px 10px 0px 0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            
            <div
              style={{
                position: 'absolute',
                height: '4px',
                bottom: '0px',
                background: '#0276FF',
                borderRadius: '40px 8px 0px 0px',
                transition: 'left 0.3s ease',
                ...underlineStyle,
              }}
            />

            
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%',
                maxWidth: '400px',
                padding: '0 20px',
                height: '40px',
              }}
            >
              
              <button
                onClick={() => {
                  closeMenu();
                  toggleSidebar();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/assets/svg/navbar/chat.svg"
                  alt="Chat"
                  width={30}
                  height={30}
                />
              </button>

              
              <button
                onClick={() => {
                  closeMenu();
                  window.location.href = '/';
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/assets/svg/navbar/coinflip.svg"
                  alt="Coinflip"
                  width={22}
                  height={16}
                />
              </button>

              
              <button
                onClick={closeMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="19"
                  height="15"
                  viewBox="0 0 19 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 7.5H18M1 1H18M1 14H18" stroke="#0276FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '59px',
          left: '0px',
          bottom: '0px',
          background: '#191C25',
          borderRadius: '10px 10px 0px 0px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            height: '4px',
            bottom: '0px',
            background: '#0276FF',
            borderRadius: '40px 8px 0px 0px',
            transition: 'left 0.3s ease',
            ...underlineStyle,
          }}
        />

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '400px',
            padding: '0 20px',
            height: '40px',
          }}
        >
          
          <button
            ref={(el) => { buttonRefs.current[0] = el; }}
            onClick={() => handleButtonClick(0, toggleSidebar)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/svg/navbar/chat.svg"
              alt="Chat"
              width={30}
              height={30}
            />
          </button>

          
          <button
            ref={(el) => { buttonRefs.current[1] = el; }}
            onClick={() => handleButtonClick(1, () => window.location.href = '/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/assets/svg/navbar/coinflip.svg"
              alt="Coinflip"
              width={22}
              height={16}
            />
          </button>

          
          <button
            ref={(el) => { buttonRefs.current[2] = el; }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMenu();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="19"
              height="15"
              viewBox="0 0 19 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 7.5H18M1 1H18M1 14H18" stroke={menuOpen ? '#0276FF' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
