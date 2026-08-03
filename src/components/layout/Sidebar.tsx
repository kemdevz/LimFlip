'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import { useMobileLayout } from '@/context/MobileLayoutContext';
import { useSocket } from '@/context/SocketContext';
import MessageChat from '../chat/MessageChat';
import ChatInput from '../chat/ChatInput';
import SendButton from '../chat/SendButton';
import Link from 'next/link';
import { Message } from '@/types';

interface SidebarProps {
  onProfileClick?: (username: string, avatarUrl: string) => void;
  onGiftClick?: () => void;
  onRulesClick?: () => void;
}

export default function Sidebar({ onProfileClick, onGiftClick, onRulesClick }: SidebarProps) {
  const { socket, onlineCount } = useSocket();
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useMobileLayout();
  const isMobile = useIsMobile();
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
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 52, seconds: 8 });
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleProfileClick = (username: string, avatarUrl: string) => {
    if (onProfileClick) {
      onProfileClick(username, avatarUrl);
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

  // Countdown timer for giveaway
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer reached 0, reset or stop
          clearInterval(timer);
          return prev;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
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
    if (inputMessage.length > 75) return;

    const newMessage: Message = {
      username: user?.username || 'Anonymous',
      message: inputMessage,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: user?.avatarUrl || '/assets/images/coinflip/item_1side.png',
      isWhale: false,
    };

    socket?.emit('chat-message', newMessage);
    setInputMessage('');
  };
  return (
    <>
      {isMobile && (
        <div
          className={`sidebar-backdrop ${isSidebarOpen ? 'sidebar-backdrop--visible' : ''}`}
          onClick={closeSidebar}
          aria-hidden={!isSidebarOpen}
        />
      )}
      <div className={`sidebar-panel ${isMobile && isSidebarOpen ? 'sidebar-panel--open' : ''}`}>
      
      <div
        className="absolute"
        style={{
          width: isMobile ? '100%' : '352px',
          height: isMobile ? '88px' : '132px',
          left: '0px',
          top: '0px',
          background: '#131621',
          overflow: 'hidden',
        }}
      >
        
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
              alt="MM2Stake logo"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </Link>

        
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

      
      <div
        className="absolute"
        style={{
          width: isMobile ? 'calc(100% - 32px)' : '327px',
          height: '34px',
          left: '16px',
          top: isMobile ? '98px' : '142px',
          background: '#191D29',
        }}
      >
        
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
                animation: 'blink 2s ease-in-out infinite',
              }}
            />
            <style>{`
              @keyframes blink {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.5;
                  transform: scale(0.8);
                }
              }
            `}</style>
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

          
          <div
            onClick={onRulesClick}
            style={{
              width: '34px',
              height: '34px',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              position: 'relative',
              cursor: 'pointer',
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

          
          <div
            onClick={onGiftClick}
            style={{
              width: '34px',
              height: '34px',
              flex: 'none',
              order: 2,
              flexGrow: 0,
              position: 'relative',
              cursor: 'pointer',
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

      
      <div
        style={{
          position: 'absolute',
          width: isMobile ? 'calc(100% - 20px)' : '331px',
          height: '152px',
          left: '10px',
          top: isMobile ? '142px' : '186px',
          overflow: 'hidden',
        }}
      >
        
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
              {countdown.hours}h:{countdown.minutes}m:{countdown.seconds}s
            </span>
          </div>
        </div>

        
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

        
        <div
          style={{
            position: 'absolute',
            width: '52px',
            height: '52px',
            left: '19px',
            top: '11px',
          }}
        >
          
        </div>
      </div>

      
      <div
        ref={messagesContainerRef}
        className="absolute chat-messages-container hide-scrollbar"
        style={{
          width: '100%',
          height: isMobile
            ? 'calc(100dvh - 88px - 34px - 152px - 16px - 60px - 20px)'
            : 'calc(100vh - min(12vh, 132px) - 34px - 20px - 152px - 16px - 60px)',
          left: '0px',
          top: isMobile ? 'calc(88px + 34px + 152px + 16px)' : 'calc(min(12vh, 132px) + 34px + 20px + 152px + 16px)',
          background: '#191D29',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {messages.map((msg, index) => (
            <MessageChat
              key={index}
              username={msg.username}
              message={msg.message}
              time={msg.time}
              avatarUrl={msg.avatarUrl}
              isWhale={msg.isWhale}
              onProfileClick={() => handleProfileClick(msg.username, msg.avatarUrl)}
            />
          ))}
        </div>
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '100%',
          left: '0px',
          bottom: isMobile ? '67px' : '8px',
          height: '60px',
          background: '#191D29',
        }}
      >
        <ChatInput onMessageChange={setInputMessage} message={inputMessage} onSend={handleSendMessage} />
        <SendButton onSend={handleSendMessage} />
      </div>
    </div>
    </>
  );
}
