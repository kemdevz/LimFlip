'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? '#00C853' : type === 'error' ? '#FF3D00' : '#2196F3';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: bgColor,
        color: '#FFFFFF',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      {message}
    </div>
  );
}
