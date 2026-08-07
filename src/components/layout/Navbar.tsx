'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useMobileLayout } from '@/context/MobileLayoutContext';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import WalletModal from '@/components/wallet/WalletModal';

interface NavbarProps {
  onSignUpClick?: () => void;
  onLogInClick?: () => void;
  onCoinflipClick?: () => void;
  onJackpotClick?: () => void;
  onSellItemsClick?: () => void;
}

export default function Navbar({ onSignUpClick, onLogInClick, onCoinflipClick, onJackpotClick, onSellItemsClick }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useMobileLayout();
  const { user, loading, error } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(87);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `B$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `B$${amount.toFixed(2)}`;
    }
  };

  const navItems = [
    {
      id: 'coinflip',
      label: 'Coinflip',
      icon: '/assets/svg/coinflip/coin.svg',
      active: pathname === '/',
      onClick: onCoinflipClick ?? (() => router.push('/')),
    },
    {
      id: 'jackpot',
      label: 'Jackpot',
      icon: '/assets/svg/navbar/jackpot.svg',
      activeIcon: '/assets/svg/navbar/jackpot-active.svg',
      active: pathname === '/jackpot',
      onClick: onJackpotClick ?? (() => router.push('/jackpot')),
      badge: 'B$3.2k',
    },
    {
      id: 'upgrader',
      label: 'Upgrader',
      icon: '/assets/svg/navbar/upgrader.svg',
      activeIcon: '/assets/svg/navbar/upgrader-active.svg',
      active: pathname === '/upgrader',
      onClick: () => router.push('/upgrader'),
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: '/assets/svg/navbar/cases.svg',
      activeIcon: '/assets/svg/navbar/cases-active.svg',
      active: pathname === '/cases',
      onClick: () => router.push('/cases'),
    },
    {
      id: 'market',
      label: '',
      icon: '/assets/svg/ui/market.svg',
      activeIcon: '/assets/svg/ui/market-active.svg',
      active: pathname === '/market',
      onClick: () => router.push('/market'),
      iconSize: { width: 19, height: 20 },
    },
    {
      id: 'affiliates',
      label: '',
      icon: '/assets/svg/navbar/affiliates.svg',
      activeIcon: '/assets/svg/navbar/affiliates-active.svg',
      active: pathname === '/affiliates',
      onClick: () => router.push('/affiliates'),
    },
  ];

  const activeIndex = navItems.findIndex((item) => item.active);

  useEffect(() => {
    if (!isMobile && activeIndex >= 0 && navRefs.current[activeIndex]) {
      const navbar = document.querySelector('.app-navbar');
      if (navbar) {
        const navbarRect = navbar.getBoundingClientRect();
        const navItemRect = navRefs.current[activeIndex]!.getBoundingClientRect();
        setUnderlineLeft(navItemRect.left - navbarRect.left);
        setUnderlineWidth(navItemRect.width);
      }
    }
  }, [activeIndex, isMobile]);


  return (
    <div className="app-navbar">
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 min(3vw, 50px)',
          gap: isMobile ? '8px' : '26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '26px', minWidth: 0, flex: 1 }}>
          {isMobile && (
            <img
              src="/assets/svg/ui/logo.svg"
              alt="MM2Stake"
              style={{
                width: '120px',
                height: '23px',
                flexShrink: 0,
              }}
            />
          )}

          {!isMobile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '26px',
                marginLeft: '26px',
              }}
            >
              {navItems.map((item, index) => (
                <div 
                  key={item.id}
                  ref={(el) => { navRefs.current[index] = el; }}
                  style={{ marginRight: (item.id === 'market' || item.id === 'affiliates') ? '-10px' : '0' }}
                >
                  {index === 4 && (
                    <svg width="2" height="26" viewBox="0 0 2 26" fill="none" style={{ display: 'inline-block', marginRight: '26px', verticalAlign: 'middle' }}>
                      <rect width="2" height="26" rx="1" fill="#4C526B" />
                    </svg>
                  )}
                  <div
                    onClick={item.onClick}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.active && (item as any).activeIcon ? (item as any).activeIcon : item.icon}
                      alt={item.label}
                      width={item.iconSize?.width ?? 26}
                      height={item.iconSize?.height ?? 26}
                      style={{
                        filter: item.active && !(item as any).activeIcon ? 'none' : !item.active ? 'grayscale(100%)' : 'none',
                        opacity: item.active ? 1 : 0.5,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '19px',
                        lineHeight: '28px',
                        color: item.active ? '#FFFFFF' : '#4C526B',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          fontFamily: 'Poppins',
                          fontWeight: 600,
                          fontSize: '17px',
                          lineHeight: '24px',
                          color: '#286DFF',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {user ? (
            <>
              {!isMobile && (
                <>
                  <button type="button" onClick={() => onSellItemsClick && onSellItemsClick()} style={{ width: '126px', height: '44px', background: '#0276FF', borderRadius: '12px', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '23px', height: '23px', left: '13px', top: '10px', background: '#D9D9D9', borderRadius: '37px' }}>
                      <svg width="16.56" height="17.48" viewBox="0 0 16.56 17.48" fill="none" style={{ position: 'absolute', left: '2.76px', top: '2.76px', transform: 'rotate(-90deg)' }}>
                        <path d="M3.65 8.74L12.91 8.74" stroke="#006EFF" strokeWidth="2" />
                        <path d="M8.28 14.07L13.61 8.74L8.28 3.41" stroke="#006EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF', position: 'absolute', left: '43.73px', top: '11px' }}>
                      Sell Items
                    </span>
                  </button>
                  <div
                    onClick={() => setIsWalletModalOpen(true)}
                    style={{ width: '245px', height: '44px', position: 'relative', cursor: 'pointer' }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: '#1E222F', borderRadius: '12px' }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsWalletModalOpen(true);
                        }}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          width: '115px',
                          height: '44px',
                          background: '#0276FF',
                          borderRadius: '0 12px 12px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>Deposit</span>
                      </div>
                      <div style={{ position: 'absolute', left: '0', top: '0', width: '130px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <img src="/assets/svg/navbar/wallet.svg" alt="Wallet" style={{ width: '21px', height: '17px' }} />
                        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#FFFFFF' }}>
                          {formatAmount(user?.balance || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(true)}
                  style={{ width: '36px', height: '36px', background: '#1E222F', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Wallet"
                >
                  <img src="/assets/svg/navbar/wallet.svg" alt="" width={18} height={14} />
                </button>
              )}
              <div style={{ position: 'relative' }}>
                <div
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  {!isMobile && (
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', color: '#FFFFFF', maxWidth: '74px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.username}
                    </span>
                  )}
                  <div
                    style={{
                      width: isMobile ? '32px' : '38px',
                      height: isMobile ? '32px' : '38px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flex: 'none',
                    }}
                  >
                    <img
                      src={user?.avatarUrl || '/assets/images/coinflip/item_1side.png'}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onLoad={(e) => {
                        console.log('Navbar image loaded:', (e.target as HTMLImageElement).src);
                      }}
                      onError={(e) => {
                        console.log('Navbar image error, using fallback');
                        (e.target as HTMLImageElement).src = '/assets/images/coinflip/item_1side.png';
                      }}
                    />
                  </div>
                </div>
                {isProfileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '153px',
                      height: '120px',
                      right: '0',
                      top: '50px',
                      background: '#21252F',
                      boxShadow: '0px 4px 9.3px rgba(0, 0, 0, 0.25)',
                      borderRadius: '15px',
                      zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '6px',
                        position: 'absolute',
                        width: '62px',
                        height: '72px',
                        left: '49px',
                        top: '12px',
                      }}
                    >
                      <div
                        onClick={() => {
                          router.push('/profile');
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          width: '41px',
                          height: '20px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          textAlign: 'center',
                        }}
                      >
                        Profile
                      </div>
                      <div
                        onClick={() => {
                          router.push('/market');
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          width: '62px',
                          height: '20px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: pathname === '/market' ? '#0276FF' : '#FFFFFF',
                          cursor: 'pointer',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          textAlign: 'center',
                        }}
                      >
                        Inventory
                      </div>
                      <div
                        onClick={() => {
                          router.push('/settings');
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          width: '54px',
                          height: '20px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          flex: 'none',
                          order: 2,
                          flexGrow: 0,
                          textAlign: 'center',
                        }}
                      >
                        Settings
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        width: '66.5px',
                        height: '18px',
                        left: '42px',
                        top: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3.5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        localStorage.removeItem('token');
                        setIsProfileDropdownOpen(false);
                        window.location.reload();
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '13px',
                          height: '13px',
                          left: '0px',
                          top: '1px',
                          transform: 'rotate(-90deg)',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M6.5 2.5V10.5" stroke="#006EFF" strokeWidth="2" strokeLinecap="round" />
                          <path d="M3.5 7.5L6.5 10.5L9.5 7.5" stroke="#006EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          width: '50px',
                          height: '18px',
                          left: '16.5px',
                          top: '0px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '12px',
                          lineHeight: '18px',
                          color: '#FFFFFF',
                        }}
                      >
                        Log-Out
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogInClick}
              style={{
                height: isMobile ? '36px' : '44px',
                padding: isMobile ? '0 14px' : '0 24px',
                background: '#0276FF',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: isMobile ? '13px' : '14px',
                color: '#FFFFFF',
              }}
            >
              Log In
            </button>
          )}
          
          
          <div style={{ position: 'relative', width: '45px', height: '45px', marginLeft: '8px' }}>
            <div 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ position: 'absolute', width: '44px', height: '44px', left: '0px', top: '1px', background: '#1E222F', borderRadius: '12px' }} />
              <div style={{ position: 'absolute', width: '28px', height: '28px', left: '8px', top: '8px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7387 23.9107C11.6592 23.5985 11.9279 23.3333 12.25 23.3333H15.75C16.0722 23.3333 16.3408 23.5985 16.2614 23.9107C16.0044 24.9201 15.0894 25.6666 14 25.6666C12.9107 25.6666 11.9957 24.9201 11.7387 23.9107Z" fill="#485064"/>
                  <path d="M15.1717 4.66675H12.8282L11.6245 5.09975C8.85011 6.09777 7.00019 8.72922 7.00019 11.6776V13.2247C7.00019 14.0807 6.59769 14.8869 5.91348 15.4014C3.52488 17.1973 4.79502 21.0001 7.78346 21.0001H20.2168C23.2053 21.0001 24.4754 17.1973 22.0869 15.4014C21.4027 14.8869 21.0002 14.0807 21.0002 13.2247V11.6778C21.0002 8.72926 19.1502 6.09778 16.3757 5.09981L15.1717 4.66675Z" fill="#485064"/>
                  <path d="M12.8333 3.49992C12.8333 2.85559 13.3556 2.33325 13.9999 2.33325V2.33325C14.6443 2.33325 15.1666 2.85559 15.1666 3.49992V4.66659H12.8333V3.49992Z" fill="#485064"/>
                </svg>
              </div>
            </div>
            {/* <Notifications isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} /> */}
          </div>
        </div>
      </div>

      {!isMobile && activeIndex >= 0 && (
        <div
          style={{
            position: 'absolute',
            width: `${underlineWidth}px`,
            height: '4px',
            left: `${underlineLeft}px`,
            bottom: 0,
            background: '#0276FF',
            borderRadius: '26px 26px 0 0',
            transition: 'left 0.3s ease-out, width 0.3s ease-out',
          }}
        />
      )}

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
