'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 150);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

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
          animation: isVisible ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          className="responsive-modal-panel"
          style={{
            position: 'relative',
            width: isMobile ? '100%' : '696px',
            height: isMobile ? '100%' : '473px',
            maxWidth: isMobile ? '100%' : '696px',
            maxHeight: isMobile ? '100%' : '473px',
            filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
            animation: isVisible ? 'scaleIn 0.2s ease-out' : 'scaleOut 0.2s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: isMobile ? '100%' : '688px',
            height: isMobile ? '100%' : '473px',
            left: isMobile ? '0' : '8px',
            top: isMobile ? '0' : '0px',
            background: '#191D29',
            border: isMobile ? 'none' : '1px solid #222530',
            borderRadius: isMobile ? '0' : '15px',
          }}
        />

        <span
          onClick={onClose}
          style={{
            position: 'absolute',
            left: isMobile ? 'calc(100% - 40px)' : '648px',
            top: isMobile ? '20px' : '32px',
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
            width: isMobile ? 'calc(100% - 60px)' : '195px',
            height: '26px',
            left: isMobile ? '20px' : '30px',
            top: isMobile ? '20px' : '27px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '27px',
            color: '#FFFFFF',
          }}
        >
          Privacy Policy
        </div>

        <div
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 60px)' : '630px',
            height: '39px',
            left: isMobile ? '20px' : '30px',
            top: isMobile ? '55px' : '55.79px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#686B7B',
          }}
        >
          Last Updated: 9/04/2024
        </div>

        <div
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 60px)' : '630px',
            height: isMobile ? 'calc(100% - 120px)' : '350px',
            left: isMobile ? '20px' : '30px',
            top: isMobile ? '110px' : '113.79px',
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
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Welcome to MM2Stake!</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>This Privacy Policy governs your privacy of the MM2Stake website and its related services. By accessing or using our Service, you agree to comply with these Policies.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Information We Collect</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>We may collect the following types of personal information:</p>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', marginBottom: '0' }}>
                <li>Account Information: Information you provide when you create an account</li>
                <li>Usage Data: Information about how you interact with our services</li>
                <li>Transaction Information: Payment information for purchases</li>
                <li>Sensitive Personal Data: Health or biometric data if voluntarily provided</li>
                <li>Third-Party Data: Information from social media platforms</li>
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>How We Use Your Information</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>We may use your personal information for: providing and improving services, personalizing your experience, communication, processing transactions, marketing, analytics, and legal compliance.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Data Usage for Marketing</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>We may use your information to tailor advertisements and marketing communications. You have the right to opt out at any time.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Your Rights</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>You have the right to access, correct, delete, and opt out of marketing communications regarding your personal information.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Data Security</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>We implement reasonable security measures to protect your personal information from unauthorized access.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Children's Privacy</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>MM2Stake is for mature audiences. We do not knowingly collect personal information from individuals under 18.</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#C77DFF', fontWeight: 600 }}>Contact</span>
              <p style={{ marginTop: '8px', marginBottom: '0' }}>For any inquiries, please contact us at <span style={{ color: '#C77DFF' }}>https://discord.gg/MM2Stake</span> or through our on-site support system.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
