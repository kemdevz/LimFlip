'use client';

import React, { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/Toast';

export default function ToastContainer() {
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on('deposit-received', (data: any) => {
      // Only show notification if it's for the current user
      if (user && data.userId === user.id) {
        toast.success(`Deposit received: ${data.itemCount} items (B$${(data.totalValue / 1000).toFixed(0)}K)`);
      }
    });

    return () => {
      socket.off('deposit-received');
    };
  }, [socket, user]);

  return null;
}
