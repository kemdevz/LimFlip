'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageChat from './MessageChat';
import ChatInput from './ChatInput';
import SendButton from './SendButton';
import Link from 'next/link';

interface Message {
  username: string;
  message: string;
  time: string;
  avatarUrl: string;
  isWhale?: boolean;
}

export default function Sidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      username: 'jakep',
      message: 'i gambled my life savings, and won. thank you bloxybet. now im a whale.',
      time: '15:24',
      avatarUrl: '/PFPJAKEP.png',
      isWhale: true,
    },
  ]);
  const [socket, setSocket] = useState<any>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Load messages from localStorage after mount
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('chat-message', (data: Message) => {
      setMessages((prev) => {
        const newMessages = [...prev, data];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [isMounted]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newMessage: Message = {
      username: user.username || 'Anonymous',
      message: inputMessage,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: '/1SIDE.png',
      isWhale: false,
    };

    // Only emit to socket, don't add to local state (socket will broadcast back)
    socket?.emit('chat-message', newMessage);
    setInputMessage('');
  };
  return (
    <div
      className="absolute"
      style={{
        width: 'min(22vw, 352px)',
        height: '100vh',
        left: '0px',
        top: '0px',
        background: '#161922',
      }}
    >
      {/* Top left header */}
      <div
        className="absolute"
        style={{
          width: '100%',
          height: 'min(12vh, 132px)',
          left: '0px',
          top: '0px',
          background: '#111318',
        }}
      >
        {/* Logo container */}
        <Link href="/">
          <div
            className="absolute"
            style={{
              width: 'min(85%, 300px)',
              height: 'min(12vh, 162px)',
              left: 'min(7%, 20px)',
              top: 'min(1vh, -2px)',
              cursor: 'pointer',
            }}
          >
            <img
              src="/logo.svg"
              alt="bloxbash logo"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </Link>

        {/* Blur effect */}
        <div
          className="absolute"
          style={{
            width: '276px',
            height: '65px',
            left: '13.5px',
            top: '-37px',
            background: 'rgba(2, 118, 255, 0.22)',
            filter: 'blur(45.65px)',
            borderRadius: '66px',
          }}
        />
      </div>

      {/* Chat messages area */}
      <div
        ref={messagesContainerRef}
        className="absolute chat-messages-container"
        style={{
          width: '100%',
          height: 'calc(100vh - min(12vh, 132px) - min(13vh, 136px))',
          left: '0px',
          top: 'min(12vh, 132px)',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .chat-messages-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {messages.map((msg, index) => (
            <MessageChat
              key={index}
              username={msg.username}
              message={msg.message}
              time={msg.time}
              avatarUrl={msg.avatarUrl}
              isWhale={msg.isWhale}
            />
          ))}
        </div>
      </div>

      {/* Chat input */}
      <ChatInput onMessageChange={setInputMessage} message={inputMessage} onSend={handleSendMessage} />
      <SendButton onSend={handleSendMessage} />
    </div>
  );
}
