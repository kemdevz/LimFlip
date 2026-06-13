'use client';

import { useState } from 'react';

interface ChatInputProps {
  onMessageChange: (message: string) => void;
  message: string;
  onSend: () => void;
}

export default function ChatInput({ onMessageChange, message, onSend }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div
      className="absolute"
      style={{
        width: 'min(85%, 298px)',
        height: 'min(4vh, 46px)',
        left: '0px',
        bottom: '10px',
      }}
    >
      <div
        style={{
          width: '278.53px',
          height: '46.58px',
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
          left: 'min(8%, 23px)',
          top: '0px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'min(1.1vw, 14px)',
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
        width={19}
        height={19}
        style={{
          position: 'absolute',
          right: 'min(3%, 10px)',
          top: 'min(1vh, 11px)',
          width: 'min(1.5vw, 19px)',
          height: 'min(1.5vw, 19px)',
        }}
      />
      </div>
    </div>
  );
}
