'use client';

import { useState, useEffect, useRef } from 'react';

interface LeaderboardItem {
  rank: number;
  username: string;
  avatar?: string;
  profit: number;
}

interface LeaderboardProps {
  items?: LeaderboardItem[];
  onClose?: () => void;
}

export default function Leaderboard({ items = mockItems, onClose }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'profit' | 'wager' | 'least'>('profit');
  const [shouldRender, setShouldRender] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    // Trigger the open animation after component mounts
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOutScale {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
        .leaderboard-animate-in {
          animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .leaderboard-animate-out {
          animation: fadeOutScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode === document.head) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose?.();
    }, 300);
  };

  if (!shouldRender) return null;

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFB054';
    if (rank === 2) return '#7D8194';
    if (rank === 3) return '#D37200';
    return '#A0A4B8';
  };

  const getRowBackground = (rank: number) => {
    if (rank === 1 || rank === 3 || rank === 5 || rank === 7) return '#252836';
    return 'transparent';
  };

  const getBorderRadius = (rank: number) => {
    if (rank === 1 || rank === 3 || rank === 5 || rank === 7) return '15px';
    return '12px';
  };

  return (
    <div
      className={`leaderboard-panel ${isOpen ? 'leaderboard-animate-in' : 'leaderboard-animate-out'}`}
      style={{
        position: 'fixed',
        width: '595px',
        height: '755px',
        left: 'calc(50% - 595px/2)',
        top: 'calc(50% - 755px/2)',
        filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
        zIndex: 1000,
      }}
    >
      {/* Main container */}
      <div
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          width: '591px',
          height: '755px',
          left: '0px',
          top: '0px',
          background: '#191B25',
          border: '1px solid #222530',
          borderRadius: '15px',
        }}
      >
        {/* Close button */}
        <div
          onClick={handleClose}
          style={{
            position: 'absolute',
            width: '36px',
            height: '36px',
            left: '539px',
            top: '24px',
            background: '#2F3646',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '23px',
              height: '25px',
              background: '#8890A2',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>

        {/* Title */}
        <span
          style={{
            position: 'absolute',
            width: '199px',
            height: '30px',
            left: '27px',
            top: '32px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '30px',
            color: '#FFFFFF',
          }}
        >
          Leaderboard
        </span>

        {/* Decorative line */}
        <div
          style={{
            position: 'absolute',
            left: '92.1%',
            right: '4.87%',
            top: '4.24%',
            bottom: '93.38%',
            background: '#424964',
          }}
        />

        {/* Tab switcher */}
        <div
          style={{
            position: 'absolute',
            width: '539px',
            height: '35px',
            left: '27px',
            top: '79px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '542px',
              height: '49px',
              left: '0px',
              top: '0px',
            }}
          >
            {/* Tab background */}
            <div
              style={{
                position: 'absolute',
                width: '542px',
                height: '39px',
                left: '0px',
                top: '0px',
                background: '#1C212E',
                borderRadius: '10px',
              }}
            />

            {/* Top Profit tab */}
            <div
              onClick={() => setActiveTab('profit')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px',
                gap: '3px',
                position: 'absolute',
                width: '175px',
                height: '28px',
                left: '5px',
                top: '6px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '175px',
                  height: '28px',
                  background: activeTab === 'profit' ? '#2A3040' : 'transparent',
                  borderRadius: '9px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '62px',
                  height: '20px',
                  left: '61px',
                  top: '10px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                Top Profit
              </span>
            </div>

            {/* Top Wager tab */}
            <span
              onClick={() => setActiveTab('wager')}
              style={{
                position: 'absolute',
                width: '72px',
                height: '20px',
                left: '235px',
                top: '10px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Top Wager
            </span>

            {/* Least Profit tab */}
            <span
              onClick={() => setActiveTab('least')}
              style={{
                position: 'absolute',
                width: '72px',
                height: '20px',
                left: '419px',
                top: '10px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Least Profit
            </span>
          </div>
        </div>

        {/* List container */}
        <div
          style={{
            position: 'absolute',
            width: '539px',
            height: '604px',
            left: '29px',
            top: '131px',
          }}
        >
          {/* Header labels */}
          <span
            style={{
              position: 'absolute',
              width: '18px',
              height: '24px',
              left: '18px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#8890A2',
            }}
          >
            #
          </span>
          <span
            style={{
              position: 'absolute',
              width: '44px',
              height: '24px',
              left: '370px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#8890A2',
            }}
          >
            Profit
          </span>

          {/* List items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '11px',
              position: 'absolute',
              width: '539px',
              height: '565px',
              left: '0px',
              top: '39px',
            }}
          >
            {items.map((item) => (
              <div
                key={item.rank}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '12px 16px',
                  width: '539px',
                  height: '61px',
                  background: getRowBackground(item.rank),
                  borderRadius: getBorderRadius(item.rank),
                  flex: 'none',
                  order: item.rank - 1,
                  flexGrow: 0,
                }}
              >
                {/* Rank */}
                <span
                  style={{
                    width: '59px',
                    height: '16px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '16px',
                    color: getRankColor(item.rank),
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                >
                  #{item.rank}
                </span>

                {/* Username section */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '10px',
                    width: '291px',
                    height: '30px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '25px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      overflow: 'hidden',
                      background: '#A4AFCD',
                    }}
                  >
                    <img
                      src={item.avatar || '/assets/svg/auth/user.svg'}
                      alt={item.username}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Username */}
                  <span
                    style={{
                      width: '117px',
                      height: '16px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '16px',
                      color: '#BABFD5',
                      flex: 'none',
                      order: 1,
                      flexGrow: 1,
                    }}
                  >
                    {item.username}
                  </span>
                </div>

                {/* Profit section */}
                <div
                  style={{
                    width: '144px',
                    height: '18px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {/* R$ icon */}
                  <img
                    src="/assets/svg/ui/whale.svg"
                    alt="R$"
                    style={{
                      width: '22px',
                      height: '18px',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '16px',
                      color: '#0276FF',
                    }}
                  >
                    {item.profit.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockItems: LeaderboardItem[] = [
  { rank: 1, username: 'Anonymous', profit: 273451 },
  { rank: 2, username: 'Anonymous', profit: 273451 },
  { rank: 3, username: 'Anonymous', profit: 273451 },
  { rank: 4, username: 'Anonymous', profit: 273451 },
  { rank: 5, username: 'Anonymous', profit: 273451 },
  { rank: 6, username: 'Anonymous', profit: 273451 },
  { rank: 7, username: 'Anonymous', profit: 273451 },
  { rank: 8, username: 'Anonymous', profit: 273451 },
];
