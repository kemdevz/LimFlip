'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import MessageChat from '../chat/MessageChat';
import ChatInput from '../chat/ChatInput';
import SendButton from '../chat/SendButton';
import Link from 'next/link';

interface Message {
  username: string;
  message: string;
  time: string;
  avatarUrl: string;
  isWhale?: boolean;
}

export default function Sidebar() {
  const { socket, onlineCount } = useSocket();
  const [messages, setMessages] = useState<Message[]>([
    {
      username: 'jakep',
      message: 'i gambled my life savings, and won. thank you bloxybet. now im a whale.',
      time: '15:24',
      avatarUrl: '/assets/images/auth/PFPJAKEP.png',
      isWhale: true,
    },
  ]);
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
    if (!isMounted || !socket) return;

    socket.on('chat-message', (data: Message) => {
      setMessages((prev) => {
        const newMessages = [...prev, data];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));
        return newMessages;
      });
    });

    return () => {
      socket.off('chat-message');
    };
  }, [isMounted, socket]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newMessage: Message = {
      username: user.username || 'Anonymous',
      message: inputMessage,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: '/assets/images/coinflip/1SIDE.png',
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
        background: '#191D29',
      }}
    >
      {/* Top left header */}
      <div
        className="absolute"
        style={{
          width: '352px',
          height: '132px',
          left: '0px',
          top: '0px',
          background: '#131621',
          overflow: 'hidden',
        }}
      >
        {/* Logo container */}
        <Link href="/">
          <div
            className="absolute"
            style={{
              width: '194.96px',
              height: '36px',
              left: '79px',
              top: '48px',
              cursor: 'pointer',
            }}
          >
            <img
              src="/assets/svg/ui/logo.svg"
              alt="bloxbash logo"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </Link>

        {/* Blue blur effect left */}
        <div
          className="absolute"
          style={{
            width: '302px',
            height: '91px',
            left: '-266px',
            top: '42px',
            background: 'rgba(2, 118, 255, 0.12)',
            filter: 'blur(25.4292px)',
            borderRadius: '36.7651px',
          }}
        />

        {/* Blue blur effect right */}
        <div
          className="absolute"
          style={{
            width: '302px',
            height: '91px',
            left: '243px',
            top: '-31px',
            background: 'rgba(2, 118, 255, 0.12)',
            filter: 'blur(25.4292px)',
            borderRadius: '36.7651px',
          }}
        />
      </div>

      {/* Chat header section */}
      <div
        className="absolute"
        style={{
          width: '327px',
          height: '34px',
          left: '16px',
          top: '142px',
          background: '#191D29',
        }}
      >
        {/* Chat title */}
        <span
          style={{
            position: 'absolute',
            width: '43px',
            height: '26px',
            left: '0px',
            top: '5px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '17px',
            lineHeight: '26px',
            color: '#FFFFFF',
          }}
        >
          Chat
        </span>

        {/* Control buttons */}
        <div
          style={{
            position: 'absolute',
            width: '150px',
            height: '34px',
            left: '177px',
            top: '0px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '6px',
          }}
        >
          {/* Online count button */}
          <div
            style={{
              width: '70px',
              height: '34px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '73px',
                height: '34px',
                left: '-3px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '8px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                height: '21px',
                left: '45px',
                top: '6px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#FFFFFF',
                textAlign: 'right',
              }}
            >
              {onlineCount}
            </span>
            <div
              style={{
                position: 'absolute',
                width: '7px',
                height: '7px',
                left: '33px',
                top: '13px',
                background: '#6EFF66',
                borderRadius: '49px',
              }}
            />
            <img
              src="/assets/svg/chat/usa.svg"
              alt="Online"
              style={{
                position: 'absolute',
                width: '23px',
                height: '16px',
                left: '5px',
                top: '9px',
                borderRadius: '3px',
              }}
            />
          </div>

          {/* Button 1 */}
          <div
            style={{
              width: '34px',
              height: '34px',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '34px',
                height: '34px',
                left: '0px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '8px',
              }}
            />
            <img
              src="/assets/svg/chat/rules.svg"
              alt="Rules"
              style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                left: '8px',
                top: '8px',
              }}
            />
          </div>

          {/* Button 2 */}
          <div
            style={{
              width: '34px',
              height: '34px',
              flex: 'none',
              order: 2,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '34px',
                height: '34px',
                left: '0px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '8px',
              }}
            />
            <img
              src="/assets/svg/chat/gift.svg"
              alt="Gift"
              style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                left: '8px',
                top: '8px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Giveaway component */}
      <div
        style={{
          position: 'absolute',
          width: '331px',
          height: '152px',
          left: '10px',
          top: '186px',
          overflow: 'hidden',
        }}
      >
        {/* Main background */}
        <div
          style={{
            position: 'absolute',
            width: '331px',
            height: '152px',
            left: '0px',
            top: '0px',
            background: '#131621',
            border: '1px solid #222738',
            borderRadius: '17px',
          }}
        />

        {/* Blurred image */}
        <div
          style={{
            position: 'absolute',
            width: '49.35px',
            height: '49.35px',
            left: '10px',
            top: '4px',
            background: 'url(/assets/wallet/mm2.png)',
            filter: 'blur(7.88426px)',
            transform: 'rotate(44.66deg)',
          }}
        />

        {/* Sharp image */}
        <div
          style={{
            position: 'absolute',
            width: '49.35px',
            height: '49.35px',
            left: '20.22px',
            top: '14.22px',
            background: 'url(/assets/wallet/mm2.png)',
            backgroundSize: 'cover',
          }}
        />

        {/* Info boxes container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '9px',
            position: 'absolute',
            width: '232px',
            height: '21px',
            left: '17px',
            top: '74px',
          }}
        >
          {/* Username box */}
          <div
            style={{
              width: '68px',
              height: '21px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '68px',
                height: '21px',
                left: '0px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '5px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '45px',
                height: '15px',
                left: '12px',
                top: '4px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '10px',
                lineHeight: '15px',
                color: '#FFFFFF',
              }}
            >
              jakep123
            </span>
          </div>

          {/* Entries box */}
          <div
            style={{
              width: '73px',
              height: '21px',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '73px',
                height: '21px',
                left: '0px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '5px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '53px',
                height: '15px',
                left: '12px',
                top: '4px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '10px',
                lineHeight: '15px',
                color: '#FFFFFF',
              }}
            >
              43 entries
            </span>
          </div>

          {/* Time box */}
          <div
            style={{
              width: '73px',
              height: '21px',
              flex: 'none',
              order: 2,
              flexGrow: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '73px',
                height: '21px',
                left: '0px',
                top: '0px',
                background: '#1E222F',
                borderRadius: '5px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '53px',
                height: '15px',
                left: '12px',
                top: '4px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '10px',
                lineHeight: '15px',
                color: '#FFFFFF',
              }}
            >
              0h:52m:8s
            </span>
          </div>
        </div>

        {/* Blue glow */}
        <div
          style={{
            position: 'absolute',
            width: '213px',
            height: '42px',
            left: '51px',
            top: '149px',
            background: '#0276FF',
            filter: 'blur(54.7px)',
            borderRadius: '70px',
          }}
        />

        {/* Item name */}
        <span
          style={{
            position: 'absolute',
            width: '158px',
            height: '15px',
            left: '81px',
            top: '19px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '21px',
            color: '#FFFFFF',
          }}
        >
          Luger
        </span>

        {/* Price */}
        <div
          style={{
            position: 'absolute',
            width: '158px',
            height: '15px',
            left: '81px',
            top: '41px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <img
            src="/assets/svg/navbar/wallet.svg"
            alt="Wallet"
            style={{
              width: '14px',
              height: '14px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            B$1K
          </span>
        </div>

        {/* Join button */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '33px',
            left: '17px',
            top: '106px',
            background: '#0276FF',
            borderRadius: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <img
            src="/assets/svg/ui/gift.svg"
            alt="Gift"
            style={{
              width: '18px',
              height: '18px',
            }}
          />
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#FFFFFF',
            }}
          >
            Join
          </span>
        </div>

        {/* Icon frame */}
        <div
          style={{
            position: 'absolute',
            width: '52px',
            height: '52px',
            left: '19px',
            top: '11px',
          }}
        >
          {/* Empty frame for gun image */}
        </div>
      </div>

      {/* Chat messages area */}
      <div
        ref={messagesContainerRef}
        className="absolute chat-messages-container"
        style={{
          width: '100%',
          height: 'calc(100vh - min(12vh, 132px) - 34px - 20px - 152px - 16px - 60px)',
          left: '0px',
          top: 'calc(min(12vh, 132px) + 34px + 20px + 152px + 16px)',
          background: '#191D29',
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
      <div
        style={{
          position: 'absolute',
          width: '100%',
          left: '0px',
          bottom: '0px',
          height: '60px',
          background: '#191D29',
        }}
      >
        <ChatInput onMessageChange={setInputMessage} message={inputMessage} onSend={handleSendMessage} />
        <SendButton onSend={handleSendMessage} />
      </div>
    </div>
  );
}
