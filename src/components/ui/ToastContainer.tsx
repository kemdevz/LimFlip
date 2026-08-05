'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/Toast';
import WithdrawModal from '@/components/withdraw/WithdrawModal';

export default function ToastContainer() {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [withdrawModal, setWithdrawModal] = useState<{ isOpen: boolean; withdrawalId?: string; itemCount?: number }>({
    isOpen: false,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('deposit-received', (data: any) => {
      // Only show notification if it's for the current user
      if (user && data.userId === user.id) {
        toast.success(`Deposit received: ${data.itemCount} items (B$${(data.totalValue / 1000).toFixed(0)}K)`);
      }
    });

    socket.on('withdrawal-created', (data: any) => {
      // Only show modal if it's for the current user
      if (user && data.userId === user.id) {
        setWithdrawModal({
          isOpen: true,
          withdrawalId: data.withdrawalId,
          itemCount: data.itemCount,
        });
      }
    });

    return () => {
      socket.off('deposit-received');
      socket.off('withdrawal-created');
    };
  }, [socket, user]);

  return (
    <>
      <WithdrawModal
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ isOpen: false })}
        withdrawalId={withdrawModal.withdrawalId}
        itemCount={withdrawModal.itemCount}
      />
    </>
  );
}
