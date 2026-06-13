'use client';

import { useState, useEffect } from 'react';
import WalletModal from '../wallet/WalletModal';

interface NavbarProps {
  onSignUpClick?: () => void;
  onLogInClick?: () => void;
  onCoinflipClick?: () => void;
  onJackpotClick?: () => void;
}

export default function Navbar({ onSignUpClick, onLogInClick, onCoinflipClick, onJackpotClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <div
      className="absolute"
      style={{
        width: 'calc(100vw - min(22vw, 352px))',
        height: 'min(8vh, 92px)',
        left: 'min(22vw, 352px)',
        top: 'min(3.5vh, 39px)',
        background: '#191C25',
      }}
    >
      {/* Navigation items */}
      <div
        className="absolute"
        style={{
          left: 'min(3vw, 50px)',
          top: 'min(2.5vh, 35px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'min(3vw, 50px)',
        }}
      >
        {/* Coinflip */}
        <div
          onClick={onCoinflipClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/navbar/coinflip.svg"
            alt="Coinflip"
            width={26}
            height={26}
          />
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '19px',
              lineHeight: '28px',
              color: '#FFFFFF',
            }}
          >
            Coinflip
          </span>
        </div>

        {/* Jackpot */}
        <div
          onClick={onJackpotClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/navbar/jackpot.svg"
            alt="Jackpot"
            width={26}
            height={26}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '19px',
                lineHeight: '28px',
                color: '#4C526B',
              }}
            >
              Jackpot
            </span>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '17px',
                lineHeight: '24px',
                color: '#286DFF',
              }}
            >
              B$3.2k
            </span>
          </div>
        </div>

        {/* Divider */}
        <svg
          width="2"
          height="26"
          viewBox="0 0 2 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: '0px' }}
        >
          <rect width="2" height="26" rx="1" fill="#4C526B"/>
        </svg>

        {/* Market */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginLeft: '-2px',
          }}
        >
          <img
            src="/assets/svg/ui/market.svg"
            alt="Market"
            width={23}
            height={24}
          />
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '19px',
              lineHeight: '28px',
              color: '#4C526B',
            }}
          >
            Market
          </span>
        </div>
      </div>

      {/* Rectangle 18880 - Underline */}
      <div
        style={{
          position: 'absolute',
          width: '87px',
          height: '4px',
          left: 'calc(min(3vw, 50px) + 20px)',
          bottom: '0px',
          background: '#0276FF',
          borderRadius: '26px 26px 0px 0px',
        }}
      />

      {/* Auth buttons or Profile display */}
      {user ? (
        <>
          {/* Wallet balance display */}
          <div
            className="absolute"
            onClick={() => setIsWalletModalOpen(true)}
            style={{
              width: '252px',
              height: '44px',
              right: 'calc(min(2vw, 20px) + 250px)',
              top: 'min(2vh, 21px)',
              cursor: 'pointer',
            }}
          >
            {/* Main rectangle */}
            <div
              style={{
                position: 'absolute',
                width: '245px',
                height: '44px',
                left: '7px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '12px',
              }}
            >
              {/* Right accent rectangle */}
              <div
                style={{
                  position: 'absolute',
                  width: '115px',
                  height: '44px',
                  left: '137px',
                  top: '0px',
                  background: '#0276FF',
                  borderRadius: '0px 12px 12px 0px',
                }}
              />

              {/* Wallet icon */}
              <img
                src="/assets/svg/navbar/wallet.svg"
                alt="Wallet Icon"
                style={{
                  position: 'absolute',
                  width: '21px',
                  height: '17px',
                  left: '21px',
                  top: '13px',
                }}
              />

              {/* Balance text */}
              <span
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '23px',
                  left: '48px',
                  top: '10px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#FFFFFF',
                }}
              >
                B$6,412.09
              </span>

              {/* Deposit text */}
              <span
                style={{
                  position: 'absolute',
                  width: '81px',
                  height: '14px',
                  left: '165px',
                  top: '11px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#FFFFFF',
                }}
              >
                Deposit
              </span>
            </div>
          </div>

          {/* Sell Items button */}
          <div
            className="absolute"
            style={{
              width: '126px',
              height: '44px',
              right: 'calc(min(2vw, 20px) + 520px)',
              top: 'min(2vh, 21px)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '126px',
                height: '44px',
                left: '0px',
                top: '0px',
                background: '#0276FF',
                borderRadius: '12px',
              }}
            >
              {/* White circle background */}
              <div
                style={{
                  position: 'absolute',
                  width: '23px',
                  height: '23px',
                  left: '13px',
                  top: '10px',
                  background: '#D9D9D9',
                  borderRadius: '37px',
                  transform: 'rotate(180deg)',
                }}
              />
              {/* Sell Items icon */}
              <img
                src="/assets/svg/navbar/sellitems.svg"
                alt="Sell Items"
                style={{
                  position: 'absolute',
                  width: '16.56px',
                  height: '17.48px',
                  left: '15.76px',
                  top: '12.76px',
                  transform: 'rotate(0deg)',
                }}
              />
              {/* Sell Items text */}
              <span
                style={{
                  position: 'absolute',
                  width: '81px',
                  height: '14px',
                  left: '43.73px',
                  top: '11px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#FFFFFF',
                }}
              >
                Sell Items
              </span>
            </div>
          </div>

          {/* Notification icon */}
          <div
            className="absolute"
            style={{
              width: '45px',
              height: '45px',
              right: 'min(2vw, 20px)',
              top: 'min(2vh, 21px)',
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '44px',
                height: '44px',
                left: '0px',
                top: '1px',
                background: '#21252F',
                borderRadius: '12px',
              }}
            >
              <img
                src="/assets/svg/home/notification.svg"
                alt="Notification"
                style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  left: '8px',
                  top: '8px',
                }}
              />
            </div>
          </div>

          {/* Profile display */}
          <div
            className="absolute"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.reload();
            }}
            style={{
              width: '119px',
              height: '38px',
              right: 'calc(min(2vw, 20px) + 50px)',
              top: 'min(2vh, 21px)',
              zIndex: 20,
              cursor: 'pointer',
            }}
          >
          <span
            style={{
              position: 'absolute',
              width: '74px',
              height: '24px',
              left: '0px',
              top: '7px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.username}
          </span>
          <div
            style={{
              position: 'absolute',
              width: '38px',
              height: '38px',
              left: '81px',
              top: '0px',
              background: `url(https://tr.rbxcdn.com/${user.robloxUserId}/150/150/AvatarHeadshot/Png), #11151D`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '43px',
            }}
          />
          </div>
        </>
      ) : (
        <>
          {/* Log In button */}
          <div
            onClick={onLogInClick}
            style={{
              position: 'absolute',
              width: '92px',
              height: '44px',
              right: 'min(2vw, 20px)',
              top: 'min(2vh, 21px)',
              cursor: 'pointer',
            }}
          >
            {/* Rectangle 18825 */}
            <div
              style={{
                position: 'absolute',
                width: '92px',
                height: '44px',
                left: '0px',
                top: '0px',
                background: '#0276FF',
                borderRadius: '12px',
              }}
            />
            {/* Log In text */}
            <span
              style={{
                position: 'absolute',
                width: '43px',
                height: '20px',
                left: '24px',
                top: '12px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#FFFFFF',
              }}
            >
              Log In
            </span>
          </div>
        </>
      )}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
