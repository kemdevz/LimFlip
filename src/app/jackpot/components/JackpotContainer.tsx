'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import PlayerCard from './PlayerCard';
import WaitingCard from './WaitingCard';

interface JackpotContainerProps {
  jackpot?: any;
}

export default function JackpotContainer({ jackpot }: JackpotContainerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (jackpot?.timerEndsAt && jackpot.status === 'waiting') {
      const updateTime = () => {
        const now = new Date().getTime();
        const endsAt = new Date(jackpot.timerEndsAt).getTime();
        const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
        setTimeRemaining(remaining);
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeRemaining(0);
    }
  }, [jackpot?.timerEndsAt, jackpot?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const entries = jackpot?.entries || [];
  const isWaiting = jackpot?.status === 'waiting';
  const showTimer = isWaiting && timeRemaining > 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        marginTop: '18px',
        marginBottom: '20px',
        border: '11px solid #181C28',
        borderRadius: '15px',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      
      <div
        style={{
          position: 'absolute',
          height: '249px',
          left: '0px',
          right: '0px',
          top: '0px',
          borderTop: '5px solid #21252F',
          borderLeft: '5px solid #21252F',
          borderRight: '5px solid #21252F',
          borderBottom: 'none',
          borderRadius: '12px 12px 0 0',
          zIndex: 1,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          height: '249px',
          left: '0px',
          right: '0px',
          top: '0px',
          background: '#191D29',
          boxShadow: 'inset 0px 4px 109.7px rgba(0, 0, 0, 0.25), inset 0px 4px 14.8px rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
          zIndex: 2,
        }}
      />
      
      <img
        src="/assets/jackpot/arrow.svg"
        alt="Arrow"
        style={{
          position: 'absolute',
          left: '50%',
          top: '-15px',
          transform: 'translateX(-50%)',
          width: '33px',
          height: '30px',
          zIndex: 30,
        }}
      />
      <img
        src="/assets/jackpot/arrow.svg"
        alt="Arrow"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-15px',
          transform: 'translateX(-50%) rotate(180deg)',
          width: '33px',
          height: '30px',
          zIndex: 30,
        }}
      />
      
      {showTimer && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-40px',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            zIndex: 30,
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#FFFFFF',
            }}
          >
            Waiting...
          </span>
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#006EFF',
            }}
          >
            Time Remaining: {formatTime(timeRemaining)}
          </span>
        </div>
      )}
      
      <div
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '16px',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
          }}
        >
          {entries.map((entry: any) => (
            <PlayerCard 
              key={entry.userId}
              username={entry.username}
              avatarUrl={entry.avatarUrl}
              totalValue={entry.totalValue}
            />
          ))}
          {entries.length === 0 && (
            <>
              <WaitingCard />
              <WaitingCard />
              <WaitingCard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
