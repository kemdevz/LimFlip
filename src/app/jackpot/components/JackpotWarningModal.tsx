'use client';

interface JackpotWarningModalProps {
  onContinue: () => void;
}

export default function JackpotWarningModal({ onContinue }: JackpotWarningModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '400px',
          background: '#191D29',
          borderRadius: '17px',
          padding: '30px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                color: '#FFC107',
              }}
            >
              !
            </span>
          </div>
        </div>

        
        <h2
          style={{
            fontFamily: 'Poppins',
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '12px',
            margin: '0 0 12px 0',
          }}
        >
          Jackpot Incomplete
        </h2>

        
        <p
          style={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            fontWeight: '400',
            color: '#9DA4B7',
            textAlign: 'center',
            marginBottom: '24px',
            margin: '0 0 24px 0',
            lineHeight: '1.5',
          }}
        >
          Jackpot is incomplete due to few models missing. Continue?
        </p>

        
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            height: '44px',
            background: '#0276FF',
            borderRadius: '11px',
            border: 'none',
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0056CC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0276FF';
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
