'use client';

import { useState, useEffect } from 'react';
import CardsDeposit from './CardsDeposit';
import MM2WithdrawModal from './MM2WithdrawModal';
import CryptoTransactionHistory from './CryptoTransactionHistory';
import { User } from '@/types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'LTC' | 'USDT' | 'SOL' | null>(null);
  const [isWithdrawMode, setIsWithdrawMode] = useState(false);
  const [withdrawCrypto, setWithdrawCrypto] = useState<'BTC' | 'ETH' | 'LTC' | 'USDT' | 'SOL' | null>(null);
  const [isMM2Mode, setIsMM2Mode] = useState(false);
  const [isMM2DepositMode, setIsMM2DepositMode] = useState(false);
  const [isCardsMode, setIsCardsMode] = useState(false);
  const [isMM2WithdrawOpen, setIsMM2WithdrawOpen] = useState(false);

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
      name: 'Bitcoin',
      address: 'bc1qrrpzxxse84pdvzw88vkvyx72mpfdpqha0w8la3..',
      icon: '/assets/wallet/btc.png',
      color: 'rgba(247, 147, 26, 0.25)',
    },
    ETH: {
      name: 'Ethereum',
      address: '0xf1F31085Ca82786C9b2312CE9a1813E0C1067d10',
      icon: '/assets/wallet/eth.png',
      color: 'rgba(26, 141, 247, 0.25)',
    },
    LTC: {
      name: 'Litecoin',
      address: 'LZeDCtPFRzhosRDjydDRqLyN6tgEuRULAj..',
      icon: '/assets/wallet/ltc.png',
      color: 'rgba(141, 141, 141, 0.25)',
    },
    USDT: {
      name: 'USDT',
      address: '0xf1F31085Ca82786C9b2312CE9a1813E0C1067d10',
      icon: '/assets/wallet/usdt.png',
      color: 'rgba(83, 174, 148, 0.25)',
    },
    SOL: {
      name: 'Solana',
      address: '7p59FpE9H5wXHPBDL9SSSfasuWbE3fce6dQrYorbGc6v',
      icon: '/assets/wallet/sol.png',
      color: 'rgba(126, 123, 217, 0.25)',
    },
  };

  const config = selectedCrypto ? cryptoConfig[selectedCrypto] : null;

  return (
    <>
    <div
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 2000,
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
          height: isCardsMode ? '313px' : isMM2Mode ? '400px' : isMM2DepositMode ? '500px' : isWithdrawMode ? '528px' : selectedCrypto ? '450px' : '584px',
          background: '#191D29',
          border: '1px solid #222530',
          borderRadius: '15px',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out, height 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {!isMM2DepositMode && !isMM2Mode && !isCardsMode && (
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              left: '62px',
              top: '32px',
            }}
          >
            <svg
              width="23"
              height="20"
              viewBox="0 0 23 20"
              fill="none"
              style={{
                position: 'absolute',
                left: '-28px',
                top: '2px',
              }}
            >
              <path
                d="M4.6 19.7251C3.335 19.7251 2.25208 19.2423 1.35125 18.2766C0.450417 17.3109 0 16.15 0 14.7939V4.93128C0 3.57518 0.450417 2.41427 1.35125 1.44856C2.25208 0.482855 3.335 0 4.6 0H18.4C19.665 0 20.7479 0.482855 21.6488 1.44856C22.5496 2.41427 23 3.57518 23 4.93128V14.7939C23 16.15 22.5496 17.3109 21.6488 18.2766C20.7479 19.2423 19.665 19.7251 18.4 19.7251H4.6ZM4.6 4.93128H18.4C18.8217 4.93128 19.2242 4.98265 19.6075 5.08539C19.9908 5.18812 20.355 5.3525 20.7 5.57851V4.93128C20.7 4.25323 20.475 3.67298 20.0249 3.19054C19.5749 2.7081 19.0333 2.46646 18.4 2.46564H4.6C3.9675 2.46564 3.42623 2.70727 2.9762 3.19054C2.52617 3.67381 2.30077 4.25405 2.3 4.93128V5.57851C2.645 5.3525 3.00917 5.18812 3.3925 5.08539C3.77583 4.98265 4.17833 4.93128 4.6 4.93128ZM2.4725 8.93795L15.2662 12.2666C15.4387 12.3077 15.6113 12.3077 15.7838 12.2666C15.9563 12.2255 16.1192 12.1433 16.2725 12.02L20.2687 8.44482C20.0579 8.13662 19.7896 7.88512 19.4637 7.69034C19.1379 7.49555 18.7833 7.39775 18.4 7.39693H4.6C4.10167 7.39693 3.66582 7.53582 3.29245 7.81362C2.91908 8.09142 2.64577 8.46619 2.4725 8.93795Z"
                fill="#A855F7"
              />
            </svg>
            <span
              style={{
                width: '142px',
                height: '24px',
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
            {selectedCrypto && (
              <div
                onClick={() => setSelectedCrypto(null)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: '20px',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  <path
                    d="M12 4V20M12 4L8 8M12 4L16 8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                  Back
                </span>
              </div>
            )}
          </div>
        )}


        <img
          src="/assets/svg/ui/x.svg"
          alt="Close"
          onClick={() => {
            if (isCardsMode) {
              setIsCardsMode(false);
            } else if (isMM2Mode) {
              setIsMM2Mode(false);
            } else if (isMM2DepositMode) {
              setIsMM2DepositMode(false);
            } else if (selectedCrypto) {
              setSelectedCrypto(null);
            } else if (isWithdrawMode) {
              setIsWithdrawMode(false);
              setWithdrawCrypto(null);
            } else {
              onClose();
            }
          }}
          style={{
            position: 'absolute',
            width: '19px',
            height: '20px',
            right: '20px',
            top: '32px',
            cursor: 'pointer',
          }}
        />

        
        {selectedCrypto && config && (
          <>
            
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
                  style={{
                    width: '115px',
                    height: '29px',
                    background: '#2A3040',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
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
                      stroke="#FFFFFF"
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
                      color: '#FFFFFF',
                    }}
                  >
                    Deposit
                  </span>
                </div>

                
                <div
                  onClick={() => {
                    setSelectedCrypto(null);
                    setIsWithdrawMode(true);
                  }}
                  style={{
                    width: '94px',
                    height: '29px',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <path
                      d="M12 4V20M12 4L8 8M12 4L16 8"
                      stroke="#64647C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#4A4A5D',
                    }}
                  >
                    Withdraw
                  </span>
                </div>
              </div>
            </div>

            
            <div
              style={{
                position: 'absolute',
                width: '535px',
                height: '42px',
                left: '28px',
                top: '74px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '535px',
                  height: '40px',
                  left: '0px',
                  top: '-3px',
                  border: '1px solid #2A3040',
                  borderRadius: '15px',
                }}
              />
              <img
                src={config.icon}
                alt={config.name}
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  left: '16px',
                  top: '5px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '93px',
                  height: '20px',
                  left: '48px',
                  top: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                {config.name}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '11px',
                }}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#64647C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                left: '28px',
                top: '126px',
                background: '#1C212E',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/assets/wallet/qr-code.png"
                alt="QR Code"
                style={{
                  width: '100px',
                  height: '100px',
                }}
              />
            </div>

            
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
              <img
                src={config.icon}
                alt={config.name}
                style={{
                  position: 'absolute',
                  width: '22px',
                  height: '22px',
                  left: '10px',
                  top: '7px',
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
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
                  background: '#C77DFF',
                  borderRadius: '0px 15px 15px 0px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0px',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                >
                  <path
                    d="M10.1111 13.5H3.88889C3.27005 13.5 2.67656 13.2629 2.23897 12.841C1.80139 12.419 1.55556 11.8467 1.55556 11.25V3.75C1.55556 3.55109 1.47361 3.36032 1.32775 3.21967C1.18189 3.07902 0.984057 3 0.777778 3C0.571498 3 0.373667 3.07902 0.227806 3.21967C0.0819442 3.36032 0 3.55109 0 3.75V11.25C0 12.2446 0.409721 13.1984 1.13903 13.9017C1.86834 14.6049 2.85749 15 3.88889 15H10.1111C10.3174 15 10.5152 14.921 10.6611 14.7803C10.8069 14.6397 10.8889 14.4489 10.8889 14.25C10.8889 14.0511 10.8069 13.8603 10.6611 13.7197C10.5152 13.579 10.3174 13.5 10.1111 13.5ZM14 5.205C13.9919 5.1361 13.9763 5.06822 13.9533 5.0025V4.935C13.9159 4.85788 13.8661 4.787 13.8056 4.725L9.13889 0.225C9.07459 0.166662 9.00108 0.118561 8.92111 0.0824999H8.85111L8.60222 0H5.44444C4.82561 0 4.23211 0.237053 3.79453 0.65901C3.35694 1.08097 3.11111 1.65326 3.11111 2.25V9.75C3.11111 10.3467 3.35694 10.919 3.79453 11.341C4.23211 11.7629 4.82561 12 5.44444 12H11.6667C12.2855 12 12.879 11.7629 13.3166 11.341C13.7542 10.919 14 10.3467 14 9.75V5.25C14 5.25 14 5.25 14 5.205ZM9.33333 2.5575L11.3478 4.5H10.1111C9.90483 4.5 9.707 4.42098 9.56114 4.28033C9.41528 4.13968 9.33333 3.94891 9.33333 3.75V2.5575ZM12.4444 9.75C12.4444 9.94891 12.3625 10.1397 12.2166 10.2803C12.0708 10.421 11.8729 10.5 11.6667 10.5H5.44444C5.23817 10.5 5.04033 10.421 4.89447 10.2803C4.74861 10.1397 4.66667 9.94891 4.66667 9.75V2.25C4.66667 2.05109 4.74861 1.86032 4.89447 1.71967C5.04033 1.57902 5.23817 1.5 5.44444 1.5H7.77778V3.75C7.77778 4.34674 8.02361 4.91903 8.4612 5.34099C8.89878 5.76295 9.49227 6 10.1111 6H12.4444V9.75Z"
                    fill="white"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '20px',
                    color: '#FFFFFF',
                  }}
                >
                  Copy
                </span>
              </div>
            </div>

            
            <span
              style={{
                position: 'absolute',
                width: '200px',
                height: '21px',
                left: '178px',
                top: '140px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {config.name.split(' ')[0]} Deposit Address
            </span>

            
            <span
              style={{
                position: 'absolute',
                width: '250px',
                height: '17px',
                left: '179px',
                top: '220px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '11px',
                lineHeight: '16px',
                color: '#697187',
                whiteSpace: 'nowrap',
              }}
            >
              This is your {config.name.split(' ')[0]} deposit address.
            </span>
            <span
              style={{
                position: 'absolute',
                width: '380px',
                height: '34px',
                left: '179px',
                top: '242px',
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
                width: '534px',
                height: '136px',
                left: '28px',
                top: '295px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '6px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '534px',
                  height: '136px',
                  left: '0px',
                  top: '0px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '6px',
                }}
              >
                <CryptoTransactionHistory cryptoType={selectedCrypto || 'BTC'} />
              </div>
            </div>
          </>
        )}

        
        {isWithdrawMode && (
          <>
            
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
                  onClick={() => {
                    setIsWithdrawMode(false);
                    setWithdrawCrypto(null);
                  }}
                  style={{
                    width: '115px',
                    height: '29px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 4V20M12 4L8 8M12 4L16 8"
                      stroke="#64647C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#4A4A5D',
                    }}
                  >
                    Deposit
                  </span>
                </div>

                
                <div
                  style={{
                    width: '115px',
                    height: '29px',
                    background: '#2A3040',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transform: 'rotate(180deg)',
                    }}
                  >
                    <path
                      d="M12 4V20M12 4L8 8M12 4L16 8"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    Withdraw
                  </span>
                </div>
              </div>
            </div>

            {!withdrawCrypto ? (
              <>
                
                <span
                  style={{
                    position: 'absolute',
                    width: '41px',
                    height: '23px',
                    left: '29px',
                    top: '74px',
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


                <div
                  onClick={() => isWithdrawMode ? setIsMM2WithdrawOpen(true) : window.open('https://www.roblox.com/share?code=08e9a905497e2541bad83194f3fc0888&type=Server', '_blank')}
                  style={{
                    position: 'absolute',
                    width: '537px',
                    height: '85px',
                    left: '29px',
                    top: '102px',
                    overflow: 'hidden',
                    cursor: 'pointer',
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

                
                <span
                  style={{
                    position: 'absolute',
                    width: '121px',
                    height: '23px',
                    left: '29px',
                    top: '203px',
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

                
                <div
                  style={{
                    position: 'absolute',
                    width: '560px',
                    height: '200px',
                    left: '28px',
                    top: '231px',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {Object.entries(cryptoConfig).map(([key, crypto]) => (
                    <div
                      key={key}
                      onClick={() => setWithdrawCrypto(key as any)}
                      style={{
                        width: '172px',
                        height: '85px',
                        background: '#1C212E',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '43px',
                          height: '43px',
                          left: '19px',
                          top: '21px',
                          background: `url(${crypto.icon})`,
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
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {crypto.name}
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          width: '48px',
                          height: '18px',
                          left: '72px',
                          top: '44px',
                          fontFamily: 'Poppins, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '12px',
                          lineHeight: '18px',
                          color: '#4B4E5E',
                        }}
                      >
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                
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
                      borderRadius: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 19px',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '21px',
                        color: '#7C7C89',
                      }}
                    >
                      {cryptoConfig[withdrawCrypto!].name}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        position: 'absolute',
                        right: '19px',
                        transform: 'rotate(90deg)',
                      }}
                    >
                      <path
                        d="M12 4V20M12 4L8 8M12 4L16 8"
                        stroke="#424964"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                
                <span
                  style={{
                    position: 'absolute',
                    width: '197px',
                    height: '21px',
                    left: '28px',
                    top: '129px',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cryptoConfig[withdrawCrypto!].name.split(' ')[0]} Withdrawal Address
                </span>

                
                <div
                  style={{
                    position: 'absolute',
                    width: '536px',
                    height: '36px',
                    left: '28px',
                    top: '156px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '535px',
                      height: '36px',
                      left: '0px',
                      top: '0px',
                      background: '#242937',
                      borderRadius: '15px',
                    }}
                  />
                  <img
                    src={cryptoConfig[withdrawCrypto!].icon}
                    alt={cryptoConfig[withdrawCrypto!].name}
                    style={{
                      position: 'absolute',
                      width: '22.75px',
                      height: '22.75px',
                      left: '8.18px',
                      top: '5.62px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: '158px',
                      height: '20px',
                      left: '40px',
                      top: '7px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#9DA4B7',
                    }}
                  >
                    Paste withdraw address
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      width: '89px',
                      height: '34px',
                      left: '446px',
                      top: '0px',
                      background: '#C77DFF',
                      borderRadius: '0px 15px 15px 0px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        d="M10.1111 13.5H3.88889C3.27005 13.5 2.67656 13.2629 2.23897 12.841C1.80139 12.419 1.55556 11.8467 1.55556 11.25V3.75C1.55556 3.55109 1.47361 3.36032 1.32775 3.21967C1.18189 3.07902 0.984057 3 0.777778 3C0.571498 3 0.373667 3.07902 0.227806 3.21967C0.0819442 3.36032 0 3.55109 0 3.75V11.25C0 12.2446 0.409721 13.1984 1.13903 13.9017C1.86834 14.6049 2.85749 15 3.88889 15H10.1111C10.3174 15 10.5152 14.921 10.6611 14.7803C10.8069 14.6397 10.8889 14.4489 10.8889 14.25C10.8889 14.0511 10.8069 13.8603 10.6611 13.7197C10.5152 13.579 10.3174 13.5 10.1111 13.5ZM14 5.205C13.9919 5.1361 13.9763 5.06822 13.9533 5.0025V4.935C13.9159 4.85788 13.8661 4.787 13.8056 4.725L9.13889 0.225C9.07459 0.166662 9.00108 0.118561 8.92111 0.0824999H8.85111L8.60222 0H5.44444C4.82561 0 4.23211 0.237053 3.79453 0.65901C3.35694 1.08097 3.11111 1.65326 3.11111 2.25V9.75C3.11111 10.3467 3.35694 10.919 3.79453 11.341C4.23211 11.7629 4.82561 12 5.44444 12H11.6667C12.2855 12 12.879 11.7629 13.3166 11.341C13.7542 10.919 14 10.3467 14 9.75V5.25C14 5.25 14 5.25 14 5.205ZM9.33333 2.5575L11.3478 4.5H10.1111C9.90483 4.5 9.707 4.42098 9.56114 4.28033C9.41528 4.13968 9.33333 3.94891 9.33333 3.75V2.5575ZM12.4444 9.75C12.4444 9.94891 12.3625 10.1397 12.2166 10.2803C12.0708 10.421 11.8729 10.5 11.6667 10.5H5.44444C5.23817 10.5 5.04033 10.421 4.89447 10.2803C4.74861 10.1397 4.66667 9.94891 4.66667 9.75V2.25C4.66667 2.05109 4.74861 1.86032 4.89447 1.71967C5.04033 1.57902 5.23817 1.5 5.44444 1.5H7.77778V3.75C7.77778 4.34674 8.02361 4.91903 8.4612 5.34099C8.89878 5.76295 9.49227 6 10.1111 6H12.4444V9.75Z"
                        fill="white"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: '#FFFFFF',
                      }}
                    >
                      Paste
                    </span>
                  </div>
                </div>

                
                <span
                  style={{
                    position: 'absolute',
                    width: '58px',
                    height: '21px',
                    left: '28px',
                    top: '201px',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#FFFFFF',
                  }}
                >
                  Amount
                </span>

                
                <div
                  style={{
                    position: 'absolute',
                    width: '536px',
                    height: '36px',
                    left: '25px',
                    top: '228px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '536px',
                      height: '36px',
                      left: '0px',
                      top: '0px',
                      background: '#242937',
                      borderRadius: '15px',
                    }}
                  />
                  <img
                    src="/assets/profile/wallet.svg"
                    alt="Wallet"
                    style={{
                      position: 'absolute',
                      width: '12px',
                      height: '12px',
                      left: '11.5px',
                      top: '11px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: '41px',
                      height: '20px',
                      left: '35.53px',
                      top: '7px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#9DA4B7',
                    }}
                  >
                    $56.13
                  </span>
                </div>

                
                <span
                  style={{
                    position: 'absolute',
                    width: '500px',
                    height: '17px',
                    left: '28px',
                    top: '275px',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '-0.02em',
                    color: '#697187',
                  }}
                >
                  *The value subtracted from your balance may vary between now and the time we process it.
                </span>

                
                <div
                  style={{
                    position: 'absolute',
                    width: '182px',
                    height: '40px',
                    left: '28px',
                    top: '303px',
                    background: '#C77DFF',
                    borderRadius: '15px',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: '140px',
                      height: '14px',
                      left: '33px',
                      top: '7px',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                    }}
                  >
                    Withdraw $ 32.13
                  </span>
                </div>

                
                <div
                  style={{
                    position: 'absolute',
                    width: '690px',
                    height: '154px',
                    left: '28px',
                    top: '361px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '534px',
                      height: '136px',
                      left: '0px',
                      top: '7px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '6px',
                    }}
                  >
                    <CryptoTransactionHistory cryptoType={withdrawCrypto || 'BTC'} />
                  </div>
                  
                  <div
                    style={{
                      position: 'absolute',
                      width: '5px',
                      height: '118px',
                      left: '540.95px',
                      top: '7px',
                      background: '#C77DFF',
                      borderRadius: '5px',
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}


        {isMM2DepositMode && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '240px',
                height: '32px',
                left: '27px',
                top: '22px',
                zIndex: 10,
              }}
            >
              <img
                src="/assets/svg/home/wallet.svg"
                alt="Deposit"
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  left: '0px',
                  top: '0px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '123px',
                  height: '33px',
                  left: '47px',
                  top: '0px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '22px',
                  lineHeight: '33px',
                  color: '#FFFFFF',
                }}
              >
                Deposit
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                width: '537px',
                height: '140px',
                left: '29px',
                top: '75px',
                background: '#1C212E',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'url(/assets/wallet/mm2.png)',
                    backgroundSize: 'cover',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#FFFFFF',
                      marginBottom: '5px',
                    }}
                  >
                    Bot: MM2_BUGGY
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#6B7289',
                    }}
                  >
                    Trade this bot to deposit your MM2 items
                  </span>
                </div>
              </div>

              <button
                onClick={() => window.open('https://www.roblox.com/share?code=08e9a905497e2541bad83194f3fc0888&type=Server', '_blank')}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '14px',
                  background: '#C77DFF',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Join Server & Trade Bot
              </button>
            </div>

            <div
              style={{
                position: 'absolute',
                width: '537px',
                height: 'auto',
                left: '29px',
                top: '235px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#6B7289',
                  marginBottom: '10px',
                }}
              >
                Instructions:
              </span>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#9CA3AF',
                }}
              >
                <li>Click "Join Server & Trade Bot" to join the VIP server</li>
                <li>Find and trade the bot "MM2_BUGGY" in the game</li>
                <li>Add your items to the trade and wait for the bot to accept</li>
                <li>Your items will be automatically credited to your account</li>
              </ul>
            </div>
          </>
        )}

        {isMM2Mode && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '240px',
                height: '32px',
                left: '27px',
                top: '22px',
              }}
            >
              <img
                src="/assets/market/market.svg"
                alt="Withdraw"
                style={{
                  position: 'absolute',
                  width: '30px',
                  height: '30px',
                  left: '0px',
                  top: '0px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '123px',
                  height: '33px',
                  left: '47px',
                  top: '0px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '22px',
                  lineHeight: '33px',
                  color: '#FFFFFF',
                }}
              >
                Withdraw
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                width: '722px',
                height: '48px',
                left: '27px',
                top: '75px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: '7px',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '618px',
                  height: '48px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '618px',
                    height: '48px',
                    left: '0px',
                    top: '0px',
                    border: '1.5px solid #404763',
                    borderRadius: '15px',
                  }}
                />
                <img
                  src="/assets/market/search.svg"
                  alt="Search"
                  style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    left: '30px',
                    top: '14px',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    width: '125px',
                    height: '23px',
                    left: '62px',
                    top: '12px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#737991',
                  }}
                >
                  Search for items
                </span>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                width: '212px',
                height: '53px',
                left: '657px',
                top: '71px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '190px',
                  height: '49px',
                  left: '0px',
                  top: '4px',
                  border: '1.5px solid #404763',
                  borderRadius: '15px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '84px',
                  height: '23px',
                  left: '44px',
                  top: '17px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#737991',
                }}
              >
                High to low
              </span>
              <img
                src="/assets/market/dropdown.svg"
                alt="Dropdown"
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '7px',
                  right: '40px',
                  top: '23px',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                width: '190px',
                height: '53px',
                left: '857px',
                top: '71px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '190px',
                  height: '50px',
                  left: '0px',
                  top: '3px',
                  border: '1.5px solid #404763',
                  borderRadius: '15px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '86px',
                  height: '23px',
                  left: '26px',
                  top: '16px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#737991',
                }}
              >
                Filter from..
              </span>
              <img
                src="/assets/market/dropdown.svg"
                alt="Dropdown"
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '7px',
                  right: '20px',
                  top: '23px',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                width: '535px',
                height: '200px',
                left: '26px',
                top: '140px',
                background: 'url(/assets/wallet/bot.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '15px',
              }}
            />

            <div
              onClick={() => window.open('https://www.roblox.com/share?code=08e9a905497e2541bad83194f3fc0888&type=Server', '_blank')}
              style={{
                position: 'absolute',
                width: '535px',
                height: '54px',
                left: '26px',
                top: '260px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '535px',
                  height: '54px',
                  left: '0px',
                  top: '0px',
                  background: '#C77DFF',
                  borderRadius: '15px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '136px',
                  height: '27px',
                  left: '197px',
                  top: '13.5px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '27px',
                  color: '#FFFFFF',
                }}
              >
                Join VIP Server
              </span>
            </div>

            <span
              style={{
                position: 'absolute',
                width: '500px',
                height: '42px',
                left: '28px',
                top: '329px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#FFFFFF',
              }}
            >
              To initiate Withdraw process, trade the bot MM2_BUGGY in the Lobby from the vip provided below within the timeframe.
            </span>
          </>
        )}

        
        {isCardsMode && <CardsDeposit onClose={() => setIsCardsMode(false)} />}

        {!selectedCrypto && !isWithdrawMode && !isMM2Mode && !isMM2DepositMode && !isCardsMode && (
          <>
            
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
              style={{
                width: '115px',
                height: '29px',
                background: '#2A3040',
                borderRadius: '9px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
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

            
            <div
              onClick={() => setIsWithdrawMode(true)}
              style={{
                width: '94px',
                height: '29px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  transform: 'rotate(180deg)',
                }}
              >
                <path
                  d="M12 4V20M12 4L8 8M12 4L16 8"
                  stroke="#676D7A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
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


        <div
          onClick={() => isWithdrawMode ? setIsMM2WithdrawOpen(true) : setIsMM2DepositMode(true)}
          style={{
            position: 'absolute',
            width: '537px',
            height: '85px',
            left: '29px',
            top: '102px',
            overflow: 'hidden',
            cursor: 'pointer',
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
            
            <div
              onClick={() => setSelectedCrypto('BTC')}
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
                cursor: 'pointer',
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

            
            <div
              onClick={() => setSelectedCrypto('ETH')}
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
                cursor: 'pointer',
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

            
            <div
              onClick={() => setSelectedCrypto('LTC')}
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
                cursor: 'pointer',
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

            
            <div
              onClick={() => setSelectedCrypto('USDT')}
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
                cursor: 'pointer',
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

            
            <div
              onClick={() => setSelectedCrypto('SOL')}
              style={{
                width: '172px',
                height: '85px',
                position: 'relative',
                cursor: 'pointer',
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
          
          <div
            onClick={() => setIsCardsMode(true)}
            style={{
              width: '172px',
              height: '85px',
              position: 'relative',
              cursor: 'pointer',
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
                width: '86px',
                height: '70px',
                left: '5px',
                top: '8px',
                background: 'url(/assets/wallet/cards.svg)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(255, 255, 255, 0.25))',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
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
                width: '86px',
                height: '86px',
                left: '5px',
                top: '0px',
                background: 'url(/assets/wallet/cashapp.svg)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(0, 214, 50, 0.25))',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
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
                width: '86px',
                height: '78px',
                left: '5px',
                top: '4px',
                background: 'url(/assets/wallet/giftcards.svg)',
                filter: 'drop-shadow(0px 0px 41.8px rgba(199, 125, 255, 0.25))',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
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
          </>
        )}
      </div>
    </div>

    <MM2WithdrawModal
      isOpen={isMM2WithdrawOpen}
      onClose={() => setIsMM2WithdrawOpen(false)}
    />
    </>
  );
}
