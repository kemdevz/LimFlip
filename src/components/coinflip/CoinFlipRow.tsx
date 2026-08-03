'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';

interface CoinFlipRowProps {
  game: any;
  topOffset: number;
  winner?: 'heads' | 'tails';
  onJoinClick?: (gameId: string) => void;
  onViewClick?: () => void;
  isNew?: boolean;
}

export default function CoinFlipRow({ game, topOffset, winner, onJoinClick, onViewClick, isNew }: CoinFlipRowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const { isConnected } = useSocket();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isNew) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [isNew]);

  // Countdown timer for active games
  useEffect(() => {
    if (game?.status === 'active') {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [game?.status]);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `B$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `B$${amount.toFixed(0)}`;
    }
  };

  // Use game's result if completed, otherwise use selected coin
  const displayCoin = game?.result || game?.selectedCoin || 'heads';
  const showQuestionMark = !game?.joiner; // Show ? when no joiner
  const winnerImage = displayCoin === 'heads' ? '/assets/images/coinflip/heads_large.png' : '/assets/images/coinflip/tails.png';
  const winnerCoin = displayCoin === 'heads' ? '/assets/images/coinflip/heads.png' : '/assets/images/coinflip/tails.png';
  const loserCoin = displayCoin === 'heads' ? '/assets/images/coinflip/tails.png' : '/assets/images/coinflip/heads.png';

  const handleJoin = () => {
    if (onJoinClick && game?._id) {
      onJoinClick(game._id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
      
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '186px',
          height: isMobile ? 'auto' : '73px',
          left: isMobile ? '0' : '22px',
          top: isMobile ? '0' : '9px',
        }}
      >
        
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
                  background: '#131620',
                  borderRadius: '132px',
                  border: game?.status === 'completed' && game?.winner === game?.creator ? '3px solid #006EFF' : 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '66px',
                  height: '66px',
                  left: '1px',
                  top: '0px',
                  background: game?.creator?.avatarUrl ? `url(${game.creator.avatarUrl})` : 'url(/assets/images/coinflip/item_1side.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '43px',
                }}
              />
              {/* Selected coin indicator */}
              {game?.selectedCoin && (
                <img
                  src={game.selectedCoin === 'heads' ? '/assets/images/coinflip/heads.png' : '/assets/images/coinflip/tails.png'}
                  alt={game.selectedCoin}
                  width={24}
                  height={24}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    borderRadius: '50%',
                    border: '2px solid #191D29',
                  }}
                />
              )}
            </div>
          </div>

          
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
                  border: game?.status === 'completed' && game?.winner === game?.joiner ? '3px solid #006EFF' : 'none',
                }}
              />
              {game?.joiner ? (
                <div
                  style={{
                    position: 'absolute',
                    width: '66px',
                    height: '66px',
                    left: '1px',
                    top: '0px',
                    background: game?.joiner?.avatarUrl ? `url(${game.joiner.avatarUrl})` : 'url(/assets/images/coinflip/item_1side.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '43px',
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    width: '66px',
                    height: '66px',
                    left: '1px',
                    top: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="66"
                    height="66"
                    viewBox="0 0 120 120"
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '0px',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#13151E"
                      strokeWidth="4"
                    />
                  </svg>
                  <span
                    style={{
                      position: 'absolute',
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '30px',
                      color: '#FFFFFF',
                    }}
                  >
                    ?
                  </span>
                </div>
              )}
            </div>
          </div>

          
          {showQuestionMark ? (
            <div
              style={{
                position: isMobile ? 'absolute' : 'absolute',
                width: '22px',
                height: '22px',
                left: isMobile ? 'calc(67px + 8px)' : '164px',
                top: isMobile ? 'calc(50% - 11px)' : '3px',
                borderRadius: '50%',
                background: '#656F86',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0px 0px 50px rgba(0, 0, 0, 0.25))',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#FFFFFF',
                }}
              >
                ?
              </span>
            </div>
          ) : (
            <>
              <img
                src={winnerCoin}
                alt={displayCoin === 'heads' ? 'Heads' : 'Tails'}
                style={{
                  position: isMobile ? 'absolute' : 'absolute',
                  width: '22px',
                  height: '22px',
                  left: isMobile ? 'calc(67px + 8px)' : '164px',
                  top: isMobile ? 'calc(50% - 11px)' : '3px',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0px 0px 50px rgba(0, 0, 0, 0.25))',
                }}
              />
              <img
                src={loserCoin}
                alt={displayCoin === 'heads' ? 'Tails' : 'Heads'}
                style={{
                  position: isMobile ? 'absolute' : 'absolute',
                  width: '23px',
                  height: '22px',
                  left: isMobile ? 'calc(67px - 23px)' : '0px',
                  top: isMobile ? 'calc(50% - 11px)' : '0px',
                  borderRadius: '50%',
                }}
              />
            </>
          )}
        </div>
      </div>

      
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '311.07px',
          height: isMobile ? 'auto' : '65px',
          left: isMobile ? '0' : '240px',
          top: isMobile ? '0' : '17px',
          marginTop: isMobile ? '12px' : '0',
        }}
      >
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              width: '277px',
              height: '65px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            {game?.items?.slice(0, 5).map((item: any, i: number) => (
              <div
                key={i}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  const row = target.closest('.coinflip-row');
                  if (row) {
                    const rowRect = row.getBoundingClientRect();
                    const itemRect = target.getBoundingClientRect();
                    setHoveredItem(item);
                    setHoverPosition({ 
                      x: itemRect.left - rowRect.left + itemRect.width / 2, 
                      y: itemRect.top - rowRect.top 
                    });
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  width: '65px',
                  height: '65px',
                  borderRadius: '34.9074px',
                  flex: 'none',
                  order: i,
                  flexGrow: 0,
                  margin: i < 4 ? '0px -8px' : '0px',
                  position: 'relative',
                  overflow: 'visible',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    width: '65px',
                    height: '65px',
                    left: '0px',
                    top: '0px',
                    background: '#11151D',
                    border: '1.2037px solid #11151D',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    boxSizing: 'border-box',
                    position: 'absolute',
                    width: '65px',
                    height: '65px',
                    left: '0px',
                    top: '0px',
                    background: '#11151D',
                    border: '1.2037px solid #11151D',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: '49.35px',
                    height: '49.35px',
                    left: '-3px',
                    top: '-3px',
                    background: `url(${item.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(7.88426px)',
                    transform: 'rotate(44.66deg)',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: '49.35px',
                    height: '49.35px',
                    left: '7.22px',
                    top: '7.22px',
                    background: `url(${item.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50%',
                  }}
                />
              </div>
            ))}
          </div>
          {game?.items?.length > 5 && (
            <span
              style={{
                width: '24.07px',
                height: '24.07px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '18.0556px',
                lineHeight: '27px',
                color: '#FFFFFF',
                flex: 'none',
                order: 1,
                flexGrow: 0,
              }}
            >
              +{game.items.length - 5}
            </span>
          )}
        </div>
      </div>

      
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
            {formatAmount(game?.totalValue || 0)}
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
            {formatAmount((game?.totalValue || 0) * 0.9)} - {formatAmount((game?.totalValue || 0) * 1.1)}
          </span>
        </div>
      </div>

      
      {game?.status === 'active' ? (
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: '69px',
            height: '69px',
            left: isMobile ? '0' : '60%',
            top: isMobile ? '0' : '50%',
            transform: isMobile ? 'none' : 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isMobile ? '12px' : '0',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: '48px',
              color: '#FFFFFF',
            }}
          >
            {countdown}
          </span>
        </div>
      ) : game?.status === 'completed' ? (
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
      ) : showQuestionMark ? (
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: '69px',
            height: '69px',
            left: isMobile ? '0' : '60%',
            top: isMobile ? '0' : '50%',
            transform: isMobile ? 'none' : 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isMobile ? '12px' : '0',
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '100%',
              height: '100%',
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="#13151E"
              strokeWidth="4"
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '30px',
              color: '#FFFFFF',
            }}
          >
            ?
          </span>
        </div>
      ) : (
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
      )}

      
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
        
        <div
          onClick={handleJoin}
          style={{
            width: '74px',
            height: '33px',
            position: 'relative',
            cursor: user ? 'pointer' : 'not-allowed',
            opacity: user ? 1 : 0.5,
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

      {hoveredItem && (
        <div
          style={{
            position: 'absolute',
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y - 50}px`,
            background: '#191D29',
            border: '1px solid #353749',
            borderRadius: '8px',
            padding: '8px 12px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
            transform: 'translateX(-50%)',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '13.6px',
              color: '#EEF2F8',
              whiteSpace: 'nowrap',
            }}
          >
            {hoveredItem.name}
          </span>
        </div>
      )}
    </div>
    </>
  );
}
