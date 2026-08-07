'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  amount: string;
  date: string;
  currency: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  status: 'Pending' | 'Completed' | 'Failed';
}

interface CryptoTransactionHistoryProps {
  cryptoType?: 'BTC' | 'ETH' | 'LTC' | 'USDT' | 'SOL';
}

export default function CryptoTransactionHistory({ cryptoType = 'BTC' }: CryptoTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = cryptoType 
          ? `/api/crypto/transactions/${cryptoType}`
          : '/api/crypto/transactions';
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error('Failed to fetch transactions');
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [cryptoType]);

  if (loading) {
    return (
      <div
        style={{
          width: '534px',
          height: '136px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7C7C89',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
        }}
      >
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        style={{
          width: '534px',
          height: '136px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7C7C89',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
        }}
      >
        No past transactions
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '6px',
        width: '534px',
        height: '136px',
      }}
    >
      {transactions.map((tx, index) => (
        <div
          key={index}
          style={{
            width: '534px',
            height: '43px',
            background: '#1C212E',
            borderRadius: '15px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '8px',
              position: 'absolute',
              width: '64px',
              height: '21px',
              left: '14px',
              top: 'calc(50% - 21px/2 - 0.5px)',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '16px',
                background: '#0276FF',
              }}
            />
            <span
              style={{
                width: '36px',
                height: '21px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#FFFFFF',
              }}
            >
              {tx.amount}
            </span>
          </div>
          <span
            style={{
              position: 'absolute',
              width: '79px',
              height: '21px',
              left: 'calc(50% - 79px/2 - 116.45px)',
              top: 'calc(50% - 21px/2)',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#5E6475',
            }}
          >
            {tx.date}
          </span>
          <span
            style={{
              position: 'absolute',
              width: '28px',
              height: '21px',
              left: 'calc(50% - 28px/2 - 34.91px)',
              top: 'calc(50% - 21px/2)',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#5E6475',
            }}
          >
            {tx.currency}
          </span>
          <span
            style={{
              position: 'absolute',
              width: '57px',
              height: '21px',
              left: 'calc(50% - 57px/2 + 35.64px)',
              top: 'calc(50% - 21px/2)',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#5E6475',
            }}
          >
            {tx.type}
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '8px 14px',
              gap: '10px',
              position: 'absolute',
              width: '87px',
              height: '34px',
              right: '4px',
              top: '4px',
              background: tx.status === 'Pending' ? '#0276FF' : tx.status === 'Completed' ? '#4CAF50' : '#FF6B6B',
              borderRadius: '15px',
            }}
          >
            <span
              style={{
                width: '59px',
                height: '18px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
              }}
            >
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
