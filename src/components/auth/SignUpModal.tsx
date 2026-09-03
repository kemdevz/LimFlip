'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface SignUpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SignUpModal({ isOpen = false, onClose }: SignUpModalProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter username, 2 = confirm account, 3 = update description
  const [robloxUserId, setRobloxUserId] = useState<number | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 150);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 1) {
        // Step 1: Check if username exists
        const endpoint = 'http://localhost:3001/auth/check-username';
        const body = { username };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Username check failed');
        }

        if (data.exists) {
          const userId = data.userId || data.robloxUserId;
          setRobloxUserId(userId);
          setVerificationCode(data.verificationCode || '');
          
          console.log('Step 1 - User found:', { userId, verificationCode: data.verificationCode });
          
          // Fetch avatar URL from Roblox API
          try {
            const searchResponse = await fetch(`http://localhost:3001/roblox/search?q=${encodeURIComponent(username)}`);
            const searchData = await searchResponse.json();
            console.log('Search results:', searchData);
            if (searchData && searchData.length > 0) {
              setAvatarUrl(searchData[0].avatar || '');
              // Fallback: use ID from search results if userId is not available
              if (!userId && searchData[0].id) {
                setRobloxUserId(searchData[0].id);
                console.log('Using ID from search results:', searchData[0].id);
              }
            }
          } catch (searchError) {
            console.error('Error fetching avatar:', searchError);
          }
          
          setStep(2);
        } else {
          setError(data.message || 'Username not found');
        }
      } else if (step === 2) {
        // Step 2: Confirm and move to step 3
        setStep(3);
      } else {
        // Step 3: Verify description and login/signup
        const endpoint = 'http://localhost:3001/auth/verify-description';
        const body = { username, robloxUserId: robloxUserId?.toString() };

        console.log('Sending to verify-description:', { username, robloxUserId });

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed. Please make sure you updated your description.');
        }

        // Store only token
        localStorage.setItem('token', data.token);
        
        console.log('Stored token:', data.token);

        // Close modal
        onClose?.();
        
        // Reload page to update auth state
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <form onSubmit={handleSubmit}>
      <div
        className="responsive-modal-panel responsive-modal-panel--center signup-modal-panel"
        style={{
          position: isMobile ? 'relative' : 'fixed',
          width: isMobile ? '100%' : '939px',
          height: isMobile ? '100vh' : '521px',
          left: isMobile ? '0' : '50%',
          top: isMobile ? '0' : '50%',
          transform: isMobile 
            ? (isVisible ? 'translateY(0)' : 'translateY(100%)')
            : (isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)'),
          transition: isMobile ? 'transform 0.3s ease-out' : 'transform 0.15s ease-in-out',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx>{`
          .signup-modal-panel::-webkit-scrollbar {
            display: none;
          }
          .signup-modal-panel {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div
          className="signup-modal-image"
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '362px',
            height: isMobile ? '200px' : '531px',
            left: isMobile ? '0' : 'calc(50% - 362px/2 - 288.5px)',
            top: isMobile ? '0' : 'calc(50% - 531px/2 + 5px)',
            borderRadius: isMobile ? '28px 28px 0 0' : '28px 0px 0px 28px',
            overflow: 'hidden',
            display: isMobile ? 'none' : 'block',
          }}
        >
          <img
            src="/assets/images/auth/loginbgg.png"
            alt="Login"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        
        <div
          className="signup-modal-form"
          style={{
            boxSizing: 'border-box',
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '577px',
            height: isMobile ? 'auto' : '531px',
            left: isMobile ? '0' : 'calc(50% - 577px/2 + 181px)',
            top: isMobile ? '0' : 'calc(50% - 531px/2 + 5px)',
            background: '#191B25',
            border: '1px solid #222530',
            borderRadius: isMobile ? '28px' : '0px 28px 28px 0px',
            padding: isMobile ? '20px' : '0',
          }}
        >
          
          {step === 1 && (
            <>
              
              <div
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '518px',
                  height: isMobile ? 'auto' : '329px',
                  left: isMobile ? '0' : '30px',
                  top: isMobile ? '0' : '-12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '20px' : '0',
                }}
              >
                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    padding: '0px',
                    gap: '11px',
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '473px',
                    height: isMobile ? 'auto' : '28px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '46px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: isMobile ? 'center' : 'space-between',
                      alignItems: 'center',
                      padding: '0px',
                      gap: isMobile ? '0' : '423px',
                      width: isMobile ? '100%' : '473px',
                      height: isMobile ? 'auto' : '28px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <span
                      style={{
                        margin: isMobile ? '0 auto' : '0',
                        width: isMobile ? 'auto' : '473px',
                        height: isMobile ? 'auto' : '28px',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: isMobile ? '18px' : '20px',
                        lineHeight: '28px',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        flexGrow: 1,
                      }}
                    >
                      Welcome
                    </span>
                  </div>
                </div>

                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    padding: '0px',
                    gap: '17px',
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '517px',
                    height: isMobile ? 'auto' : '53px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '87px',
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? '100%' : '517px',
                      height: isMobile ? 'auto' : '18px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: isMobile ? '13px' : '14px',
                      lineHeight: '18px',
                      color: '#6B7289',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      textAlign: isMobile ? 'center' : 'left',
                    }}
                  >
                    Welcome to MM2Stake, the leading roblox social arcade for Crypto and R$
                  </span>
                  <span
                    style={{
                      width: isMobile ? '100%' : '517px',
                      height: isMobile ? 'auto' : '18px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: isMobile ? '13px' : '14px',
                      lineHeight: '18px',
                      color: '#6B7289',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      textAlign: isMobile ? 'center' : 'left',
                    }}
                  >
                    Enter your roblox username to get started.
                  </span>
                </div>

                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '11px',
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '518px',
                    height: isMobile ? 'auto' : '311px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '156px',
                  }}
                >
              
              <div
                style={{
                  width: isMobile ? '100%' : '518px',
                  height: isMobile ? 'auto' : '84px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '116px',
                    height: '18px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '0px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#6B7289',
                  }}
                >
                  Username
                </span>
                <div
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '518px',
                    height: '54px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '10px' : '30px',
                    background: '#262937',
                    borderRadius: '15px',
                  }}
                >
                  <img
                    src="/assets/svg/auth/user.svg"
                    alt="User"
                    style={{
                      position: 'absolute',
                      width: '14px',
                      height: '14px',
                      left: '18px',
                      top: '20px',
                    }}
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter roblox username"
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 63px)' : '518px',
                      height: '54px',
                      left: isMobile ? '0' : '0px',
                      top: '0px',
                      background: 'transparent',
                      borderRadius: '15px',
                      border: 'none',
                      padding: '0 18px 0 45px',
                      color: '#6B7289',
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              
              <div
                style={{
                  width: isMobile ? '100%' : '518px',
                  height: isMobile ? 'auto' : '68px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '518px',
                    height: '54px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '100px',
                    background: loading ? '#1a4d8c' : '#0276FF',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '27px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </div>

              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '20px',
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '518px',
                  height: '17px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '338px',
                }}
              >
                <div
                  style={{
                    width: isMobile ? 'calc(50% - 20px)' : '232.5px',
                    height: '0px',
                    mixBlendMode: 'overlay',
                    border: '1px solid #FFFFFF',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                />
                <span
                  style={{
                    width: '13px',
                    height: '17px',
                    fontFamily: 'Proxima Nova, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#6B7289',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  or
                </span>
                <div
                  style={{
                    width: isMobile ? 'calc(50% - 20px)' : '232.5px',
                    height: '0px',
                    mixBlendMode: 'overlay',
                    border: '1px solid #FFFFFF',
                    flex: 'none',
                    order: 2,
                    flexGrow: 1,
                  }}
                />
              </div>

              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '13px',
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '518px',
                  height: '54px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '368px',
                }}
              >
                
                <div
                  onClick={() => window.open('https://accounts.google.com', '_blank')}
                  style={{
                    width: isMobile ? 'calc(50% - 6.5px)' : '252.5px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  <img src="/assets/svg/ui/google.svg" alt="Google" style={{ width: '92px', height: '26px' }} />
                </div>

                
                <div
                  onClick={() => window.open('https://discord.com', '_blank')}
                  style={{
                    width: isMobile ? 'calc(50% - 6.5px)' : '252.5px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                  }}
                >
                  <img src="/assets/svg/ui/discord.svg" alt="Discord" style={{ width: '95px', height: '26px' }} />
                </div>
              </div>

              
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '518px',
                  height: '20px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '432px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#6B7289',
                  textAlign: 'center',
                }}
              >
                Sign in or register with Email
              </span>

              
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '529px',
                  height: isMobile ? 'auto' : '36px',
                  left: isMobile ? '0' : '0px',
                  top: isMobile ? '0' : '468px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: isMobile ? '12px' : '14px',
                  lineHeight: '18px',
                  color: '#525F7C',
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                By registering in your recognize that you are in agreement to our <span style={{ color: '#0276FF' }}>Terms of Service</span> as-well as being over the age of <span style={{ color: '#0276FF' }}>18+</span>.
              </span>
          </div>
        </>
      )}

      
      {step === 2 && (
        <>
          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '518px',
              height: isMobile ? 'auto' : '114px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '-12px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '20px' : '0',
            }}
          >
            
            <div
              style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'center' : 'flex-start',
                        padding: '0px',
                        gap: '11px',
                        position: isMobile ? 'relative' : 'absolute',
                        width: isMobile ? '100%' : '473px',
                        height: isMobile ? 'auto' : '28px',
                        left: isMobile ? '0' : '0px',
                        top: isMobile ? '0' : '46px',
                      }}
                    >
                      
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: isMobile ? 'center' : 'space-between',
                          alignItems: 'center',
                          padding: '0px',
                          gap: isMobile ? '0' : '423px',
                          width: isMobile ? '100%' : '473px',
                          height: isMobile ? 'auto' : '28px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        
                        <span
                          style={{
                            margin: isMobile ? '0 auto' : '0',
                            width: isMobile ? 'auto' : '473px',
                            height: isMobile ? 'auto' : '28px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: isMobile ? '18px' : '20px',
                            lineHeight: '28px',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1,
                          }}
                        >
                          Is this your account?
                        </span>
                      </div>

                      
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMobile ? 'center' : 'flex-start',
                          padding: '0px',
                          gap: '17px',
                          position: isMobile ? 'relative' : 'absolute',
                          width: isMobile ? '100%' : '517px',
                          height: isMobile ? 'auto' : '53px',
                          left: isMobile ? '0' : '0px',
                          top: isMobile ? '0' : '87px',
                        }}
                      >
                        <span
                          style={{
                            width: isMobile ? '100%' : '517px',
                            height: isMobile ? 'auto' : '18px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: isMobile ? '13px' : '14px',
                            lineHeight: '18px',
                            color: '#6B7289',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                            textAlign: isMobile ? 'center' : 'left',
                          }}
                        >
                          Please add this code to your Roblox profile description:
                        </span>
                        <span
                          style={{
                            width: isMobile ? '100%' : '517px',
                            height: isMobile ? 'auto' : '18px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: isMobile ? '14px' : '16px',
                            lineHeight: '18px',
                            color: '#006EFF',
                            flex: 'none',
                            order: 1,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                            textAlign: isMobile ? 'center' : 'left',
                            wordBreak: 'break-all',
                          }}
                        >
                          {verificationCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      position: isMobile ? 'relative' : 'absolute',
                      width: isMobile ? '100%' : '113px',
                      height: isMobile ? 'auto' : '177px',
                      left: isMobile ? '0' : '232px',
                      top: isMobile ? '0' : '166px',
                    }}
                  >
                    
                    <img
                      src={avatarUrl || `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxUserId}&width=150&height=150&format=png`}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="113" height="113" viewBox="0 0 113 113"%3E%3Crect width="113" height="113" fill="%2311151D" rx="56.5"/%3E%3C/svg%3E';
                      }}
                      style={{
                        width: '113px',
                        height: '113px',
                        borderRadius: '999px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        objectFit: 'cover',
                      }}
                    />
                    
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0px',
                        width: '113px',
                        height: '56px',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '113px',
                          height: '32px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '17px',
                          lineHeight: '28px',
                          textAlign: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 1,
                          margin: '-8px 0px',
                        }}
                      >
                        {username}
                      </span>
                      <span
                        style={{
                          width: '113px',
                          height: '32px',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '28px',
                          textAlign: 'center',
                          color: '#6B7289',
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 1,
                        }}
                      >
                        ID: {robloxUserId}
                      </span>
                    </div>
                  </div>

                  
                  <span
                    style={{
                      position: isMobile ? 'relative' : 'absolute',
                      width: isMobile ? '100%' : '529px',
                      height: isMobile ? 'auto' : '36px',
                      left: isMobile ? '0' : '30px',
                      top: isMobile ? '0' : '468px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: isMobile ? '12px' : '14px',
                      lineHeight: '18px',
                      color: '#525F7C',
                      textAlign: isMobile ? 'center' : 'left',
                    }}
                  >
                    By continuing, you agree to our Terms of Service
                  </span>

                  
                  {!isMobile && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '90.64%',
                        right: '6.24%',
                        top: '6.66%',
                        bottom: '89.83%',
                        background: '#FFFFFF',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  )}

                  
                  <div
                    style={{
                      position: isMobile ? 'relative' : 'absolute',
                      width: isMobile ? '100%' : '252.5px',
                      height: isMobile ? 'auto' : '54px',
                      left: isMobile ? '0' : '30px',
                      top: isMobile ? '0' : '388px',
                      background: '#262937',
                      borderRadius: '15px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      style={{
                        width: '100%',
                        height: '54px',
                        background: 'transparent',
                        borderRadius: '15px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#BEC2D1',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '11px',
                      }}
                    >
                      Back
                    </button>
                  </div>

                  
                  <div
                    style={{
                      position: isMobile ? 'relative' : 'absolute',
                      width: isMobile ? '100%' : '252.5px',
                      height: isMobile ? 'auto' : '54px',
                      left: isMobile ? '0' : '294px',
                      top: isMobile ? '0' : '388px',
                      background: '#0276FF',
                      borderRadius: '15px',
                      marginTop: isMobile ? '10px' : '0',
                    }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '252.5px',
                        height: '54px',
                        background: 'transparent',
                        borderRadius: '15px',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#FFFFFF',
                      }}
                    >
                      {loading ? 'Loading...' : 'Yes, Continue'}
                    </button>
                  </div>
                </>
              )}

      
      {step === 3 && (
        <>
          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '518px',
              height: isMobile ? 'auto' : '114px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '-12px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '20px' : '0',
            }}
          >
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'center' : 'flex-start',
                padding: '0px',
                gap: '11px',
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '473px',
                height: isMobile ? 'auto' : '28px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '46px',
              }}
            >
              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: isMobile ? 'center' : 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  gap: isMobile ? '0' : '423px',
                  width: isMobile ? '100%' : '473px',
                  height: isMobile ? 'auto' : '28px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                
                <span
                  style={{
                    margin: isMobile ? '0 auto' : '0',
                    width: isMobile ? 'auto' : '473px',
                    height: isMobile ? 'auto' : '28px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '18px' : '20px',
                    lineHeight: '28px',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  Verify Your Account
                </span>
              </div>
            </div>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              padding: '0px',
              gap: '17px',
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '517px',
              height: isMobile ? 'auto' : '36px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '102px',
            }}
          >
            <span
              style={{
                width: isMobile ? '100%' : '517px',
                height: isMobile ? 'auto' : '36px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '13px' : '14px',
                lineHeight: '18px',
                color: '#6B7289',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                textAlign: isMobile ? 'center' : 'left',
              }}
            >
              Copy the verification code and paste it into your Roblox bio
            </span>
          </div>

          
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '5px',
                position: 'absolute',
                width: '27px',
                height: '91px',
                left: '30px',
                top: '305px',
              }}
            >
              
              <div
                style={{
                  width: '27px',
                  height: '27px',
                  background: 'rgba(2, 118, 255, 0.24)',
                  borderRadius: '77px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '18px',
                    left: '10px',
                    top: '2px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#0276FF',
                  }}
                >
                  1
                </span>
              </div>
              
              <div
                style={{
                  width: '27px',
                  height: '27px',
                  background: 'rgba(2, 118, 255, 0.24)',
                  borderRadius: '77px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '11px',
                    height: '18px',
                    left: '8px',
                    top: '2px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#0276FF',
                  }}
                >
                  2
                </span>
              </div>
              
              <div
                style={{
                  width: '27px',
                  height: '27px',
                  background: 'rgba(2, 118, 255, 0.24)',
                  borderRadius: '77px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '18px',
                    left: '9px',
                    top: '2px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#0276FF',
                  }}
                >
                  3
                </span>
              </div>
            </div>
          )}

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '518px',
              height: '54px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '127px',
              background: '#262937',
              borderRadius: '15px',
            }}
          >
            
            <div
              style={{
                position: 'absolute',
                width: '34px',
                height: '34px',
                left: '12px',
                top: '10px',
                background: avatarUrl ? `url(${avatarUrl})` : `url(https://www.roblox.com/headshot-thumbnail/image?userId=${robloxUserId}&width=150&height=150&format=png), #11151D`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '999px',
              }}
            />
            
            <span
              style={{
                position: 'absolute',
                width: isMobile ? 'calc(100% - 100px)' : '114px',
                height: '21px',
                left: isMobile ? '59px' : '59px',
                top: '16px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#B0B5CE',
              }}
            >
              {username}
            </span>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '518px',
              height: '93px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '194px',
              background: '#262937',
              borderRadius: '15px',
              marginTop: isMobile ? '10px' : '0',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: isMobile ? 'calc(100% - 34px)' : '208px',
                height: '18px',
                left: '17px',
                top: '14px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '11px' : '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              PASTE THIS INTO YOUR ROBLOX BIO
            </span>
            <span
              style={{
                position: 'absolute',
                width: isMobile ? 'calc(100% - 34px)' : '488px',
                height: '42px',
                left: '17px',
                top: '41px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
                wordBreak: 'break-all',
              }}
            >
              {verificationCode}
            </span>
            
            <div
              style={{
                position: 'absolute',
                width: isMobile ? '60px' : '64.31px',
                height: '33px',
                right: isMobile ? '10px' : 'auto',
                left: isMobile ? 'auto' : '445px',
                top: '6px',
                background: '#313546',
                borderRadius: '12.6923px',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigator.clipboard.writeText(verificationCode);
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '35px',
                  height: '19px',
                  left: 'calc(50% - 35px/2 + 0.42px)',
                  top: 'calc(50% - 19px/2 + 0.42px)',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12.6923px',
                  lineHeight: '19px',
                  color: '#BEC2D1',
                }}
              >
                Copy
              </span>
            </div>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '355px',
              height: isMobile ? 'auto' : '82px',
              left: isMobile ? '0' : '66px',
              top: isMobile ? '0' : '310px',
              marginTop: isMobile ? '10px' : '0',
            }}
          >
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '137px',
                height: '18px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '11px' : '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              Copy the words above
            </span>
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '355px',
                height: '18px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '31px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '11px' : '12px',
                lineHeight: '18px',
                color: '#0276FF',
              }}
            >
              Open your Roblox Profile and paste the words into your bio
            </span>
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '257px',
                height: '18px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '64px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '11px' : '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              Save your profile, then click "Verify" below
            </span>
          </div>

          
          <span
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '505px',
              height: isMobile ? 'auto' : '18px',
              left: isMobile ? '0' : '36px',
              top: isMobile ? '0' : '479px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: isMobile ? '11px' : '11px',
              lineHeight: '18px',
              color: '#525F7C',
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            By continuing, you agree to our Terms of Service
          </span>

          
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                left: '90.64%',
                right: '6.24%',
                top: '6.66%',
                bottom: '89.83%',
                background: '#FFFFFF',
                mixBlendMode: 'overlay',
              }}
            />
          )}

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '252.5px',
              height: isMobile ? 'auto' : '54px',
              left: isMobile ? '0' : '30px',
              top: isMobile ? '0' : '413px',
              background: '#262937',
              borderRadius: '15px',
              marginTop: isMobile ? '10px' : '0',
            }}
          >
            <button
              type="button"
              onClick={() => window.open(`https://www.roblox.com/users/${robloxUserId}/profile`, '_blank')}
              style={{
                width: '100%',
                height: '54px',
                background: 'transparent',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#BEC2D1',
              }}
            >
              Open Profile
            </button>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '252.5px',
              height: isMobile ? 'auto' : '54px',
              left: isMobile ? '0' : '294px',
              top: isMobile ? '0' : '413px',
              background: '#0276FF',
              borderRadius: '15px',
              marginTop: isMobile ? '10px' : '0',
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '54px',
                background: 'transparent',
                borderRadius: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
              }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </>
      )}
        </div>

        
        {error && (
          <span
            style={{
              position: 'absolute',
              width: '518px',
              fontFamily: 'Poppins',
              fontSize: '13px',
              color: '#FF4444',
              left: '30px',
              top: '500px',
              textAlign: 'center',
            }}
          >
            {error}
          </span>
        )}
      </div>
      </form>
    </div>
  );
}
