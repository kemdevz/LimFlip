'use client';

import { useEffect, useRef } from 'react';

interface MessageChatProps {
  username?: string;
  message?: string;
  time?: string;
  avatarUrl?: string;
  isWhale?: boolean;
  onProfileClick?: () => void;
  isNew?: boolean;
}

export default function MessageChat({
  username = 'jakep',
  message = 'i gambled my life savings, and won. thank you bloxybet. now im a whale.',
  time = '15:24',
  avatarUrl,
  isWhale = true,
  onProfileClick,
  isNew = false,
}: MessageChatProps) {
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .message-animate {
          animation: messageSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode === document.head) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  return (
    <div
      className={isNew ? 'message-animate chat-message-bubble' : 'chat-message-bubble'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '10px 14px',
        position: 'relative',
        minHeight: '81px',
        height: 'auto',
        borderRadius: '20px',
      }}
    >
      
      <div
        style={{
          position: 'absolute',
          width: '29px',
          height: '29px',
          left: '-6px',
          top: '-14px',
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '0px',
            bottom: '0px',
            border: '2px solid #464A58',
            borderRadius: '65px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '19px',
            height: '19px',
            left: '5px',
            top: '5px',
            backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            backgroundColor: avatarUrl ? 'transparent' : '#464A58',
            borderRadius: '43px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '239px',
          minHeight: '76px',
          height: 'auto',
          left: '33px',
          top: '-18px',
        }}
      >
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '12px',
            position: 'absolute',
            width: '239px',
            height: '24px',
            left: '-1px',
            top: '5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '5px',
              width: '239px',
              height: '24px',
              flex: 'none',
              order: 0,
              flexGrow: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px',
                gap: '6px',
                width: '69px',
                height: '24px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
              }}
            >
              <span
                onClick={onProfileClick}
                style={{
                  width: '46px',
                  height: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: isWhale ? '#006EFF' : '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                  cursor: onProfileClick ? 'pointer' : 'default',
                }}
              >
                {username}
              </span>
              {isWhale && (
                <img
                  src="/assets/svg/ui/whale.svg"
                  alt="whale"
                  style={{
                    width: '17px',
                    height: '17px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '321px',
            minHeight: '46px',
            height: 'auto',
            left: '-36px',
            top: '36px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '150%',
            color: '#787A8B',
          }}
        >
          {message}
        </div>
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '36px',
          height: '21px',
          left: '282px',
          top: '-12px',
          fontFamily: 'Poppins, sans-serif',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '21px',
          color: '#464A58',
        }}
      >
        {time}
      </div>
    </div>
  );
}
