'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import { useMobileLayout } from '@/context/MobileLayoutContext';
import { useSocket } from '@/context/SocketContext';
import MessageChat from '../chat/MessageChat';
import ChatInput from '../chat/ChatInput';
import SendButton from '../chat/SendButton';
import GiveawayCard from '../giveaway/GiveawayCard';
import { toast } from '../Toast';
import Link from 'next/link';
import { Message } from '@/types';

interface SidebarProps {
  onProfileClick?: (username: string, avatarUrl: string) => void;
  onGiftClick?: () => void;
  onRulesClick?: () => void;
}

interface GiveawayData {
  id: string;
  creator: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  items: Array<{
    itemId: string;
    name: string;
    image: string;
    rarity: string;
    value: number;
    category: string;
  }>;
  totalValue: number;
  duration: number;
  endsAt: string;
  status: string;
  participantCount: number;
}

export default function Sidebar({ onProfileClick, onGiftClick, onRulesClick }: SidebarProps) {
  const { socket, onlineCount } = useSocket();
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useMobileLayout();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [giveaway, setGiveaway] = useState<GiveawayData | undefined>();
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const messageIdCounter = useRef(0);
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

  const handleJoinGiveaway = async () => {
    if (!giveaway || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`http://localhost:3001/giveaway/${giveaway.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state with new participant count
        setGiveaway({
          ...giveaway,
          participantCount: data.participantCount,
        });
        toast.success('Successfully joined giveaway!');
      } else {
        console.error('Failed to join giveaway:', data.error);
        toast.error(data.error || 'Failed to join giveaway');
      }
    } catch (error) {
      console.error('Error joining giveaway:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Fetch messages from API on mount
    fetchMessages();
    // Fetch active giveaway
    fetchGiveaway();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:3001/messages/recent');
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data.map((msg: Message) => ({ ...msg, _uid: messageIdCounter.current++ })));
        // Add all loaded messages to new message IDs for animation
        data.forEach((msg: Message, index: number) => {
          const messageId = `${msg.username}-${msg.message}-${msg.time}-${messageIdCounter.current - data.length + index}`;
          setNewMessageIds(prev => new Set(prev).add(messageId));
          
          // Remove from new messages after animation completes
          setTimeout(() => {
            setNewMessageIds(prev => {
              const next = new Set(prev);
              next.delete(messageId);
              return next;
            });
          }, 400 + (index * 50));
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchGiveaway = async () => {
    try {
      const response = await fetch('http://localhost:3001/giveaway/active');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setGiveaway(data[0]); // Get the most recent active giveaway
      }
    } catch (error) {
      console.error('Error fetching giveaway:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Fetch messages from API on mount
    fetchMessages();
    // Fetch active giveaway
    fetchGiveaway();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMounted]);

  useEffect(() => {
    if (!isMounted || !socket) return;

    socket.on('chat-message', (data: Message) => {
      const uid = messageIdCounter.current++;
      const messageId = `${data.username}-${data.message}-${data.time}-${uid}`;
      setNewMessageIds(prev => new Set(prev).add(messageId));
      setMessages((prev) => [...prev, { ...data, _uid: uid }]);
      
      // Remove from new messages after animation completes
      setTimeout(() => {
        setNewMessageIds(prev => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });
      }, 500);
    });

    socket.on('giveaway-joined', (data: { giveawayId: string; participantCount: number }) => {
      if (giveaway && giveaway.id === data.giveawayId) {
        setGiveaway({
          ...giveaway,
          participantCount: data.participantCount,
        });
      }
    });

    socket.on('giveaway-created', (data: GiveawayData) => {
      setGiveaway(data);
    });

    return () => {
      socket.off('chat-message');
      socket.off('giveaway-joined');
      socket.off('giveaway-created');
    };
  }, [isMounted, socket, giveaway]);

  const handleSendMessage = () => {
    if (!user) return; // Prevent sending if not logged in
    if (!inputMessage.trim()) return;
    if (inputMessage.length > 75) return;

    const token = localStorage.getItem('token');
    if (!token) return; // Prevent sending if no token

    const newMessage: Message = {
      username: user.username,
      message: inputMessage,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: user.avatarUrl || '/assets/images/coinflip/item_1side.png',
      isWhale: false,
    };

    socket?.emit('chat-message', { ...newMessage, token });
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
          width: '100%',
          height: isMobile ? '88px' : 'var(--content-top)',
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
              left: '50%',
              top: isMobile ? '48px' : 'calc((var(--content-top) - 36px) / 2)',
              transform: 'translateX(-50%)',
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
            background: 'rgba(199, 125, 255, 0.12)',
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
            background: 'rgba(199, 125, 255, 0.12)',
            filter: 'blur(25.4292px)',
            borderRadius: '36.7651px',
          }}
        />
      </div>

      
      <div
        className="absolute"
        style={{
          width: 'calc(100% - 32px)',
          height: '34px',
          left: '16px',
          top: isMobile ? '98px' : 'calc(var(--content-top) + 10px)',
          background: '#191D29',
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '34px',
            left: '0px',
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
              position: 'absolute',
              right: '0px',
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
              position: 'absolute',
              left: '0px',
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
              position: 'absolute',
              left: '40px',
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


      {giveaway && (
        <GiveawayCard
          giveaway={giveaway}
          onJoin={handleJoinGiveaway}
        />
      )}


      <div
        ref={messagesContainerRef}
        className="absolute chat-messages-container hide-scrollbar"
        style={{
          width: '100%',
          left: '0px',
          top: isMobile
            ? `calc(88px + 34px + ${giveaway ? '140px' : '0px'} + 16px)`
            : `calc(var(--content-top) + 34px + 20px + ${giveaway ? '152px' : '0px'} + 16px)`,
          bottom: isMobile ? '127px' : '68px',
          background: '#191D29',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {messages.map((msg, index) => {
            const messageId = `${msg.username}-${msg.message}-${msg.time}-${msg._uid ?? index}`;
            const isNew = newMessageIds.has(messageId);
            return (
              <MessageChat
                key={messageId}
                username={msg.username}
                message={msg.message}
                time={msg.time}
                avatarUrl={msg.avatarUrl}
                isWhale={msg.isWhale}
                role={msg.role}
                isNew={isNew}
                onProfileClick={() => handleProfileClick(msg.username, msg.avatarUrl)}
              />
            );
          })}
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
