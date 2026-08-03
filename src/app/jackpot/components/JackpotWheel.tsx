'use client';

import { useState } from 'react';
import JoinJackpotModal from './JoinJackpotModal';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';

export default function JackpotWheel() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '1057px',
        height: '403px',
      }}
    >
      
      <div
        onClick={() => setIsJoinModalOpen(true)}
        style={{
          position: 'absolute',
          width: '141px',
          height: '42px',
          left: '860px',
          top: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '0%',
            right: '0%',
            top: '0%',
            bottom: '0%',
            background: '#0276FF',
            borderRadius: '15px',
          }}
        />
        <div
          style={{
            position: 'relative',
            fontFamily: 'Proxima Nova, sans-serif',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '17px',
            lineHeight: '17px',
            color: '#FFFFFF',
          }}
        >
          BET ITEMS
        </div>
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '132px',
          height: '22px',
          left: '780px',
          top: '8px',
        }}
      >
        <img
          src="/assets/jackpot/dice.svg"
          alt="Dice"
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '27px',
            height: '22px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '26.52%',
            right: '0%',
            top: '4.55%',
            bottom: '27.27%',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '18px',
            lineHeight: '27px',
            color: '#FFFFFF',
          }}
        >
          36
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          width: '215px',
          height: '30px',
          left: '0px',
          top: '7px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '19px',
            height: '19px',
            animation: 'spin 1s linear infinite',
          }}
        >
          <path d="M9.5 2C5.26205 1.99984 1.99996 5.37499 2 9.50002C2.00005 13.325 5.03178 17 9.5 17C13.6568 17 17 13.625 17 9.50002" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round"/>
          <defs>
            <linearGradient id="paint0_linear" x1="9.5" y1="18.25" x2="17" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1983FF"/>
              <stop offset="1" stopColor="#1983FF" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '20px',
            lineHeight: '30px',
            background: 'linear-gradient(90deg, #0276FF 0%, #308FFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}
        >
          Round #54cd4439
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '15px',
          position: 'absolute',
          width: '1057px',
          height: '96px',
          left: '0px',
          top: '61px',
        }}
      >
        
        <div
          style={{
            width: '1057px',
            height: '96px',
            background: '#191D29',
            border: '2px solid #1B1F2D',
            borderRadius: '15px',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          
          <div
            style={{
              position: 'absolute',
              width: '69px',
              height: '73px',
              left: '17px',
              top: '9px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '68px',
                height: '71px',
                left: '2px',
                top: '2px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '67px',
                  height: '71px',
                  left: '0px',
                  top: '0px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '66px',
                    height: '66px',
                    left: '1px',
                    top: '5px',
                    borderRadius: '132px',
                    overflow: 'hidden',
                    background: '#131620',
                  }}
                >
                  <img
                    src="/assets/images/coinflip/item_1side.png"
                    alt="Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div
            style={{
              position: 'absolute',
              width: '85px',
              height: '49px',
              left: '944px',
              top: '24px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '90px',
                height: '27px',
                left: '13px',
                top: '0px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#656F86',
              }}
            >
              Chance
            </div>
            <div
              style={{
                position: 'absolute',
                width: '90px',
                height: '27px',
                left: '13px',
                top: '22px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '22px',
                background: 'linear-gradient(178.3deg, #DCE5FF -96.52%, #999999 104.91%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              84.48%
            </div>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '10px',
              position: 'absolute',
              width: '311.07px',
              height: '65px',
              left: '190px',
              top: '17px',
            }}
          >
            
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '34.9074px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                margin: '0px -12px',
                position: 'relative',
                background: '#11151D',
                border: '1.2037px solid #181E2E',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/images/coinflip/candy.png"
                alt="Item blur"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '-3px',
                  top: '-3px',
                  filter: 'blur(7.88426px)',
                  transform: 'rotate(44.66deg)',
                }}
              />
              <img
                src="/assets/images/coinflip/candy.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '7.22px',
                  top: '7.22px',
                }}
              />
            </div>
            
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '34.9074px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                margin: '0px -12px',
                position: 'relative',
                background: '#11151D',
                border: '1.2037px solid #181E2E',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/images/coinflip/chroma.png"
                alt="Item blur"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '-3px',
                  top: '-3px',
                  filter: 'blur(7.88426px)',
                  transform: 'rotate(44.66deg)',
                }}
              />
              <img
                src="/assets/images/coinflip/chroma.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '7.22px',
                  top: '7.22px',
                }}
              />
            </div>
            
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '34.9074px',
                flex: 'none',
                order: 2,
                flexGrow: 0,
                margin: '0px -12px',
                position: 'relative',
                background: '#11151D',
                border: '1.2037px solid #181E2E',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/images/coinflip/knife.png"
                alt="Item blur"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '-3px',
                  top: '-3px',
                  filter: 'blur(7.88426px)',
                  transform: 'rotate(44.66deg)',
                }}
              />
              <img
                src="/assets/images/coinflip/knife.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '7.22px',
                  top: '7.22px',
                }}
              />
            </div>
            
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '34.9074px',
                flex: 'none',
                order: 3,
                flexGrow: 0,
                margin: '0px -12px',
                position: 'relative',
                background: '#11151D',
                border: '1.2037px solid #181E2E',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/images/coinflip/luger.png"
                alt="Item blur"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '-3px',
                  top: '-3px',
                  filter: 'blur(7.88426px)',
                  transform: 'rotate(44.66deg)',
                }}
              />
              <img
                src="/assets/images/coinflip/luger.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '7.22px',
                  top: '7.22px',
                }}
              />
            </div>
            
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '34.9074px',
                flex: 'none',
                order: 4,
                flexGrow: 0,
                margin: '0px -12px',
                position: 'relative',
                background: '#11151D',
                border: '1.2037px solid #181E2E',
                overflow: 'hidden',
              }}
            >
              <img
                src="/assets/jackpot/gingerscope.png"
                alt="Item blur"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '-3px',
                  top: '-3px',
                  filter: 'blur(7.88426px)',
                  transform: 'rotate(44.66deg)',
                }}
              />
              <img
                src="/assets/jackpot/gingerscope.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '49.35px',
                  height: '49.35px',
                  left: '7.22px',
                  top: '7.22px',
                }}
              />
            </div>
            
            <div
              style={{
                width: '24.07px',
                height: '24.07px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '18.0556px',
                lineHeight: '27px',
                color: '#FFFFFF',
                flex: 'none',
                order: 5,
                flexGrow: 0,
              }}
            >
              +9
            </div>
          </div>

          
          <div
            style={{
              position: 'absolute',
              width: '137px',
              height: '50px',
              left: '70px',
              top: '27px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '109.03px',
                height: '26px',
                left: '0px',
                top: '0px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '17px',
                lineHeight: '26px',
                textAlign: 'center',
                color: '#FFFFFF',
              }}
            >
              jakep
            </div>
            <div
              style={{
                position: 'absolute',
                width: '109px',
                height: '25px',
                left: '28px',
                top: '25px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '14px',
                lineHeight: '21px',
                color: '#656F86',
              }}
            >
              Joined
            </div>
          </div>

          
          <div
            style={{
              position: 'absolute',
              width: '108px',
              height: '27px',
              left: '669px',
              top: '35px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <img
              src="/assets/profile/wallet.svg"
              alt="Wallet"
              style={{
                width: '20px',
                height: '20px',
              }}
            />
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '30px',
                color: '#0276FF',
              }}
            >
              B$466k
            </div>
          </div>
        </div>
      </div>

      
      <div
        onClick={() => setIsValidateFairnessOpen(true)}
        style={{
          position: 'absolute',
          width: '40px',
          height: '39px',
          left: '1017px',
          top: '0px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '42px',
            height: '42px',
            left: '0px',
            top: '0px',
            background: '#202634',
            borderRadius: '15px',
          }}
        />
        <svg
          width="17"
          height="18"
          viewBox="0 0 17 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <path d="M16.0422 2.332C11.2959 3 10.3547 1.833 8.22018 0C6.08568 1.833 5.14444 3 0.398119 2.332C-2.1314 14.58 8.22018 18 8.22018 18C8.22018 18 18.5718 14.58 16.0422 2.332ZM10.7641 12.309L8.22018 11.009L5.67729 12.309L6.16283 9.556L4.10547 7.606L6.94874 7.205L8.22018 4.7L9.49163 7.205L12.3349 7.606L10.2775 9.555L10.7641 12.309Z" fill="#656F86"/>
        </svg>
      </div>

      
      <div
        style={{
          position: 'absolute',
          right: '-440px',
          top: '61px',
          width: '421px',
          height: '180px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '421px',
            height: '180px',
            left: '0px',
            top: '0px',
            background: '#191D29',
            border: '2px solid #1B1F2D',
            borderRadius: '15px',
          }}
        >
          
          <div
            style={{
              position: 'absolute',
              width: '421px',
              height: '98px',
              left: '0px',
              top: '0px',
              backgroundImage: 'url(/assets/jackpot/grid.png), linear-gradient(180deg, rgba(32, 36, 49, 0.72) 0%, rgba(39, 43, 56, 0.72) 100%)',
              backgroundSize: 'cover',
              borderRadius: '15px 15px 0px 0px',
            }}
          >
            
            <div
              style={{
                position: 'absolute',
                width: '169px',
                height: '24px',
                left: '19px',
                top: '23px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                background: 'linear-gradient(178.3deg, #DCE5FF -96.52%, #999999 104.91%), #0276FF',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Round #54cd4439
            </div>

            
            <div
              style={{
                position: 'absolute',
                left: '57px',
                top: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img
                src="/assets/profile/wallet.svg"
                alt="Wallet"
                style={{
                  width: '20px',
                  height: '20px',
                }}
              />
              <div
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  fontSize: '20px',
                  lineHeight: '30px',
                  color: '#0276FF',
                }}
              >
                B$466k
              </div>
            </div>

            
            <div
              onClick={() => setIsValidateFairnessOpen(true)}
              style={{
                position: 'absolute',
                width: '40px',
                height: '39px',
                left: '359px',
                top: '29px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '42px',
                  height: '42px',
                  left: '0px',
                  top: '0px',
                  background: '#292E3C',
                  borderRadius: '15px',
                }}
              />
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <path d="M16.0422 2.332C11.2959 3 10.3547 1.833 8.22018 0C6.08568 1.833 5.14444 3 0.398119 2.332C-2.1314 14.58 8.22018 18 8.22018 18C8.22018 18 18.5718 14.58 16.0422 2.332ZM10.7641 12.309L8.22018 11.009L5.67729 12.309L6.16283 9.556L4.10547 7.606L6.94874 7.205L8.22018 4.7L9.49163 7.205L12.3349 7.606L10.2775 9.555L10.7641 12.309Z" fill="#656F86"/>
              </svg>
            </div>
          </div>

          
          <div
            style={{
              position: 'absolute',
              width: '52.93px',
              height: '56px',
              left: '21px',
              top: '106px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '52.16px',
                height: '54.47px',
                left: '1.53px',
                top: '1.53px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '51.4px',
                  height: '54.47px',
                  left: '0px',
                  top: '0px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '50.63px',
                    height: '50.63px',
                    left: '0.77px',
                    top: '3.84px',
                    borderRadius: '101.26px',
                    background: '#131620',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/assets/images/coinflip/item_1side.png"
                    alt="Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div
            style={{
              position: 'absolute',
              width: '213px',
              height: '24px',
              left: '87px',
              top: '124px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            jakep won with a 40.79%
          </div>
        </div>
      </div>
      
      <JoinJackpotModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
      />
    </div>
  );
}
