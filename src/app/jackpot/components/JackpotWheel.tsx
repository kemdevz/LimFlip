'use client';

import { useState } from 'react';
import JoinJackpotModal from './JoinJackpotModal';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import { Jackpot } from '@/types';

interface Card {
  image: string;
  playerId: string;
}

interface JackpotWheelProps {
  jackpot: Jackpot | null;
  onJackpotJoined: (jackpot: Jackpot) => void;
}

export default function JackpotWheel({ jackpot, onJackpotJoined }: JackpotWheelProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const latestEntry = jackpot?.entries[jackpot.entries.length - 1];
  
  // Default waiting cards
  const waitingCards = [
    '/assets/images/coinflip/candy.png',
    '/assets/images/coinflip/chroma.png',
    '/assets/images/coinflip/knife.png',
    '/assets/images/coinflip/luger.png',
    '/assets/jackpot/gingerscope.png',
  ];

  const cards: Card[] = latestEntry
    ? latestEntry.items.map((item) => ({ image: item.image, playerId: String(latestEntry._id || latestEntry.username) }))
    : waitingCards.map((image) => ({ image, playerId: 'waiting' }));
  const itemCount = jackpot?.entries.reduce((sum, entry) => sum + entry.items.length, 0) || 0;
  const latestChance = latestEntry && jackpot?.totalValue
    ? (latestEntry.totalValue / jackpot.totalValue) * 100
    : 0;

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
          left: '0px',
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
            background: '#C77DFF',
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
          width: '72px',
          height: '22px',
          left: '930px',
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
            left: '35px',
            width: '37px',
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
          {itemCount}
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
          background: '#191D29',
          border: '2px solid #1B1F2D',
          borderRadius: '15px',
        }}
      >
        
        <div
          style={{
            visibility: latestEntry ? 'visible' : 'hidden',
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
                    src={latestEntry?.avatarUrl || '/assets/images/coinflip/item_1side.png'}
                    alt={latestEntry?.username || 'Waiting'}
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
              width: '109px',
              height: '50px',
              left: '82px',
              top: '27px',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#FFFFFF',
              }}
            >
              {latestEntry?.username}
            </div>
            <div
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
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
                background: 'linear-gradient(178.3deg, #E5D5FF -96.52%, #999999 104.91%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {latestChance.toFixed(2)}%
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
            {cards.slice(0, 5).map((card, index) => (
              <div
                key={`${card.playerId}-${index}`}
                style={{
                  width: '65px',
                  height: '65px',
                  borderRadius: '34.9074px',
                  flex: 'none',
                  order: index,
                  flexGrow: 0,
                  margin: '0px -12px',
                  position: 'relative',
                  background: '#11151D',
                  border: '1.2037px solid #181E2E',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={card.image}
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
                  src={card.image}
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
            ))}
            
            {cards.length > 5 && (
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
                +{cards.length - 5}
              </div>
            )}
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
                color: '#C77DFF',
              }}
            >
              B${Math.round(latestEntry?.totalValue || 0).toLocaleString()}
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
                background: 'linear-gradient(178.3deg, #E5D5FF -96.52%, #999999 104.91%), #C77DFF',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {jackpot ? `Round #${jackpot._id.slice(-8)}` : 'Waiting for round'}
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
                  color: '#C77DFF',
                }}
              >
                B${Math.round(jackpot?.totalValue || 0).toLocaleString()}
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

          
        </div>
      </div>
      
      <JoinJackpotModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJackpotJoined={onJackpotJoined}
      />
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
      />
    </div>
  );
}
