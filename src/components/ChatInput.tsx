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
        bottom: 'min(8vh, 90px)',
      }}
    >
      <div
        style={{
          width: 'min(96%, 287px)',
          height: 'min(3.8vh, 41px)',
          left: 'min(2%, 5px)',
          top: '0px',
          border: '1px solid #33394B',
          borderRadius: '8px',
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
        src="/assets/svg/emoji.svg"
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
