'use client';

import { useState, useEffect } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [promoCode, setPromoCode] = useState('');

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
          width: '653px',
          height: '418px',
          background: '#191B25',
          border: '1px solid #222530',
          borderRadius: '22px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: 'absolute',
            width: '675px',
            height: '49px',
            left: '0px',
            top: '344px',
          }}
        >
          {/* Redeem button */}
          <div
            style={{
              position: 'absolute',
              width: '102px',
              height: '40px',
              left: '533px',
              top: '14px',
              background: '#0276FF',
              borderRadius: '9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Proxima Nova, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '15px',
                color: '#FFFFFF',
              }}
            >
              Redeem
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              position: 'absolute',
              width: '675px',
              height: '1px',
              left: '0px',
              top: '0px',
              background: '#1E2333',
            }}
          />

          {/* Promo code input */}
          <div
            style={{
              position: 'absolute',
              width: '506px',
              height: '41px',
              left: '17px',
              top: '14px',
              background: '#1D202D',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter your promocode..."
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            />
          </div>
        </div>

        {/* Deposit/Withdraw buttons */}
        <div
          style={{
            position: 'absolute',
            width: '439px',
            height: '35px',
            left: '181px',
            top: '15px',
          }}
        >
          {/* Background rectangle */}
          <div
            style={{
              position: 'absolute',
              width: '297px',
              height: '35px',
              left: '0px',
              top: '0px',
              background: '#1D202D',
              borderRadius: '10px',
            }}
          />

          {/* Deposit button */}
          <div
            style={{
              position: 'absolute',
              width: '141px',
              height: '29px',
              left: '0px',
              top: '0px',
              background: '#262B3D',
              borderRadius: '9px',
              cursor: 'pointer',
            }}
          >
            {/* Icon */}
            <img
              src="/assets/wallet/deposit.svg"
              alt="Deposit"
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                left: '34px',
                top: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '51px',
                height: '16px',
                left: '56px',
                top: '7px',
                fontFamily: 'Gotham, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '13px',
                lineHeight: '16px',
                color: '#3C4157',
              }}
            >
              Deposit
            </span>
          </div>

          {/* Withdraw button */}
          <div
            style={{
              position: 'absolute',
              width: '141px',
              height: '29px',
              left: '149px',
              top: '0px',
              background: '#262B3D',
              borderRadius: '9px',
              cursor: 'pointer',
            }}
          >
            {/* Icon */}
            <img
              src="/assets/wallet/withdraw.svg"
              alt="Withdraw"
              style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                left: '28px',
                top: '5px',
                transform: 'rotate(-180deg)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '64px',
                height: '16px',
                left: '54px',
                top: '7px',
                fontFamily: 'Gotham, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '13px',
                lineHeight: '16px',
                color: '#FFFFFF',
              }}
            >
              Withdraw
            </span>
          </div>
        </div>

        {/* Skins section */}
        <div
          style={{
            position: 'absolute',
            width: '41px',
            height: '23px',
            left: '19px',
            top: '78px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            color: '#FFFFFF',
          }}
        >
          Skins
        </div>

        {/* Skins grid */}
        <div
          style={{
            position: 'absolute',
            width: '650px',
            height: '85px',
            left: '19px',
            top: '110px',
            display: 'flex',
            gap: '9px',
          }}
        >
          {/* Skin item 1 */}
          <div
            style={{
              width: '196px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '59px',
                height: '56px',
                left: '6px',
                top: '12px',
                background: 'url(/assets/wallet/mm2.png)',
                filter: 'blur(31.75px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '59px',
                height: '56px',
                left: '6px',
                top: '14px',
                background: 'url(/assets/wallet/mm2.png)',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '115px',
                height: '20px',
                left: '68px',
                top: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Murder Mystery 2
            </span>
            <span
              style={{
                position: 'absolute',
                width: '41px',
                height: '18px',
                left: '68px',
                top: '44px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Roblox
            </span>
          </div>

          {/* Skin item 2 */}
          <div
            style={{
              width: '196px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '59px',
                height: '56px',
                left: '6px',
                top: '12px',
                background: 'url(/assets/wallet/adopt-me.png)',
                opacity: 0.36,
                filter: 'blur(31.75px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '59px',
                height: '56px',
                left: '6px',
                top: '14px',
                background: 'url(/assets/wallet/adopt-me.png)',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '64px',
                height: '20px',
                left: '68px',
                top: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Adopt Me
            </span>
            <span
              style={{
                position: 'absolute',
                width: '41px',
                height: '18px',
                left: '68px',
                top: '44px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Roblox
            </span>
          </div>

          {/* Skin item 3 */}
          <div
            style={{
              width: '196px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '59px',
                height: '56px',
                left: '6px',
                top: '12px',
                background: 'url(/assets/wallet/ps99.png)',
                opacity: 0.36,
                filter: 'blur(31.75px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '53px',
                height: '62px',
                left: '9px',
                top: '7px',
                background: 'url(/assets/wallet/ps99.png)',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '109px',
                height: '20px',
                left: '71px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Pet Simulator 99
            </span>
            <span
              style={{
                position: 'absolute',
                width: '41px',
                height: '18px',
                left: '71px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Roblox
            </span>
          </div>
        </div>

        {/* Cryptocurrencies section */}
        <div
          style={{
            position: 'absolute',
            width: '134px',
            height: '23px',
            left: '22px',
            top: '206px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            color: '#FFFFFF',
          }}
        >
          Cryptocurrencies
        </div>

        {/* Crypto grid */}
        <div
          style={{
            position: 'absolute',
            width: '650px',
            height: '85px',
            left: '20px',
            top: '242px',
            display: 'flex',
            gap: '9px',
          }}
        >
          {/* BTC */}
          <div
            style={{
              width: '117px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '9px',
                top: '20px',
                background: 'url(/assets/wallet/btc.png)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(247, 147, 26, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '26px',
                height: '20px',
                left: '62px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              BTC
            </span>
            <span
              style={{
                position: 'absolute',
                width: '48px',
                height: '18px',
                left: '61px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              ~99.00k
            </span>
          </div>

          {/* ETH */}
          <div
            style={{
              width: '117px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '9px',
                top: '20px',
                background: 'url(/assets/wallet/eth.png)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(26, 141, 247, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '24px',
                height: '20px',
                left: '62px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              ETH
            </span>
            <span
              style={{
                position: 'absolute',
                width: '40px',
                height: '18px',
                left: '61px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              ~4.23k
            </span>
          </div>

          {/* LTC */}
          <div
            style={{
              width: '117px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '45px',
                height: '45px',
                left: '9px',
                top: '19px',
                background: 'url(/assets/wallet/ltc.png)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(141, 141, 141, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '24px',
                height: '20px',
                left: '62px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              LTC
            </span>
            <span
              style={{
                position: 'absolute',
                width: '44px',
                height: '18px',
                left: '61px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              ~100.27
            </span>
          </div>

          {/* USDT */}
          <div
            style={{
              width: '117px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '9px',
                top: '20px',
                background: 'url(/assets/wallet/usdt.png)',
                filter: 'drop-shadow(0px 0px 19.5px rgba(83, 174, 148, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '34px',
                height: '20px',
                left: '62px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              USDT
            </span>
            <span
              style={{
                position: 'absolute',
                width: '31px',
                height: '18px',
                left: '61px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              ~1.00
            </span>
          </div>

          {/* SOL */}
          <div
            style={{
              width: '117px',
              height: '85px',
              background: '#1D202D',
              borderRadius: '12px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '9px',
                top: '20px',
                background: 'url(/assets/wallet/sol.png)',
                filter: 'drop-shadow(0px 0px 19.5px rgba(126, 123, 217, 0.25))',
                backgroundSize: 'cover',
                borderRadius: '999px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '25px',
                height: '20px',
                left: '62px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              SOL
            </span>
            <span
              style={{
                position: 'absolute',
                width: '46px',
                height: '18px',
                left: '61px',
                top: '43px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              ~180.43
            </span>
          </div>
        </div>

        {/* Header section */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            left: '20px',
            top: '18.79px',
          }}
        >
          <img
            src="/assets/wallet/wallet.svg"
            alt="Wallet"
            width={23}
            height={20}
          />
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
            }}
          >
            Wallet
          </span>
        </div>

        {/* Close button */}
        <img
          src="/assets/wallet/x.svg"
          alt="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            width: '19px',
            height: '20px',
            right: '20px',
            top: '18px',
            cursor: 'pointer',
          }}
        />

        {/* Divider */}
        <div
          style={{
            position: 'absolute',
            width: '645px',
            height: '1px',
            left: '1px',
            top: '63px',
            background: '#262937',
          }}
        />
      </div>
    </div>
  );
}
