'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';

interface SendButtonProps {
  onSend: () => void;
}

export default function SendButton({ onSend }: SendButtonProps) {
  const isMobile = useIsMobile();
  return (
    <div
      className="absolute"
      onClick={onSend}
      style={{
        width: isMobile ? '50px' : 'min(4vh, 46px)',
        height: isMobile ? '50px' : 'min(4vh, 46px)',
        left: isMobile ? 'calc(100% - 60px)' : 'calc(9px + 280px + 8px)',
        bottom: '10px',
        opacity: 0.44,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.44';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: '0px',
          top: '0px',
          background: '#1F232F',
          borderRadius: '10.6755px',
          transition: 'background 0.2s ease',
        }}
      />
      <img
        src="/assets/svg/chat/send.svg"
        alt="Send"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '20px' : '18px',
          height: isMobile ? '20px' : '18px',
        }}
      />
    </div>
  );
}
