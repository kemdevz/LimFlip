'use client';

import { useState, useEffect } from 'react';
import CryptoTransactionHistory from './CryptoTransactionHistory';

interface CryptoDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoType?: 'BTC' | 'ETH' | 'LTC' | 'USDT' | 'SOL';
}

export default function CryptoDepositModal({ isOpen, onClose, cryptoType = 'BTC' }: CryptoDepositModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const cryptoConfig = {
    BTC: {
      name: 'Bitcoin (BTC)',
      address: 'bc1qrrpzxxse84pdvzw88vkvyx72mpfdpqha0w8la3..',
      icon: '/assets/wallet/btc.png',
      color: 'rgba(247, 147, 26, 0.25)',
    },
    ETH: {
      name: 'Ethereum (ETH)',
      address: '0xf1F31085Ca82786C9b2312CE9a1813E0C1067d10',
      icon: '/assets/wallet/eth.png',
      color: 'rgba(26, 141, 247, 0.25)',
    },
    LTC: {
      name: 'Litecoin (LTC)',
      address: 'LZeDCtPFRzhosRDjydDRqLyN6tgEuRULAj..',
      icon: '/assets/wallet/ltc.png',
      color: 'rgba(141, 141, 141, 0.25)',
    },
    USDT: {
      name: 'USDT (ERC20)',
      address: '0xf1F31085Ca82786C9b2312CE9a1813E0C1067d10',
      icon: '/assets/wallet/usdt.png',
      color: 'rgba(83, 174, 148, 0.25)',
    },
    SOL: {
      name: 'Solana (SOL)',
      address: '7p59FpE9H5wXHPBDL9SSSfasuWbE3fce6dQrYorbGc6v',
      icon: '/assets/wallet/sol.png',
      color: 'rgba(126, 123, 217, 0.25)',
    },
  };

  const config = cryptoConfig[cryptoType];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          width: '586px',
          height: '456px',
          left: '50%',
          top: '50%',
          transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.9)',
          background: '#191D29',
          border: '1px solid #222530',
          borderRadius: '15px',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            width: '20px',
            height: '2px',
            left: '93%',
            right: '3.92%',
            top: '7.46%',
            background: '#424964',
            cursor: 'pointer',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            width: '20px',
            height: '2px',
            left: '93%',
            right: '3.92%',
            top: '7.46%',
            background: '#424964',
            cursor: 'pointer',
            transform: 'rotate(-45deg)',
          }}
        />

        
        <div
          style={{
            position: 'absolute',
            width: '265px',
            height: '35px',
            left: '173px',
            top: '23px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '265px',
              height: '35px',
              left: '0px',
              top: '0px',
              background: '#1C212E',
              borderRadius: '15px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '4px',
              position: 'absolute',
              width: '238px',
              height: '29px',
              left: '6px',
              top: '3px',
            }}
          >
            
            <div
              onClick={() => setIsDeposit(true)}
              style={{
                width: '115px',
                height: '29px',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '115px',
                  height: '29px',
                  left: '0px',
                  top: '0px',
                  background: isDeposit ? '#2A3040' : 'transparent',
                  borderRadius: '9px',
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute',
                  left: '22px',
                  top: '6px',
                }}
              >
                <path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke={isDeposit ? '#FFFFFF' : '#64647C'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '20px',
                  left: '43px',
                  top: '4px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: isDeposit ? '#FFFFFF' : '#64647C',
                }}
              >
                Deposit
              </span>
            </div>

            
            <div
              onClick={() => setIsDeposit(false)}
              style={{
                width: '94px',
                height: '29px',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '5px',
                  transform: 'rotate(180deg)',
                }}
              >
                <path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke={!isDeposit ? '#FFFFFF' : '#64647C'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  width: '64px',
                  height: '20px',
                  left: '15px',
                  top: '4px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: !isDeposit ? '#FFFFFF' : '#4A4A5D',
                }}
              >
                Withdraw
              </span>
            </div>
          </div>
        </div>

        
        <span
          style={{
            position: 'absolute',
            width: '142px',
            height: '24px',
            left: '62px',
            top: '32px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
          }}
        >
          Wallet
        </span>

        
        <div
          style={{
            position: 'absolute',
            width: '642px',
            height: '42px',
            left: '28px',
            top: '74px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '535.6px',
              height: '40px',
              left: '0px',
              top: '-3px',
              border: '1px solid #2A3040',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '93px',
              height: '21px',
              left: '19px',
              top: '7px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#7C7C89',
            }}
          >
            {config.name}
          </span>
          <div
            style={{
              position: 'absolute',
              left: '78.97%',
              right: '19.78%',
              top: '30.95%',
              bottom: '33.33%',
              background: '#424964',
              transform: 'matrix(0, 1, 1, 0, 0, 0)',
              width: '2px',
              height: '16px',
            }}
          />
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '129px',
            height: '129px',
            left: '28px',
            top: '130px',
            background: `url(${config.icon})`,
            backgroundSize: 'cover',
            borderRadius: '12px',
            filter: `drop-shadow(0px 0px 41.8px ${config.color})`,
          }}
        />

        
        <span
          style={{
            position: 'absolute',
            width: '169px',
            height: '21px',
            left: '178px',
            top: '140px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '21px',
            color: '#FFFFFF',
          }}
        >
          {config.name} Deposit Address
        </span>

        
        <div
          style={{
            position: 'absolute',
            width: '387px',
            height: '36px',
            left: '177px',
            top: '166px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '387px',
              height: '36px',
              left: '0px',
              top: '0px',
              background: '#242937',
              borderRadius: '15px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              left: '10px',
              top: '7px',
              background: `url(${config.icon})`,
              backgroundSize: 'cover',
              filter: `drop-shadow(0px 0px 41.8px ${config.color})`,
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '303px',
              height: '20px',
              left: '40px',
              top: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#FFFFFF',
            }}
          >
            {config.address}
          </span>
          <div
            style={{
              position: 'absolute',
              width: '89px',
              height: '34px',
              left: '298px',
              top: '1px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '35px',
                height: '34px',
                left: '54px',
                top: '0px',
                background: '#0276FF',
                borderRadius: '0px 15px 15px 0px',
                cursor: 'pointer',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '11px',
                }}
              >
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M5 15H4C2.34315 15 1 13.6569 1 12C1 10.3431 2.34315 9 4 9H5"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M9 5V4C9 2.34315 10.3431 1 12 1C13.6569 1 15 2.34315 15 4V5"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        
        <span
          style={{
            position: 'absolute',
            width: '197px',
            height: '17px',
            left: '179px',
            top: '220px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '11px',
            lineHeight: '16px',
            color: '#697187',
          }}
        >
          This is your {config.name} deposit address.
        </span>
        <span
          style={{
            position: 'absolute',
            width: '339px',
            height: '17px',
            left: '179px',
            top: '240px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '11px',
            lineHeight: '16px',
            color: '#697187',
          }}
        >
          Only send {config.name.split(' ')[0]} to the address above through {config.name.split(' ')[0]} Network.
        </span>

        
        <div
          style={{
            position: 'absolute',
            width: '690px',
            height: '154px',
            left: '28px',
            top: '273px',
          }}
        >
          <CryptoTransactionHistory cryptoType={cryptoType} />
          <div
            style={{
              position: 'absolute',
              width: '5px',
              height: '118px',
              left: '540.95px',
              top: '7px',
              background: '#0276FF',
              borderRadius: '5px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
