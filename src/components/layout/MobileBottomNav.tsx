'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';
import { useMobileLayout } from '@/context/MobileLayoutContext';

export default function MobileBottomNav() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useMobileLayout();

  if (!isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '59px',
        left: '0px',
        bottom: '0px',
        background: '#191C25',
        borderRadius: '10px 10px 0px 0px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Blue indicator bar */}
      <div
        style={{
          position: 'absolute',
          width: '108px',
          height: '4px',
          right: '16px',
          bottom: '0px',
          background: '#0276FF',
          borderRadius: '40px 8px 0px 0px',
        }}
      />

      {/* Icons container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: '400px',
          padding: '0 20px',
          height: '40px',
        }}
      >
        {/* Chat icon (toggle sidebar) */}
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 1H18C19.1046 1 20 1.89543 20 3V9C20 10.1046 19.1046 11 18 11H6L2 14V3C2 1.89543 2.89543 1 4 1H2Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Home icon */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="17"
            height="13"
            viewBox="0 0 17 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L8.5 1L16 5V11C16 11.5304 15.7893 12.0391 15.4142 12.4142C15.0391 12.7893 14.5304 13 14 13H3C2.46957 13 1.96086 12.7893 1.58579 12.4142C1.21071 12.0391 1 11.5304 1 11V5Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Profile icon (active with blue border and shadow) */}
        <button
          onClick={() => window.location.href = '/settings'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              border: '2px solid #0276FF',
              boxShadow: '0px 0px 4px rgba(0, 110, 255, 0.25)',
              borderRadius: '50%'
            }}
          >
            <circle cx="10" cy="10" r="8" stroke="#0276FF" strokeWidth="2" />
            <circle cx="10" cy="7" r="3" stroke="#0276FF" strokeWidth="2" />
            <path d="M5 16C5 13.5 7.5 12 10 12C12.5 12 15 13.5 15 16" stroke="#0276FF" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
