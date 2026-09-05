'use client';

import React, { useState, useEffect } from 'react';

interface ValidateFairnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  showOverlay?: boolean;
}

const ValidateFairnessModal: React.FC<ValidateFairnessModalProps> = ({ isOpen, onClose, showOverlay = true }) => {
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
          backgroundColor: showOverlay ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
          zIndex: 1000,
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out forwards' : 'fadeIn 0.2s ease-out forwards',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={showOverlay ? onClose : undefined}
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
          Validate Fairness
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
          Game outcomes are predetermined before bets. Hashed results are shared before each game, ensuring fairness.
        </div>

        <div
          style={{
            position: 'absolute',
            width: '629px',
            height: '63px',
            left: '31px',
            top: '113.79px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '21px',
              left: '0px',
              top: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Random Seed
          </div>
          <div
            style={{
              position: 'absolute',
              width: '643px',
              height: '36px',
              left: '0px',
              top: '29px',
              background: '#262937',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '20px',
              left: '10px',
              top: '39px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#5E6482',
            }}
          >
            ...
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '630px',
            height: '61px',
            left: '30px',
            top: '191.79px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '124px',
              height: '21px',
              left: '1px',
              top: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Server Seed Hash
          </div>
          <div
            style={{
              position: 'absolute',
              width: '644px',
              height: '36px',
              left: '0px',
              top: '26px',
              background: '#262937',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '20px',
              left: '10px',
              top: '39px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#5E6482',
            }}
          >
            ...
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '630px',
            height: '64px',
            left: '30px',
            top: '268.79px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '85px',
              height: '21px',
              left: '0px',
              top: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Starter Sum
          </div>
          <div
            style={{
              position: 'absolute',
              width: '316px',
              height: '36px',
              left: '0px',
              top: '29px',
              background: '#262937',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '20px',
              left: '10px',
              top: '39px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#5E6482',
            }}
          >
            ...
          </span>

          <div
            style={{
              position: 'absolute',
              width: '81px',
              height: '21px',
              left: '328px',
              top: '0px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Joiner Sum
          </div>
          <div
            style={{
              position: 'absolute',
              width: '316px',
              height: '36px',
              left: '328px',
              top: '29px',
              background: '#262937',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '11px',
              height: '20px',
              left: '339px',
              top: '39px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#5E6482',
            }}
          >
            ...
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            width: '644px',
            height: '53px',
            left: '30px',
            top: '357px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '644px',
              height: '53px',
              left: '0px',
              top: '-0.21px',
              background: '#C77DFF',
              borderRadius: '15px',
              cursor: 'pointer',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '143px',
              height: '24px',
              left: '250px',
              top: '15px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Validate Fairness
          </span>
        </div>

        <span
          style={{
            position: 'absolute',
            width: '74px',
            height: '20px',
            left: '31px',
            top: '430px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#53576B',
            cursor: 'pointer',
          }}
        >
          Show Code
        </span>
      </div>
      </div>
    </>
  );
};

export default ValidateFairnessModal;
