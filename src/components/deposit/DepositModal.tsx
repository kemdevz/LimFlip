'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { toast } from '@/components/Toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [depositAddress, setDepositAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      fetchCurrencies();
    } else {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://api-bash-0ouj.onrender.com/deposit/currencies');
      const data = await response.json();
      setCurrencies(data.currencies || []);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const generateAddress = async () => {
    if (!user?.id) {
      toast.error('Please log in to generate a deposit address');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://api-bash-0ouj.onrender.com/deposit/generate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currency: selectedCurrency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate address');
      }

      setDepositAddress(data.address);
      toast.success('Deposit address generated successfully!');
    } catch (error) {
      console.error('Error generating address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate address');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAddress = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress);
      toast.success('Address copied to clipboard!');
    }
  };

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
            maxHeight: isMobile ? '100vh' : '600px',
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
              minHeight: isMobile ? '100vh' : '400px',
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
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Deposit Crypto
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#656F86',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                marginBottom: '20px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginBottom: '10px',
                }}
              >
                Select Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#1F232F',
                  border: '1px solid #222530',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateAddress}
              disabled={isGenerating}
              style={{
                width: '100%',
                padding: '14px',
                background: '#006EFF',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Deposit Address'}
            </button>

            {depositAddress && (
              <div
                style={{
                  marginTop: '30px',
                  padding: '20px',
                  background: '#1F232F',
                  border: '1px solid #222530',
                  borderRadius: '8px',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '10px',
                  }}
                >
                  Your Deposit Address
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <button
                    onClick={copyAddress}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#131620',
                      border: '1px solid #222530',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {depositAddress}
                  </button>
                </div>
                <p
                  style={{
                    marginTop: '15px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    color: '#656F86',
                    margin: 0,
                  }}
                >
                  Send only {selectedCurrency.toUpperCase()} to this address. Sending any other currency may result in permanent loss.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositModal;
