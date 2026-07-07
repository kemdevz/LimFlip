'use client';

import { useState, useEffect } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className="responsive-modal-panel responsive-modal-panel--center"
        style={{
          position: 'relative',
          width: '586px',
          height: '584px',
          background: '#191D29',
          border: '1px solid #222530',
          borderRadius: '15px',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wallet header */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            left: '50%',
            top: '32px',
            transform: 'translateX(-50%)',
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
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '24px',
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

        {/* Deposit/Withdraw buttons */}
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
            {/* Deposit button */}
            <div
              style={{
                width: '115px',
                height: '29px',
                background: '#2A3040',
                borderRadius: '9px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
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
                  color: '#FFFFFF',
                }}
              >
                Deposit
              </span>
            </div>

            {/* Withdraw button */}
            <div
              style={{
                width: '94px',
                height: '29px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
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
                  color: '#676D7A',
                }}
              >
                Withdraw
              </span>
            </div>
          </div>
        </div>

        {/* Skins text label */}
        <span
          style={{
            position: 'absolute',
            width: '41px',
            height: '23px',
            left: '29px',
            top: '77px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            color: '#676D7A',
          }}
        >
          Skins
        </span>

        {/* Skins section */}
        <div
          style={{
            position: 'absolute',
            width: '537px',
            height: '85px',
            left: '29px',
            top: '105px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '537px',
              height: '85px',
              left: '0px',
              top: '0px',
              background: '#1C212E',
              borderRadius: '12px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '115px',
              height: '115px',
              left: '-7px',
              top: '-8px',
              background: 'url(/assets/wallet/mm2.png)',
              filter: 'blur(37.95px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '93px',
              height: '93px',
              left: '-4px',
              top: '0px',
              background: 'url(/assets/wallet/mm2.png)',
              backgroundSize: 'cover',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '123px',
              height: '21px',
              left: '108px',
              top: '24px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Murder Mystery 2
          </span>
          <span
            style={{
              position: 'absolute',
              width: '48px',
              height: '18px',
              left: '108px',
              top: '44px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '18px',
              color: '#4B4E5E',
            }}
          >
            ROBLOX
          </span>
        </div>

        {/* Cryptocurrencies section */}
        <div
          style={{
            position: 'absolute',
            width: '525px',
            height: '220px',
            left: '29px',
            top: '206px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '134px',
              height: '23px',
              left: '0px',
              top: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#676D7A',
            }}
          >
            Cryptocurrencies
          </span>

          {/* Crypto grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              alignContent: 'flex-start',
              padding: '0px',
              gap: '9px',
              position: 'absolute',
              width: '543px',
              height: '179px',
              left: '0px',
              top: '38px',
            }}
          >
            {/* Bitcoin */}
            <div
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '172px',
                  height: '85px',
                  left: '0px',
                  top: '0px',
                  background: '#1C212E',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '43px',
                  height: '43px',
                  left: '19px',
                  top: '21px',
                  background: 'url(/assets/wallet/btc.png)',
                  filter: 'drop-shadow(0px 0px 41.8px rgba(247, 147, 26, 0.25))',
                  backgroundSize: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '46px',
                  height: '20px',
                  left: '72px',
                  top: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Bitcoin
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '63px',
                  height: '18px',
                  left: '71px',
                  top: '44px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#4B4E5E',
                }}
              >
                ~$97919.21
              </span>
            </div>

            {/* Ethereum */}
            <div
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '172px',
                  height: '85px',
                  left: '0px',
                  top: '0px',
                  background: '#1C212E',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '43px',
                  height: '43px',
                  left: '19px',
                  top: '21px',
                  background: 'url(/assets/wallet/eth.png)',
                  filter: 'drop-shadow(0px 0px 41.8px rgba(26, 141, 247, 0.25))',
                  backgroundSize: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '65px',
                  height: '20px',
                  left: '72px',
                  top: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Ethereum
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '64px',
                  height: '18px',
                  left: '71px',
                  top: '44px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#4B4E5E',
                }}
              >
                ~$3300.48
              </span>
            </div>

            {/* Litecoin */}
            <div
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '172px',
                  height: '85px',
                  left: '0px',
                  top: '0px',
                  background: '#1C212E',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '43px',
                  height: '43px',
                  left: '19px',
                  top: '21px',
                  background: 'url(/assets/wallet/ltc.png)',
                  filter: 'drop-shadow(0px 0px 41.8px rgba(141, 141, 141, 0.25))',
                  backgroundSize: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '51px',
                  height: '20px',
                  left: '72px',
                  top: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Litecoin
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '49px',
                  height: '18px',
                  left: '71px',
                  top: '44px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#4B4E5E',
                }}
              >
                ~$88.62
              </span>
            </div>

            {/* USDT */}
            <div
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '172px',
                  height: '85px',
                  left: '0px',
                  top: '0px',
                  background: '#1C212E',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '43px',
                  height: '43px',
                  left: '19px',
                  top: '21px',
                  background: 'url(/assets/wallet/usdt.png)',
                  filter: 'drop-shadow(0px 0px 41.8px rgba(83, 174, 148, 0.25))',
                  backgroundSize: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '88px',
                  height: '20px',
                  left: '72px',
                  top: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                USDT(ERC20)
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '38px',
                  height: '18px',
                  left: '71px',
                  top: '44px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#4B4E5E',
                }}
              >
                ~$1.00
              </span>
            </div>

            {/* Solana */}
            <div
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '172px',
                  height: '85px',
                  left: '0px',
                  top: '0px',
                  background: '#1C212E',
                  borderRadius: '12px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '43px',
                  height: '43px',
                  left: '19px',
                  top: '21px',
                  background: 'url(/assets/wallet/sol.png)',
                  filter: 'drop-shadow(0px 0px 41.8px rgba(126, 123, 217, 0.25))',
                  backgroundSize: 'cover',
                  borderRadius: '999px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '47px',
                  height: '20px',
                  left: '72px',
                  top: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Solana
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '42px',
                  height: '18px',
                  left: '71px',
                  top: '44px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#4B4E5E',
                }}
              >
                $163.21
              </span>
            </div>
          </div>
        </div>

        {/* Cash section label */}
        <span
          style={{
            position: 'absolute',
            width: '40px',
            height: '23px',
            left: '29px',
            top: '434px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            color: '#676D7A',
          }}
        >
          Cash
        </span>

        {/* Cash payment methods */}
        <div
          style={{
            position: 'absolute',
            width: '543px',
            height: '85px',
            left: '29px',
            top: '465px',
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* Cards */}
          <div
            style={{
              width: '172px',
              height: '85px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '172px',
                height: '85px',
                left: '0px',
                top: '0px',
                background: '#1C212E',
                borderRadius: '12px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '19px',
                top: '21px',
                background: 'url(/assets/wallet/cards.png)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(255, 255, 255, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '40px',
                height: '20px',
                left: '90px',
                top: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Cards
            </span>
            <span
              style={{
                position: 'absolute',
                width: '23px',
                height: '18px',
                left: '90px',
                top: '44px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Fiat
            </span>
          </div>

          {/* CashApp */}
          <div
            style={{
              width: '172px',
              height: '85px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '172px',
                height: '85px',
                left: '0px',
                top: '0px',
                background: '#1C212E',
                borderRadius: '12px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '19px',
                top: '21px',
                background: 'url(/assets/wallet/cashapp.png)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(0, 214, 50, 0.25))',
                backgroundSize: 'cover',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '62px',
                height: '20px',
                left: '71px',
                top: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              CashApp
            </span>
            <span
              style={{
                position: 'absolute',
                width: '23px',
                height: '18px',
                left: '71px',
                top: '44px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Fiat
            </span>
          </div>

          {/* Giftcards */}
          <div
            style={{
              width: '172px',
              height: '85px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '172px',
                height: '85px',
                left: '0px',
                top: '0px',
                background: '#1C212E',
                borderRadius: '12px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '43px',
                height: '43px',
                left: '19px',
                top: '21px',
                background: '#0276FF',
                boxShadow: '0px 0px 41.8px rgba(2, 118, 255, 0.25)',
                borderRadius: '8px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '61px',
                height: '20px',
                left: '75px',
                top: '24px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Giftcards
            </span>
            <span
              style={{
                position: 'absolute',
                width: '23px',
                height: '18px',
                left: '75px',
                top: '44px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#4B4E5E',
              }}
            >
              Fiat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
