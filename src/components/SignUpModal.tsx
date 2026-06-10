'use client';

import { useState, useEffect } from 'react';

interface SignUpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SignUpModal({ isOpen = false, onClose }: SignUpModalProps) {
  const [isRegister, setIsRegister] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const endpoint = isRegister ? 'http://localhost:3001/auth/signup' : 'http://localhost:3001/auth/login';
      const body = isRegister ? { username, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Close modal
      onClose?.();
      
      // Reload page to update auth state
      window.location.reload();
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
          height: '689px',
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
            height: '689px',
            left: 'calc(50% - 362px/2 - 288.5px)',
            top: 'calc(50% - 689px/2)',
            borderRadius: '28px 0px 0px 28px',
            overflow: 'visible',
          }}
        >
          <img
            src="/login.png"
            alt="Login"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Pet image */}
          <img
            src="/pet.png"
            alt="Pet"
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              left: '-80px',
              top: '50%',
              transform: 'translateY(-50%)',
              objectFit: 'contain',
            }}
          />

          {/* Glassmorphism card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px 17px',
              gap: '10px',
              position: 'absolute',
              width: '328px',
              height: '134px',
              left: '17px',
              bottom: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              backgroundBlendMode: 'plus-lighter',
              boxShadow: 'inset 0px -4px 2px rgba(0, 0, 0, 0.25), inset 0px 4px 2px rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
            }}
          >
            {/* Sword SVG */}
            <svg
              width="85"
              height="85"
              viewBox="0 0 85 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <g filter="url(#filter0_d_991_494)">
                <path
                  d="M35.3978 44.0556L40.3968 49.2054L38.3986 51.2647L40.3996 53.3255L38.4 55.3848L34.9001 51.7803L30.8995 55.9004L28.8999 53.8411L32.9005 49.7195L29.4005 46.1164L31.4001 44.057L33.3997 46.1149L35.3978 44.0556ZM29.6734 28.9004L34.6879 28.9048L51.3987 46.1164L53.3997 44.057L55.4007 46.1164L51.9007 49.7209L55.8999 53.8411L53.9003 55.9004L49.8997 51.7803L46.4012 55.3848L44.4002 53.3255L46.3998 51.2647L29.6763 34.0429L29.6734 28.9004ZM50.1175 28.9004L55.1278 28.9048L55.1306 34.0356L49.3991 39.9369L44.3988 34.7886L50.1175 28.9004Z"
                  fill="black"
                  fillOpacity="0.5"
                  shapeRendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_991_494"
                  x="-9.72748e-05"
                  y="0.000391006"
                  width="84.8"
                  height="84.8"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="14.45" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.184314 0 0 0 0 0.560784 0 0 0 0 1 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_991_494"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_991_494"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>

            {/* Logo */}
            <div
              style={{
                position: 'relative',
                width: '177px',
                height: '33px',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '68px',
                  height: '45px',
                  left: '109px',
                  top: '-6px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: '30px',
                  lineHeight: '45px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                bash
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '66px',
                  height: '45px',
                  left: '0px',
                  top: '-6px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: '30px',
                  lineHeight: '45px',
                  color: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                blox
              </span>
            </div>

            {/* Text */}
            <span
              style={{
                width: '294px',
                height: '54px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '18px',
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              By registering in your recognize that you are in agreement to our Terms of Service as-well as being over the age of 18+.
            </span>
          </div>
        </div>

        {/* Right side - Form */}
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '577px',
            height: '689px',
            left: 'calc(50% - 577px/2 + 181px)',
            top: 'calc(50% - 689px/2)',
            background: '#191B25',
            border: '1px solid #222530',
            borderRadius: '0px 28px 28px 0px',
          }}
        >
          {/* Content frame */}
          <div
            style={{
              position: 'absolute',
              width: '518px',
              height: '533.36px',
              left: '30px',
              top: '78px',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '5px',
                position: 'absolute',
                width: '518px',
                height: '77px',
                left: '0px',
                top: '-20px',
              }}
            >
              {/* Title */}
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                }}
              >
                {isRegister ? 'Register' : 'Log In'}
              </span>

              {/* Toggle buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '10px',
                }}
              >
                <div
                  onClick={() => setIsRegister(true)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '5px 14px',
                    gap: '10px',
                    background: isRegister ? '#262937' : 'transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '28px',
                      color: '#FFFFFF',
                    }}
                  >
                    Register
                  </span>
                </div>
                <div
                  onClick={() => setIsRegister(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '5px 14px',
                    gap: '10px',
                    background: !isRegister ? '#262937' : 'transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    opacity: !isRegister ? 1 : 0.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '15px',
                      lineHeight: '28px',
                      color: '#FFFFFF',
                    }}
                  >
                    Log In
                  </span>
                </div>
              </div>
            </div>

            {/* Top divider line */}
            <div
              style={{
                position: 'absolute',
                width: '518px',
                height: '2px',
                left: '0px',
                top: '77px',
                background: '#FFFFFF',
                mixBlendMode: 'overlay',
                borderRadius: '9px',
              }}
            />

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
                top: '90px',
              }}
            >
              {/* Username field - only show for register */}
              {isRegister && (
              <div
                style={{
                  width: '518px',
                  height: '84px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
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
                  placeholder="Enter username"
                  style={{
                    width: '518px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '9px',
                    border: 'none',
                    padding: '0 18px',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
              )}

              {/* Email field */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '12px',
                  width: '518px',
                  height: '84px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#6B7289',
                  }}
                >
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  style={{
                    width: '518px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '9px',
                    border: 'none',
                    padding: '0 18px',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Password field */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '12px',
                  width: '518px',
                  height: '84px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#6B7289',
                  }}
                >
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={{
                    width: '518px',
                    height: '54px',
                    background: '#262937',
                    borderRadius: '9px',
                    border: 'none',
                    padding: '0 18px',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Error display */}
              {error && (
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    color: '#FF4444',
                  }}
                >
                  {error}
                </span>
              )}

              {/* Register button */}
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
                    borderRadius: '9px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '27px',
                    color: '#FFFFFF',
                  }}
                >
                  {loading ? 'Loading...' : (isRegister ? 'Register' : 'Log In')}
                </button>
              </div>
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
                top: '447px',
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
                gap: '13px',
                position: 'absolute',
                width: '518px',
                height: '54px',
                left: '0px',
                top: '477px',
              }}
            >
              {/* Roblox */}
              <div
                style={{
                  width: '164px',
                  height: '54px',
                  background: '#262937',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src="/roblox.svg" alt="Roblox" style={{ width: '117px', height: '31px' }} />
              </div>

              {/* Google */}
              <div
                style={{
                  width: '164px',
                  height: '54px',
                  background: '#262937',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src="/google.svg" alt="Google" style={{ width: '92px', height: '26px' }} />
              </div>

              {/* Discord */}
              <div
                style={{
                  width: '164px',
                  height: '54px',
                  background: '#262937',
                  borderRadius: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <img src="/discord.svg" alt="Discord" style={{ width: '95px', height: '26px' }} />
              </div>
            </div>

            {/* Divider line */}
            <div
              style={{
                position: 'absolute',
                width: '518px',
                height: '2px',
                left: '0px',
                top: '547px',
                background: '#FFFFFF',
                mixBlendMode: 'overlay',
                borderRadius: '9px',
              }}
            />

            {/* Bottom text */}
            <div
              style={{
                position: 'absolute',
                width: '534px',
                height: '36px',
                left: '0px',
                top: '567px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '18px',
                  color: '#525F7C',
                }}
              >
                By registering, you agree to our Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
}
