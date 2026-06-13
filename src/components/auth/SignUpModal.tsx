'use client';

import { useState, useEffect } from 'react';

interface SignUpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SignUpModal({ isOpen = false, onClose }: SignUpModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = enter username, 2 = confirm account, 3 = update description
  const [robloxUserId, setRobloxUserId] = useState<number | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

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

        if (response.ok) {
          // Username exists, store userId, verification code and move to confirmation step
          setRobloxUserId(data.userId);
          setVerificationCode(data.verificationCode || '');
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
        const body = { username, robloxUserId };

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

        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <form onSubmit={handleSubmit}>
      <div
        style={{
          position: 'relative',
          width: '939px',
          height: '521px',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.15s ease-in-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - PNG image */}
        <div
          style={{
            position: 'absolute',
            width: '362px',
            height: '531px',
            left: 'calc(50% - 362px/2 - 288.5px)',
            top: 'calc(50% - 531px/2 + 5px)',
            borderRadius: '28px 0px 0px 28px',
            overflow: 'hidden',
          }}
        >
          <img
            src="/assets/svg/loginbgg.png"
            alt="Login"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right side - Form */}
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '577px',
            height: '531px',
            left: 'calc(50% - 577px/2 + 181px)',
            top: 'calc(50% - 531px/2 + 5px)',
            background: '#191B25',
            border: '1px solid #222530',
            borderRadius: '0px 28px 28px 0px',
          }}
        >
          {/* Step 1: Username input */}
          {step === 1 && (
            <>
              {/* Content frame */}
              <div
                style={{
                  position: 'absolute',
                  width: '518px',
                  height: '329px',
                  left: '30px',
                  top: '-12px',
                }}
              >
                {/* Welcome header */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '11px',
                    position: 'absolute',
                    width: '473px',
                    height: '28px',
                    left: '0px',
                    top: '46px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '423px',
                      width: '473px',
                      height: '28px',
                    }}
                  >
                    <span
                      style={{
                        margin: '0 auto',
                        width: '473px',
                        height: '28px',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '28px',
                        color: '#FFFFFF',
                      }}
                    >
                      Welcome
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '11px',
                    position: 'absolute',
                    width: '518px',
                height: '311px',
                left: '0px',
                top: '156px',
              }}
            >
              {/* Username field */}
              <div
                style={{
                  width: '518px',
                  height: '84px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '116px',
                    height: '18px',
                    right: '402px',
                    top: '0px',
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
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter roblox username"
                  style={{
                    position: 'absolute',
                    width: '518px',
                    height: '54px',
                    left: '0px',
                    top: '30px',
                    background: '#262937',
                    borderRadius: '15px',
                    border: 'none',
                    padding: '0 18px',
                    color: '#6B7289',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Continue button */}
              <div
                style={{
                  width: '518px',
                  height: '68px',
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '518px',
                    height: '54px',
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
                  }}
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </div>

              {/* Welcome text */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '17px',
                  position: 'absolute',
                  width: '517px',
                  height: '53px',
                  left: '0px',
                  top: '87px',
                }}
              >
                <span
                  style={{
                    width: '517px',
                    height: '18px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '18px',
                    color: '#6B7289',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Welcome to BloxBash, the leading roblox social arcade for Crypto and R$
                </span>
                <span
                  style={{
                    width: '517px',
                    height: '18px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '18px',
                    color: '#6B7289',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Enter your roblox username to get started.
                </span>
              </div>

              {/* "or" divider */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '20px',
                  position: 'absolute',
                  width: '518px',
                  height: '17px',
                  left: '0px',
                  top: '324px',
                }}
              >
                <div
                  style={{
                    width: '232.5px',
                    height: '0px',
                    mixBlendMode: 'overlay',
                    border: '1px solid #FFFFFF',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Proxima Nova, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#6B7289',
                  }}
                >
                  or
                </span>
                <div
                  style={{
                    width: '232.5px',
                    height: '0px',
                    mixBlendMode: 'overlay',
                    border: '1px solid #FFFFFF',
                  }}
                />
              </div>

              {/* Social login buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '11px',
                  position: 'absolute',
                  width: '516px',
                  height: '54px',
                  left: '0px',
                  top: '354px',
                }}
              >
                {/* Google */}
                <div
                  onClick={() => window.open('https://accounts.google.com', '_blank')}
                  style={{
                    width: '252.5px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '11px',
                    }}
                  >
                    <img src="/assets/svg/auth/google.svg" alt="Google" style={{ width: '26px', height: '26px' }} />
                    <span
                      style={{
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#BEC2D1',
                      }}
                    >
                      Google
                    </span>
                  </div>
                </div>

                {/* Discord */}
                <div
                  onClick={() => window.open('https://discord.com', '_blank')}
                  style={{
                    width: '252.5px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '11px',
                    }}
                  >
                    <img src="/assets/svg/auth/discord.svg" alt="Discord" style={{ width: '26px', height: '26px' }} />
                    <span
                      style={{
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#BEC2D1',
                      }}
                    >
                      Discord
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Profile confirmation */}
      {step === 2 && (
        <>
          {/* Frame 2131327912 - Header */}
          <div
            style={{
              position: 'absolute',
              width: '518px',
              height: '114px',
              left: '30px',
              top: '-12px',
            }}
          >
            {/* Frame 23622476 */}
            <div
              style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '11px',
                        position: 'absolute',
                        width: '473px',
                        height: '28px',
                        left: '0px',
                        top: '46px',
                      }}
                    >
                      {/* Frame 23622475 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '423px',
                          width: '473px',
                          height: '28px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Is this your account? */}
                        <span
                          style={{
                            margin: '0 auto',
                            width: '473px',
                            height: '28px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '20px',
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

                      {/* Frame 2131329315 - Welcome text */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '17px',
                          position: 'absolute',
                          width: '517px',
                          height: '18px',
                          left: '0px',
                          top: '87px',
                        }}
                      >
                        <span
                          style={{
                            width: '517px',
                            height: '18px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '18px',
                            color: '#6B7289',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Welcome to BloxBash, the leading roblox social arcade for Crypto and R$
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Frame 2131329318 - Profile section */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      position: 'absolute',
                      width: '113px',
                      height: '177px',
                      left: '232px',
                      top: '166px',
                    }}
                  >
                    {/* Profile picture */}
                    <div
                      style={{
                        width: '113px',
                        height: '113px',
                        background: `url(https://tr.rbxcdn.com/${robloxUserId}/150/150/AvatarHeadshot/Png), #11151D`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '999px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    />
                    {/* Frame 2131329317 - Username and ID */}
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

                  {/* Bottom text */}
                  <span
                    style={{
                      position: 'absolute',
                      width: '529px',
                      height: '36px',
                      left: '30px',
                      top: '468px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: '#525F7C',
                    }}
                  >
                    By continuing, you agree to our Terms of Service
                  </span>

                  {/* Vector overlay */}
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

                  {/* Frame 2131329319 - Back button */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '252.5px',
                      height: '54px',
                      left: '30px',
                      top: '388px',
                      background: '#262937',
                      borderRadius: '15px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setStep(1)}
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

                  {/* Frame 2131327917 - Yes, Continue button */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '252.5px',
                      height: '54px',
                      left: '294px',
                      top: '388px',
                      background: '#0276FF',
                      borderRadius: '15px',
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

      {/* Step 3: Verification */}
      {step === 3 && (
        <>
          {/* Frame 2131327912 - Header */}
          <div
            style={{
              position: 'absolute',
              width: '518px',
              height: '114px',
              left: '30px',
              top: '-12px',
            }}
          >
            {/* Frame 23622476 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '11px',
                position: 'absolute',
                width: '473px',
                height: '28px',
                left: '0px',
                top: '46px',
              }}
            >
              {/* Frame 23622475 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '423px',
                  width: '473px',
                  height: '28px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Verify Your Account */}
                <span
                  style={{
                    margin: '0 auto',
                    width: '473px',
                    height: '28px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '20px',
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

          {/* Frame 2131329315 - Instructions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '17px',
              position: 'absolute',
              width: '517px',
              height: '36px',
              left: '30px',
              top: '102px',
            }}
          >
            <span
              style={{
                width: '517px',
                height: '36px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '18px',
                color: '#6B7289',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              Copy the verification code and paste it into your Roblox bio
            </span>
          </div>

          {/* Step indicators */}
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
            {/* Step 1 */}
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
            {/* Step 2 */}
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
            {/* Step 3 */}
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

          {/* Username input */}
          <div
            style={{
              position: 'absolute',
              width: '518px',
              height: '54px',
              left: '30px',
              top: '127px',
              background: '#262937',
              borderRadius: '15px',
            }}
          >
            {/* Profile picture */}
            <div
              style={{
                position: 'absolute',
                width: '34px',
                height: '34px',
                left: '12px',
                top: '10px',
                background: `url(https://tr.rbxcdn.com/${robloxUserId}/150/150/AvatarHeadshot/Png), #11151D`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '999px',
              }}
            />
            {/* Username */}
            <span
              style={{
                position: 'absolute',
                width: '114px',
                height: '21px',
                left: '59px',
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

          {/* Code input */}
          <div
            style={{
              position: 'absolute',
              width: '518px',
              height: '93px',
              left: '30px',
              top: '194px',
              background: '#262937',
              borderRadius: '15px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '208px',
                height: '18px',
                left: '17px',
                top: '14px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              PASTE THIS INTO YOUR ROBLOX BIO
            </span>
            <span
              style={{
                position: 'absolute',
                width: '488px',
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
            {/* Copy button */}
            <div
              style={{
                position: 'absolute',
                width: '64.31px',
                height: '33px',
                left: '445px',
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

          {/* Instructions */}
          <div
            style={{
              position: 'absolute',
              width: '355px',
              height: '82px',
              left: '66px',
              top: '310px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '137px',
                height: '18px',
                left: '0px',
                top: '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              Copy the words above
            </span>
            <span
              style={{
                position: 'absolute',
                width: '355px',
                height: '18px',
                left: '0px',
                top: '31px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#0276FF',
              }}
            >
              Open your Roblox Profile and paste the words into your bio
            </span>
            <span
              style={{
                position: 'absolute',
                width: '257px',
                height: '18px',
                left: '0px',
                top: '64px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#B0B5CE',
              }}
            >
              Save your profile, then click "Verify" below
            </span>
          </div>

          {/* Bottom text */}
          <span
            style={{
              position: 'absolute',
              width: '505px',
              height: '18px',
              left: '36px',
              top: '479px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '11px',
              lineHeight: '18px',
              color: '#525F7C',
            }}
          >
            By continuing, you agree to our Terms of Service
          </span>

          {/* Vector overlay */}
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

          {/* Open Profile button */}
          <div
            style={{
              position: 'absolute',
              width: '252.5px',
              height: '54px',
              left: '30px',
              top: '413px',
              background: '#262937',
              borderRadius: '15px',
            }}
          >
            <button
              type="button"
              onClick={() => window.open(`https://www.roblox.com/users/${robloxUserId}/profile`, '_blank')}
              style={{
                width: '252.5px',
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

          {/* Verify button */}
          <div
            style={{
              position: 'absolute',
              width: '252.5px',
              height: '54px',
              left: '294px',
              top: '413px',
              background: '#0276FF',
              borderRadius: '15px',
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
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </>
      )}
        </div>

        {/* Error display */}
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
