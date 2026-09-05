'use client';

import React, { useState, useEffect } from 'react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
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
            width: '696px',
            height: '473px',
            filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
            animation: isAnimatingOut ? 'scaleOut 0.2s ease-out forwards' : 'scaleIn 0.2s ease-out forwards',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '688px',
            height: '473px',
            left: '8px',
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
            left: '648px',
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
          FAQ
        </div>

        <div
          style={{
            position: 'absolute',
            width: '630px',
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
          Frequently asked questions about MM2Stake
        </div>

        <div
          style={{
            position: 'absolute',
            width: '630px',
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
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>What is MM2Stake?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>MM2Stake is a provably fair gambling platform where you can play coinflip games and win Robux items.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>How do I deposit?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>You can deposit through our supported payment methods including crypto, gift cards, and Roblox items. Go to the wallet section to see all options.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Is it safe to play?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>Yes, all games are provably fair using cryptographic algorithms. You can verify the fairness of each game through our Verify Fairness feature.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>How old do I need to be?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>You must be at least 13 years old to use MM2Stake. Users under 18 should have parental supervision.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>How do I withdraw?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>Withdrawals are available through Roblox items or crypto. Go to the wallet section and click on withdraw to see available options.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>What is provably fair?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>Provably fair means you can verify that each game's outcome was random and not manipulated. We use cryptographic hashes to ensure transparency.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>How do I contact support?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>Join our Discord server at <span style={{ color: '#C77DFF' }}>https://discord.gg/MM2Stake</span> or use our on-site support system for assistance.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Can I have multiple accounts?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>No, creating multiple accounts to abuse bonuses or promotions is strictly prohibited and may result in a permanent ban.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>What happens if I disconnect during a game?</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>If you disconnect, the game will continue and the outcome will be determined fairly. Your winnings will be credited to your account automatically.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default FaqModal;
