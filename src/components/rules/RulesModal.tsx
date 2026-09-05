'use client';

import React, { useState, useEffect } from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    } else {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `}</style>
      <div
        className="responsive-modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out forwards' : 'fadeIn 0.2s ease-out forwards',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          className="responsive-modal-panel"
          style={{
            position: 'relative',
            width: 'min(696px, 100%)',
            height: 'min(473px, calc(100dvh - 32px))',
            filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
            animation: isAnimatingOut ? 'scaleOut 0.2s ease-out forwards' : 'scaleIn 0.2s ease-out forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: 'calc(100% - 8px)',
            height: '100%',
            left: '4px',
            top: '0px',
            background: '#191D29',
            border: '1px solid #222530',
            borderRadius: '15px',
          }}
        />

        <span
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '30px',
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

        <div
          style={{
            position: 'absolute',
            width: '195px',
            height: '26px',
            left: '30px',
            top: '27px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '27px',
            color: '#FFFFFF',
          }}
        >
          Rules
        </div>

        <div
          style={{
            position: 'absolute',
            width: 'calc(100% - 60px)',
            height: '39px',
            left: '30px',
            top: '55.79px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#686B7B',
          }}
        >
          Please read and follow our community rules to ensure a fair and enjoyable experience for everyone.
        </div>

        <div
          style={{
            position: 'absolute',
            width: 'calc(100% - 60px)',
            height: '350px',
            left: '30px',
            top: '113.79px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#333846 transparent',
          }}
        >
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '22px',
              color: '#A0A4B8',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>1. Be Respectful</span>
              <p style={{ marginTop: '8px' }}>Treat all members with respect. No harassment, hate speech, or discriminatory language.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>2. No Cheating</span>
              <p style={{ marginTop: '8px' }}>Any form of cheating, exploiting bugs, or using unauthorized software will result in a permanent ban.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>3. Fair Play</span>
              <p style={{ marginTop: '8px' }}>Play fair and don't attempt to manipulate games or other users. All games are provably fair.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>4. Account Safety</span>
              <p style={{ marginTop: '8px' }}>Keep your account secure. Never share your password or personal information with anyone.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>5. No Spam</span>
              <p style={{ marginTop: '8px' }}>Do not spam chat or send repetitive messages. This includes advertising other sites.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>6. Age Requirement</span>
              <p style={{ marginTop: '8px' }}>You must be at least 13 years old to use this platform. Users under 18 should have parental supervision.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>7. Multiple Accounts</span>
              <p style={{ marginTop: '8px' }}>Creating multiple accounts to abuse bonuses or promotions is strictly prohibited.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>8. Responsible Gambling</span>
              <p style={{ marginTop: '8px' }}>Gambling should be for entertainment only. Never bet more than you can afford to lose.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default RulesModal;
