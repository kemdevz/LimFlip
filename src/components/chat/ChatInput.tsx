'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface ChatInputProps {
  onMessageChange: (message: string) => void;
  message: string;
  onSend: () => void;
}

export default function ChatInput({ onMessageChange, message, onSend }: ChatInputProps) {
  const isMobile = useIsMobile();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div
      className="absolute"
      style={{
        width: isMobile ? 'calc(100% - 70px)' : 'min(85%, 298px)',
        height: isMobile ? '50px' : 'min(4vh, 46px)',
        left: '0px',
        bottom: '10px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          left: '9px',
          top: '0px',
          background: '#1F232F',
          borderRadius: '7.76401px',
          position: 'relative',
        }}
      >
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write something.."
        style={{
          position: 'absolute',
          width: 'calc(100% - 60px)',
          height: '100%',
          left: isMobile ? '15px' : 'min(8%, 23px)',
          top: '0px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: isMobile ? '16px' : 'min(1.1vw, 14px)',
          lineHeight: '1.5',
          color: '#FFFFFF',
          fontWeight: '600',
          background: 'transparent',
          border: 'none',
          outline: 'none',
        }}
      />

      {/* Emoji icon */}
      <img
        src="/assets/svg/ui/emoji.svg"
        alt="Emoji"
        width={isMobile ? 22 : 19}
        height={isMobile ? 22 : 19}
        style={{
          position: 'absolute',
          right: isMobile ? '15px' : 'min(3%, 10px)',
          top: isMobile ? '50%' : 'min(1vh, 11px)',
          transform: isMobile ? 'translateY(-50%)' : 'none',
          width: isMobile ? '22px' : 'min(1.5vw, 19px)',
          height: isMobile ? '22px' : 'min(1.5vw, 19px)',
        }}
      />
      </div>
    </div>
  );
}
