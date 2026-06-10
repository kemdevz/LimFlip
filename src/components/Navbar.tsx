'use client';

import { useState, useEffect } from 'react';
import WalletModal from './WalletModal';

interface NavbarProps {
  onSignUpClick?: () => void;
  onLogInClick?: () => void;
  onCoinflipClick?: () => void;
  onDiceDuelClick?: () => void;
  onJackpotClick?: () => void;
}

export default function Navbar({ onSignUpClick, onLogInClick, onCoinflipClick, onDiceDuelClick, onJackpotClick }: NavbarProps) {
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
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/navbar/coinflip.svg"
            alt="Coinflip"
            width={22}
            height={22}
          />
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontSize: 'min(1.3vw, 17px)',
              lineHeight: '1',
              color: '#286DFF',
              fontWeight: '700',
            }}
          >
            Coinflip
          </span>
        </div>

        {/* Dice Duel */}
        <div
          onClick={onDiceDuelClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/navbar/dice.svg"
            alt="Dice"
            width={21}
            height={21}
          />
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontSize: '17px',
              lineHeight: '17px',
              color: '#4C526B',
              fontWeight: '700',
            }}
          >
            Dice Duel
          </span>
        </div>

        {/* Jackpot */}
        <div
          onClick={onJackpotClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/navbar/jackpot.svg"
            alt="Jackpot"
            width={17}
            height={17}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                fontFamily: 'Proxima Nova, sans-serif',
                fontSize: '17px',
                lineHeight: '17px',
                color: '#4C526B',
                fontWeight: '700',
              }}
            >
              Jackpot
            </span>
            <span
              style={{
                fontFamily: 'Proxima Nova, sans-serif',
                fontSize: '15px',
                lineHeight: '15px',
                color: '#286DFF',
                fontWeight: '700',
              }}
            >
              R$3.2k
            </span>
          </div>
        </div>
      </div>

      {/* Auth buttons or Profile display */}
      {user ? (
        <>
          {/* Wallet balance display */}
          <div
            className="absolute"
            onClick={() => setIsWalletModalOpen(true)}
            style={{
              width: '229px',
              height: '38px',
              right: 'calc(min(2vw, 20px) + 250px)',
              top: 'min(2vh, 21px)',
              cursor: 'pointer',
            }}
          >
            {/* Main rectangle */}
            <div
              style={{
                position: 'absolute',
                width: '218px',
                height: '38px',
                left: '11px',
                top: '0px',
                background: 'rgba(2, 118, 255, 0.24)',
                boxShadow: '0px 4px 57.9px rgba(11, 87, 175, 0.25)',
                borderRadius: '17px',
              }}
            >
              {/* Right accent rectangle */}
              <div
                style={{
                  position: 'absolute',
                  width: '82px',
                  height: '38px',
                  left: '136px',
                  top: '0px',
                  background: 'rgba(2, 118, 255, 0.24)',
                  borderRadius: '0px 17px 17px 0px',
                }}
              />

              {/* Balance text */}
              <img
                src="/assets/svg/navbar/wallet.svg"
                alt="Wallet Icon"
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '16px',
                  left: '16px',
                  top: '11px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '63px',
                  height: '24px',
                  left: '44px',
                  top: '7px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#2F8FFF',
                }}
              >
                $678.23
              </span>

              {/* Divider */}
              <img
                src="/assets/svg/navbar/divider.svg"
                alt="Divider"
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '15px',
                  left: '110px',
                  top: '11px',
                }}
              />

              {/* Wallet text */}
              <span
                style={{
                  position: 'absolute',
                  width: '52px',
                  height: '24px',
                  left: '145px',
                  top: '7px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#D6E9FF',
                }}
              >
                Wallet
              </span>

              {/* Down arrow */}
              <img
                src="/assets/svg/navbar/downwalletarrow.svg"
                alt="Down Arrow"
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '7px',
                  left: '115px',
                  top: '15px',
                }}
              />
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
            style={{
              width: 'min(10vw, 159px)',
              height: '38px',
              right: 'calc(min(2vw, 20px) + 70px)',
              top: 'min(2vh, 21px)',
              background: 'transparent',
              borderRadius: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
              marginRight: '5px',
            }}
          >
            {user.username}
          </span>
          <div
            style={{
              width: '38px',
              height: '38px',
              background: 'url(/1SIDE.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '43px',
            }}
          />
          </div>

          {/* Arrow between pfp and notification */}
          <img
            src="/assets/svg/home/arrow.svg"
            alt="Arrow"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.reload();
            }}
            style={{
              position: 'absolute',
              right: 'calc(min(2vw, 20px) + 60px)',
              top: 'calc(min(2vh, 21px) + 13px)',
              transform: 'rotate(0deg)',
              width: '12px',
              height: '12px',
              zIndex: 11,
              cursor: 'pointer',
            }}
          />
        </>
      ) : (
        <>
          {/* Sign Up button */}
          <div
            className="absolute"
            onClick={onSignUpClick}
            style={{
              width: 'min(10vw, 159px)',
              height: 'min(4.5vh, 50px)',
              right: 'min(2vw, 20px)',
              top: 'min(2vh, 21px)',
              background: '#006EFF',
              borderRadius: '13px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: 'auto',
                height: 'auto',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'min(1.3vw, 17px)',
                lineHeight: '1',
                color: '#FFFFFF',
                fontWeight: '600',
              }}
            >
              Sign Up
            </span>
          </div>

          {/* Log In button */}
          <div
            className="absolute"
            onClick={onLogInClick}
            style={{
              width: 'min(10vw, 159px)',
              height: 'min(4.5vh, 50px)',
              right: 'min(16vw, 200px)',
              top: 'min(2vh, 21px)',
              background: '#242737',
              borderRadius: '13px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: 'auto',
                height: 'auto',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'min(1.3vw, 17px)',
                lineHeight: '1',
                color: '#4A4F6F',
                fontWeight: '600',
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
