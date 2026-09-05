'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { toast } from '@/components/Toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawalId?: string;
  itemCount?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, withdrawalId, itemCount }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

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
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          className="responsive-modal-panel"
          style={{
            position: 'relative',
            width: isMobile ? '100%' : '500px',
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100vh' : '400px',
            filter: 'drop-shadow(0px 4px 20.4px rgba(0, 0, 0, 0.25))',
            animation: isAnimatingOut ? 'scaleOut 0.2s ease-out' : 'scaleIn 0.2s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              boxSizing: 'border-box',
              position: 'absolute',
              width: isMobile ? '100%' : '480px',
              height: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '100vh' : '300px',
              left: isMobile ? '0' : '10px',
              top: isMobile ? '0' : '10px',
              background: '#191B25',
              border: isMobile ? 'none' : '1px solid #222530',
              borderRadius: isMobile ? '0' : '12px',
              padding: isMobile ? '20px' : '30px',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: isMobile ? '20px' : '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" stroke="#A855F7" strokeWidth="3" />
                <path
                  d="M32 20V32M32 44V44.01"
                  stroke="#A855F7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: '0 0 15px 0',
              }}
            >
              Withdrawal Request Created
            </h2>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobile ? '14px' : '16px',
                color: '#656F86',
                margin: '0 0 25px 0',
                lineHeight: '1.5',
              }}
            >
              Your withdrawal request for {itemCount || 0} item(s) has been created and is now pending.
            </p>

            <div
              style={{
                padding: '20px',
                background: '#1F232F',
                border: '1px solid #222530',
                borderRadius: '8px',
                marginBottom: '25px',
                width: '100%',
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 600,
                  color: '#A855F7',
                  margin: '0',
                }}
              >
                Join the MM2 server to complete your withdrawal
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#656F86',
                  margin: '10px 0 0 0',
                }}
              >
                Trade with the bot to receive your items
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px',
                background: '#A855F7',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawModal;
