import WaitingCard from './WaitingCard';
import { JackpotEntry } from '@/types';

export default function JackpotContainer({ entries }: { entries: JackpotEntry[] }) {
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
            animation: 'scrollRight 30s linear infinite',
          }}
        >
          {Array.from({ length: 28 }, (_, index) => (
            <WaitingCard
              key={entries[index]?._id || `waiting-${index}`}
              entry={entries[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
