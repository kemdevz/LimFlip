'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/context/SocketContext';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface CoinflipToolbarProps {
  onBetItemsClick?: () => void;
}

const formatAmount = (amount: number) => {
  if (amount >= 1000000) {
    return `R$${(amount / 1000000).toFixed(2)}m`;
  } else if (amount >= 1000) {
    return `R$${(amount / 1000).toFixed(2)}k`;
  } else {
    return `R$${amount.toFixed(2)}`;
  }
};

export default function CoinflipToolbar({ onBetItemsClick }: CoinflipToolbarProps) {
  const [playerCount, setPlayerCount] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
  const [yourBets, setYourBets] = useState(0);
  const { user } = useAuth();
  const { onlineCount } = useSocket();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api-bash.onrender.com/coinflip/active');
        const data = await response.json();
        const games = data.games || [];

        // Calculate total bets
        const total = games.reduce((sum: number, game: any) => sum + (game.totalValue || 0), 0);
        setTotalBets(total);

        // Calculate your bets
        if (user?.id) {
          const yourTotal = games
            .filter((game: any) => game.creator === user.id || game.joiner === user.id)
            .reduce((sum: number, game: any) => sum + (game.totalValue || 0), 0);
          setYourBets(yourTotal);
        }

        // Set player count from socket
        setPlayerCount(onlineCount);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [user?.id, onlineCount]);

  return (
    <div className="coinflip-toolbar">
      {isMobile ? (
        // Mobile layout
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onBetItemsClick}
              style={{
                height: '36px',
                background: '#0276FF',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '14px',
                color: '#FFFFFF',
                padding: '0 16px',
                flex: 1,
                minWidth: '100px',
              }}
            >
              Bet Items
            </button>
            <button
              type="button"
              style={{
                height: '36px',
                background: '#1C212E',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '14px',
                color: '#FFFFFF',
                padding: '0 16px',
                flex: 1,
                minWidth: '100px',
              }}
            >
              History
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '3px', height: '29px', background: '#2A3040', borderRadius: '2px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src="/assets/svg/home/dice.svg" alt="Players" style={{ width: '20px', height: '16px' }} />
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>{playerCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img src="/assets/svg/home/wallet.svg" alt="Total Bets" style={{ width: '16px', height: '14px' }} />
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>{formatAmount(totalBets)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              height: '42px',
              boxSizing: 'border-box',
              border: '1px solid #2A3040',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 15px',
              cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 22 17" fill="currentColor" style={{ marginRight: '10px' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M4.10407 17L4.83368 16.2492L7.93105 13.062C8.11921 12.8617 8.2234 12.5934 8.22118 12.3148C8.21896 12.0363 8.1105 11.7697 7.91916 11.5727C7.72782 11.3756 7.46892 11.2637 7.19821 11.2612C6.92751 11.2586 6.66666 11.3656 6.47184 11.559L5.13653 12.9331V1.06241C5.13653 0.780643 5.02776 0.510414 4.83413 0.311174C4.64051 0.111933 4.3779 0 4.10407 0C3.83025 0 3.56764 0.111933 3.37402 0.311174C3.18039 0.510414 3.07162 0.780643 3.07162 1.06241V12.9345L1.73631 11.5605C1.54059 11.3728 1.28172 11.2706 1.01424 11.2755C0.746767 11.2803 0.491564 11.3918 0.3024 11.5865C0.113236 11.7811 0.00488017 12.0437 0.000160853 12.319C-0.00455846 12.5942 0.094727 12.8606 0.2771 13.062L3.37447 16.2492L4.10407 17ZM10.9871 10.2714C10.9871 9.68494 11.4497 9.20898 12.0196 9.20898H14.0845C14.3583 9.20898 14.6209 9.32092 14.8146 9.52016C15.0082 9.7194 15.117 9.98963 15.117 10.2714C15.117 10.5532 15.0082 10.8234 14.8146 11.0226C14.6209 11.2219 14.3583 11.3338 14.0845 11.3338H12.0196C11.7458 11.3338 11.4831 11.2219 11.2895 11.0226C11.0959 10.8234 10.9871 10.5532 10.9871 10.2714ZM12.0196 4.6052C11.7458 4.6052 11.4831 4.71713 11.2895 4.91637C11.0959 5.11561 10.9871 5.38584 10.9871 5.66761C10.9871 5.94938 11.0959 6.21961 11.2895 6.41885C11.4831 6.61809 11.7458 6.73002 12.0196 6.73002H18.2143C18.4881 6.73002 18.7508 6.61809 18.9444 6.41885C19.138 6.21961 19.2468 5.94938 19.2468 5.66761C19.2468 5.38584 19.138 5.11561 18.9444 4.91637C18.7508 4.71713 18.4881 4.6052 18.2143 4.6052H12.0196ZM12.0196 0.00141716C11.7458 0.00141716 11.4831 0.11335 11.2895 0.312592C11.0959 0.511833 10.9871 0.782061 10.9871 1.06383C10.9871 1.3456 11.0959 1.61583 11.2895 1.81507C11.4831 2.01431 11.7458 2.12624 12.0196 2.12624H20.9675C21.2414 2.12624 21.504 2.01431 21.6976 1.81507C21.8912 1.61583 22 1.3456 22 1.06383C22 0.782061 21.8912 0.511833 21.6976 0.312592C21.504 0.11335 21.2414 0.00141716 20.9675 0.00141716H12.0196Z" />
            </svg>
            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Price sort high to low
            </span>
            <img src="/assets/svg/home/arrow.svg" alt="Sort" style={{ width: '17px', height: '9px', marginLeft: '8px' }} />
          </div>
        </div>
      ) : (
        // Desktop layout (existing)
        <>
          <div
            style={{
              width: '246px',
              height: '44px',
              background: '#191D29',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 15px',
            }}
          >
            <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '18px', color: '#006EFF', marginRight: '10px' }}>$</span>
            <input
              type="text"
              placeholder="Enter bet amount ..."
              style={{
                flex: 1,
                minWidth: 0,
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '16px',
                color: '#525D7D',
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            style={{
              minWidth: '121px',
              height: '42px',
              background: '#0276FF',
              borderRadius: '15px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Proxima Nova, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              color: '#FFFFFF',
              padding: '0 16px',
            }}
          >
            PLACE BET
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <img src="/assets/images/coinflip/heads.png" alt="Heads" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
            <img src="/assets/images/coinflip/tails.png" alt="Tails" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
          </div>

          
          <img
            src="/assets/svg/ui/divider.svg"
            alt="Divider"
            style={{
              width: '3px',
              height: '29px',
              margin: '0 10px',
            }}
          />

          <button
            type="button"
            onClick={onBetItemsClick}
            style={{
              minWidth: '121px',
              height: '42px',
              background: '#0276FF',
              borderRadius: '15px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Proxima Nova, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              color: '#FFFFFF',
              padding: '0 16px',
            }}
          >
            BET ITEMS
          </button>

          <div className="coinflip-toolbar__stats" style={{ marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img src="/assets/svg/home/dice.svg" alt="Players" style={{ width: '27px', height: '22px' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#FFFFFF' }}>{playerCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img src="/assets/svg/home/wallet.svg" alt="Total Bets" style={{ width: '20px', height: '16px' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#0276FF' }}>{formatAmount(totalBets)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img src="/assets/svg/home/wallet.svg" alt="Your Bets" style={{ width: '20px', height: '16px' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#0276FF' }}>{formatAmount(yourBets)}</span>
            </div>
          </div>

          <div className="coinflip-toolbar__sort">
            <div
              style={{
                width: '253px',
                maxWidth: '100%',
                height: '42px',
                boxSizing: 'border-box',
                border: '1px solid #333845',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                cursor: 'pointer',
              }}
            >
              <img src="/assets/svg/home/down.svg" alt="Sort" style={{ width: '19px', height: '14px', marginRight: '10px' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Price sort high to low
              </span>
              <img src="/assets/svg/home/arrow.svg" alt="Sort" style={{ width: '17px', height: '9px', marginLeft: '8px' }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
