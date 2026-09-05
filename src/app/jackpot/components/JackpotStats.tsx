'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';

interface JackpotStatsProps {
  jackpotValue: number;
  userWager: number;
  userChance: number;
  timeRemaining: number | null;
}

const formatValue = (value: number) => value >= 1000
  ? `B$${(value / 1000).toFixed(1)}K`
  : `B$${Math.round(value)}`;

export default function JackpotStats({ jackpotValue, userWager, userChance, timeRemaining }: JackpotStatsProps) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'minmax(280px, 1.6fr) repeat(3, minmax(150px, 1fr))',
        alignItems: 'center',
        padding: '0px',
        gap: isMobile ? '10px' : '18px',
        width: '100%',
        marginTop: '20px',
      }}
    >
      
      <div
        style={{
          position: 'relative',
          width: '100%',
          minWidth: 0,
          height: '108px',
          gridColumn: isMobile ? '1 / -1' : 'auto',
          background: '#111625',
          borderRadius: '13px',
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '4px',
          isolation: 'isolate',
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            right: '-3px',
            height: '112px',
            top: '-2px',
            border: '1px solid rgba(168, 85, 247, 0.26)',
            borderRadius: '15px',
            zIndex: 0,
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            left: '0px',
            right: '-1px',
            top: '25%',
            bottom: '25%',
            background: '#6741FF',
            opacity: 0,
            filter: 'blur(28px)',
            zIndex: 1,
          }}
        />
        
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '99px',
            borderRadius: '9px',
            zIndex: 2,
          }}
        >
          
          <div
            style={{
              position: 'absolute',
              left: '1px',
              right: '1px',
              height: '97px',
              top: '1px',
              background: 'linear-gradient(270deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 100%), url(/assets/jackpot/background.png), #191D29',
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, center',
              backgroundBlendMode: 'normal, luminosity, normal',
              borderRadius: '8px',
              zIndex: 0,
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '137px',
              background: 'url(/assets/images/coinflip/item_1side.png)',
              backgroundSize: 'cover',
              opacity: 0.1,
              zIndex: 1,
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              width: '125px',
              height: '60px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '35px',
                textAlign: 'center',
                color: '#C77DFF',
              }}
            >
              {formatValue(jackpotValue)}
            </span>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '17px',
                lineHeight: '25px',
                color: '#8891AB',
              }}
            >
              Jackpot Value
            </span>
          </div>
        </div>
      </div>

      
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: '93px',
          background: '#191D29',
          border: '2px solid #1B1F2D',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px' : '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '21px',
            lineHeight: '31px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          {formatValue(userWager)}
        </span>
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            textAlign: 'center',
            color: '#8891AB',
          }}
        >
          Your Wager
        </span>
      </div>

      
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: '93px',
          background: '#191D29',
          border: '2px solid #1B1F2D',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px' : '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '21px',
            lineHeight: '31px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          {userChance.toFixed(2)}%
        </span>
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            textAlign: 'center',
            color: '#8891AB',
          }}
        >
          Your Chance
        </span>
      </div>

      
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: '93px',
          background: '#191D29',
          border: '2px solid #1B1F2D',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px' : '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '21px',
            lineHeight: '31px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          {timeRemaining === null
            ? 'Waiting..'
            : `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`}
        </span>
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            textAlign: 'center',
            color: '#8891AB',
          }}
        >
          Time Remaining
        </span>
      </div>
    </div>
  );
}
