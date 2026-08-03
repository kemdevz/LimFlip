'use client';

import { toast as hotToast, Toaster } from 'react-hot-toast';

export const toast = {
  success: (message: string) => {
    hotToast.success(message, {
      style: {
        background: 'rgb(23, 25, 32)',
        border: '1px solid rgb(35, 37, 49)',
        color: 'rgb(238, 242, 248)',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        fontWeight: '600',
        fontSize: '13.6px',
        letterSpacing: '-0.1px',
        borderRadius: '11px',
        padding: '11px 15px',
        maxWidth: '380px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 14px -6px',
      },
      iconTheme: {
        primary: '#00ff88',
        secondary: '#fff',
      },
    });
  },
  error: (message: string) => {
    hotToast.error(message, {
      style: {
        background: 'rgb(23, 25, 32)',
        border: '1px solid rgb(35, 37, 49)',
        color: 'rgb(238, 242, 248)',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        fontWeight: '600',
        fontSize: '13.6px',
        letterSpacing: '-0.1px',
        borderRadius: '11px',
        padding: '11px 15px',
        maxWidth: '380px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 14px -6px',
      },
      iconTheme: {
        primary: '#ff4d4d',
        secondary: '#fff',
      },
    });
  },
  info: (message: string) => {
    hotToast(message, {
      style: {
        background: 'rgb(23, 25, 32)',
        border: '1px solid rgb(35, 37, 49)',
        color: 'rgb(238, 242, 248)',
        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
        fontWeight: '600',
        fontSize: '13.6px',
        letterSpacing: '-0.1px',
        borderRadius: '11px',
        padding: '11px 15px',
        maxWidth: '380px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 14px -6px',
      },
      iconTheme: {
        primary: '#006eff',
        secondary: '#fff',
      },
    });
  },
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgb(23, 25, 32)',
          border: '1px solid rgb(35, 37, 49)',
          color: 'rgb(238, 242, 248)',
          fontFamily: 'var(--font-poppins), system-ui, sans-serif',
          fontWeight: '600',
          fontSize: '13.6px',
          letterSpacing: '-0.1px',
          borderRadius: '11px',
          padding: '11px 15px',
          maxWidth: '380px',
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 14px -6px',
        },
      }}
    />
  );
}
