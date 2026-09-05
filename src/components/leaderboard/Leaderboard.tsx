'use client';

import { useState, useEffect, useRef } from 'react';

interface LeaderboardItem {
  rank: number;
  username: string;
  avatar?: string;
  profit: number;
  wager: number;
  gamesPlayed: number;
}

interface LeaderboardProps {
  items?: LeaderboardItem[];
  onClose?: () => void;
}

export default function Leaderboard({ items, onClose }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'profit' | 'wager' | 'least'>('profit');
  const [shouldRender, setShouldRender] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const styleRef = useRef<HTMLStyleElement>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/coinflip/leaderboard?type=${activeTab}`);
        const data = await response.json();
        setLeaderboardData(data.leaderboard || []);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Fallback to mock data if API fails
        setLeaderboardData(mockItems);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeTab]);

  useEffect(() => {
    // Trigger the open animation after component mounts
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsVisible(true);
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
    setIsVisible(false);
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
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={handleClose}
    >
      <div
        className={`leaderboard-panel ${isOpen ? 'leaderboard-animate-in' : 'leaderboard-animate-out'}`}
        style={{
          position: 'fixed',
          width: '595px',
          height: '755px',
          left: 'calc(50% - 595px/2)',
          top: 'calc(50% - 755px/2)',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
          zIndex: 10001,
        }}
        onClick={(e) => e.stopPropagation()}
      >
      
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
        
        <span
          onClick={handleClose}
          style={{
            position: 'absolute',
            left: '548px',
            top: '32px',
            cursor: 'pointer',
            fontSize: '28px',
            color: '#424964',
            fontWeight: 'bold',
            lineHeight: '1',
            userSelect: 'none',
            zIndex: 100,
          }}
        >
          ×
        </span>

        
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

            
            <div
              onClick={() => setActiveTab('profit')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
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
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
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

            
            <div
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
                textAlign: 'center',
              }}
            >
              Top Wager
            </div>

            
            <div
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
                textAlign: 'center',
              }}
            >
              Least Profit
            </div>
          </div>
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '539px',
            height: '604px',
            left: '29px',
            top: '131px',
          }}
        >
          
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
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8890A2' }}>
                Loading...
              </div>
            ) : (
              leaderboardData.map((item) => (
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
                  
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.4 18C3.19 18 2.15417 17.5594 1.2925 16.6781C0.430833 15.7969 0 14.7375 0 13.5V4.5C0 3.2625 0.430833 2.20313 1.2925 1.32188C2.15417 0.440625 3.19 0 4.4 0H17.6C18.81 0 19.8458 0.440625 20.7075 1.32188C21.5692 2.20313 22 3.2625 22 4.5V13.5C22 14.7375 21.5692 15.7969 20.7075 16.6781C19.8458 17.5594 18.81 18 17.6 18H4.4ZM4.4 4.5H17.6C18.0033 4.5 18.3883 4.54688 18.755 4.64062C19.1217 4.73438 19.47 4.88437 19.8 5.09062V4.5C19.8 3.88125 19.5848 3.35175 19.1543 2.9115C18.7238 2.47125 18.2057 2.25075 17.6 2.25H4.4C3.795 2.25 3.27727 2.4705 2.8468 2.9115C2.41633 3.3525 2.20073 3.882 2.2 4.5V5.09062C2.53 4.88437 2.87833 4.73438 3.245 4.64062C3.61167 4.54688 3.99667 4.5 4.4 4.5ZM2.365 8.15625L14.6025 11.1937C14.7675 11.2312 14.9325 11.2312 15.0975 11.1937C15.2625 11.1562 15.4183 11.0813 15.565 10.9688L19.3875 7.70625C19.1858 7.425 18.9292 7.1955 18.6175 7.01775C18.3058 6.84 17.9667 6.75075 17.6 6.75H4.4C3.92333 6.75 3.50643 6.87675 3.1493 7.13025C2.79217 7.38375 2.53073 7.72575 2.365 8.15625Z" fill="#A855F7"/>
                  </svg>
                  <span
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '16px',
                      color: '#C77DFF',
                    }}
                  >
                    {item.profit.toLocaleString()}
                  </span>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockItems: LeaderboardItem[] = [
  { rank: 1, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 2, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 3, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 4, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 5, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 6, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 7, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
  { rank: 8, username: 'Jake', avatar: '/assets/images/coinflip/item_1side.png', profit: 273451, wager: 500000, gamesPlayed: 50 },
];
