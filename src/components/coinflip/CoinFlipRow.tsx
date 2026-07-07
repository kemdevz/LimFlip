'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface CoinFlipRowProps {
  topOffset: number;
  winner: 'heads' | 'tails';
  onViewClick?: () => void;
}

export default function CoinFlipRow({ topOffset, winner, onViewClick }: CoinFlipRowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isConnected } = useSocket();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Trigger animation when socket is connected
    if (isConnected) {
      setIsVisible(true);
    }
  }, [isConnected]);

  const winnerImage = winner === 'heads' ? '/assets/images/coinflip/HEADSs.png' : '/assets/images/coinflip/tails.png';
  const winnerCoin = winner === 'heads' ? '/assets/images/coinflip/heads.png' : '/assets/images/coinflip/tails.png';
  const loserCoin = winner === 'heads' ? '/assets/images/coinflip/tails.png' : '/assets/images/coinflip/heads.png';

  return (
    <div
      className={`coinflip-row ${isMobile ? 'coinflip-row__mobile-stack' : ''}`}
      style={{
        backgroundColor: '#191D29',
        top: isMobile ? undefined : `calc(20px + 5px + 70px + ${topOffset}px)`,
        marginTop: isMobile ? `${topOffset === 0 ? 12 : topOffset + 12}px` : undefined,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {/* Left side content */}
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '186px',
          height: isMobile ? 'auto' : '73px',
          left: isMobile ? '0' : '22px',
          top: isMobile ? '0' : '9px',
        }}
      >
        {/* Frame 2131328779 */}
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '183px',
            height: isMobile ? 'auto' : '71px',
            left: isMobile ? '0' : '2px',
            top: isMobile ? '0' : '2px',
            display: isMobile ? 'flex' : 'block',
            flexDirection: isMobile ? 'row' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '16px' : '0',
            padding: isMobile ? '12px' : '0',
          }}
        >
          {/* Frame 2131327614 - Left avatar */}
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: '67px',
              height: '71px',
              left: isMobile ? '0' : '0px',
              top: isMobile ? '0' : '0px',
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
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '68px',
                  height: '70px',
                  left: '-2px',
                  top: '-4px',
                  background: '#11151D',
                  borderRadius: '132px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '66px',
                  height: '66px',
                  left: '1px',
                  top: '0px',
                  background: 'url(/assets/images/coinflip/1SIDE.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '43px',
                }}
              />
            </div>
          </div>

          {/* Frame 2131328530 - VS text */}
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: '18px',
              height: '22px',
              left: isMobile ? '0' : '82px',
              top: isMobile ? '0' : '25px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '30px',
                height: '15px',
                left: '0px',
                top: '-3px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              v
            </span>
            <span
              style={{
                position: 'absolute',
                width: '30px',
                height: '15px',
                left: '8px',
                top: '4px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              s
            </span>
          </div>

          {/* Frame 2131327622 - Right avatar */}
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: '67px',
              height: '71px',
              left: isMobile ? '0' : '116px',
              top: isMobile ? '0' : '0px',
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
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '68px',
                  height: '70px',
                  left: '-2px',
                  top: '-4px',
                  background: '#11151D',
                  borderRadius: '132px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '66px',
                  height: '66px',
                  left: '1px',
                  top: '0px',
                  background: 'url(/assets/images/coinflip/1SIDE.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '43px',
                }}
              />
            </div>
          </div>

          {/* Coin icons */}
          <img
            src={winnerCoin}
            alt={winner === 'heads' ? 'Heads' : 'Tails'}
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              left: '164px',
              top: '3px',
              borderRadius: '50%',
              filter: 'drop-shadow(0px 0px 50px rgba(0, 0, 0, 0.25))',
            }}
          />
          <img
            src={loserCoin}
            alt={winner === 'heads' ? 'Tails' : 'Heads'}
            style={{
              position: 'absolute',
              width: '23px',
              height: '22px',
              left: '0px',
              top: '0px',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      {/* Stacked avatars */}
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '351px',
          height: isMobile ? 'auto' : '54px',
          left: isMobile ? '0' : '300px',
          top: isMobile ? '0' : '50%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          marginTop: isMobile ? '12px' : '0',
        }}
      >
        {/* Frame 2131327958 - Avatar container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '261px',
            height: isMobile ? 'auto' : '61px',
            left: isMobile ? '0' : '-9px',
            top: isMobile ? '0' : '-3px',
          }}
        >
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '29px',
                flex: 'none',
                order: i,
                flexGrow: 0,
                margin: '0px -11px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '54px',
                  height: '54px',
                  left: '0px',
                  top: '0px',
                  background: '#121620',
                  border: '1px solid #181E2E',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '41px',
                  height: '41px',
                  left: '6px',
                  top: '6px',
                  background: 'url(/assets/images/coinflip/knife.png)',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'blur(4px)',
                  transform: 'rotate(10deg)',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '41px',
                  height: '41px',
                  left: '6px',
                  top: '6px',
                  background: 'url(/assets/images/coinflip/knife.png)',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '50%',
                }}
              />
            </div>
          ))}
        </div>

        {/* +9 text */}
        <span
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            left: '250px',
            top: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '22px',
            color: '#FFFFFF',
          }}
        >
          +9
        </span>
      </div>

      {/* Price range */}
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          left: isMobile ? '0' : 'calc(100% - 250px)',
          top: isMobile ? '0' : '50%',
          transform: isMobile ? 'none' : 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '6px',
          marginTop: isMobile ? '12px' : '0',
        }}
      >
        {/* Wallet icon */}
        <img
          src="/assets/svg/home/wallet.svg"
          alt="Wallet"
          width={16}
          height={14}
          style={{
            width: '16px',
            height: '14px',
            marginTop: '2px',
          }}
        />
        
        {/* Price text */}
        <div
          style={{
            position: 'relative',
            width: '150px',
            height: '40px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '100%',
              height: '20px',
              top: '0px',
              left: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '700',
              fontSize: '18px',
              lineHeight: '20px',
              color: '#0276FF',
            }}
          >
            R$466k
          </span>
          <span
            style={{
              position: 'absolute',
              width: '100%',
              height: '20px',
              top: '20px',
              left: '-30px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#656F86',
            }}
          >
            R$466k - R$513K
          </span>
        </div>
      </div>

      {/* Winner image */}
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: '69px',
          height: '69px',
          left: isMobile ? '0' : '60%',
          top: isMobile ? '0' : '50%',
          transform: isMobile ? 'none' : 'translate(-50%, -50%)',
          background: `url(${winnerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: isMobile ? '12px' : '0',
        }}
      />

      {/* Frame 2131328664 */}
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: '74px',
          height: '76px',
          left: isMobile ? '0' : 'calc(100% - 100px)',
          top: isMobile ? '0' : '50%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          marginTop: isMobile ? '12px' : '0',
        }}
      >
        {/* Join Button */}
        <div
          style={{
            width: '74px',
            height: '33px',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0%',
              right: '9.46%',
              top: '0%',
              bottom: '0%',
              background: '#0276FF',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '31px',
              height: '16px',
              left: '18px',
              top: '7px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Join
          </span>
        </div>
        {/* View Button */}
        <div
          onClick={onViewClick}
          style={{
            width: '74px',
            height: '33px',
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0%',
              right: '9.46%',
              top: '0%',
              bottom: '0%',
              background: '#202634',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '31px',
              height: '16px',
              left: '18px',
              top: '7px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '21px',
              color: '#5A6582',
            }}
          >
            View
          </span>
        </div>
      </div>
    </div>
  );
}
