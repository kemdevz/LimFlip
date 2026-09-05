'use client';

import { useState, useEffect } from 'react';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  time: string;
  isNew: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notifications({ isOpen, onClose }: NotificationsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Deposit Confirmed',
      description: 'Your deposit using $6.57 is registered and awaiting confirmation.',
      time: 'Now',
      isNew: true,
    },
    {
      id: 2,
      title: 'Deposit Confirmed',
      description: 'Your deposit using $6.57 is registered and awaiting confirmation.',
      time: 'Now',
      isNew: true,
    },
    {
      id: 3,
      title: 'Deposit Confirmed',
      description: 'Your deposit using $6.57 is registered and awaiting confirmation.',
      time: 'Now',
      isNew: true,
    },
    {
      id: 4,
      title: 'Deposit Confirmed',
      description: 'Your deposit using $6.57 is registered and awaiting confirmation.',
      time: 'Now',
      isNew: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: '300px',
        height: '380px',
        right: '0',
        top: '50px',
        zIndex: 100,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '380px',
          left: '0px',
          top: '0px',
          background: '#1E222F',
          boxShadow: '0px 4px 9.3px rgba(0, 0, 0, 0.25)',
          borderRadius: '15px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '27px',
            height: '27px',
            left: '10px',
            top: '16px',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5766 25.6187C12.4915 25.2842 12.7793 25 13.1245 25H16.8745C17.2196 25 17.5075 25.2842 17.4223 25.6187C17.147 26.7001 16.1666 27.5 14.9995 27.5C13.8323 27.5 12.8519 26.7001 12.5766 25.6187Z" fill="#414960"/>
            <path d="M16.2554 5H13.7444L12.4548 5.46393C9.48224 6.53324 7.50018 9.35264 7.50018 12.5117V14.1692C7.50018 15.0864 7.06893 15.9502 6.33586 16.5014C3.77664 18.4256 5.1375 22.5 8.3394 22.5H21.6609C24.8628 22.5 26.2236 18.4256 23.6645 16.5014C22.9314 15.9502 22.5002 15.0864 22.5002 14.1693V12.5118C22.5002 9.35269 20.518 6.53325 17.5454 5.464L16.2554 5Z" fill="#414960"/>
            <path d="M13.75 3.75C13.75 3.05964 14.3096 2.5 15 2.5V2.5C15.6904 2.5 16.25 3.05964 16.25 3.75V5H13.75V3.75Z" fill="#414960"/>
          </svg>
        </div>

        <span
          style={{
            position: 'absolute',
            width: '102px',
            height: '24px',
            left: '47px',
            top: '16px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#B0B8CB',
          }}
        >
          Notifications
        </span>

        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            width: '19px',
            height: '20px',
            right: '15px',
            top: '18px',
            cursor: 'pointer',
          }}
        >
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5997 17.5581C18.8546 17.8263 18.9977 18.1902 18.9977 18.5696C18.9977 18.9489 18.8546 19.3128 18.5997 19.581C18.3448 19.8493 17.9992 20 17.6387 20C17.2783 20 16.9326 19.8493 16.6778 19.581L9.5 12.0235L2.31996 19.5787C2.06509 19.8469 1.71943 19.9976 1.359 19.9976C0.99857 19.9976 0.652903 19.8469 0.398042 19.5787C0.14318 19.3104 3.79773e-09 18.9466 0 18.5672C-3.79773e-09 18.1878 0.14318 17.824 0.398042 17.5557L7.57809 10.0006L0.400302 2.4431C0.145441 2.17484 0.00226112 1.81101 0.00226113 1.43163C0.00226113 1.05225 0.145441 0.688415 0.400302 0.420156C0.655164 0.151897 1.00083 0.00118977 1.36126 0.00118977C1.72169 0.00118977 2.06735 0.151897 2.32222 0.420156L9.5 7.97765L16.68 0.418966C16.9349 0.150706 17.2806 -6.32041e-09 17.641 0C18.0014 6.32041e-09 18.3471 0.150706 18.602 0.418966C18.8568 0.687225 19 1.05106 19 1.43044C19 1.80982 18.8568 2.17365 18.602 2.44191L11.4219 10.0006L18.5997 17.5581Z" fill="#414960"/>
          </svg>
        </div>

        <span
          style={{
            position: 'absolute',
            width: '26px',
            height: '18px',
            left: '13px',
            top: '51px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '18px',
            color: '#414960',
          }}
        >
          New
        </span>

        <div
          onClick={handleMarkAllAsRead}
          style={{
            position: 'absolute',
            width: '120px',
            height: '18px',
            left: '170px',
            top: '51px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '18px',
            color: '#C0C6DF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Mark all as read</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10" stroke="#414960" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 2L10 6L6 10" stroke="#414960" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '7px',
            position: 'absolute',
            width: '270px',
            height: '300px',
            left: '14px',
            top: '78px',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#333846 transparent',
          }}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (notification.isNew) {
                  setNotifications(notifications.map(n => 
                    n.id === notification.id ? { ...n, isNew: false } : n
                  ));
                }
              }}
              style={{
                width: '270px',
                height: '68px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '270px',
                  height: '68px',
                  left: '0px',
                  top: '0px',
                  background: '#242836',
                  borderRadius: '9px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '57px',
                  height: '68px',
                  left: '0px',
                  top: '0px',
                  background: '#272B3A',
                  borderRadius: '9px 0px 0px 9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.87742 22C3.53613 22 2.3879 21.4615 1.43274 20.3844C0.477581 19.3073 0 18.0125 0 16.5V5.5C0 3.9875 0.477581 2.69271 1.43274 1.61563C2.3879 0.538542 3.53613 0 4.87742 0H19.5097C20.851 0 21.9992 0.538542 22.9544 1.61563C23.9095 2.69271 24.3871 3.9875 24.3871 5.5V16.5C24.3871 18.0125 23.9095 19.3073 22.9544 20.3844C21.9992 21.4615 20.851 22 19.5097 22H4.87742ZM4.87742 5.5H19.5097C19.9568 5.5 20.3835 5.55729 20.79 5.67188C21.1965 5.78646 21.5826 5.96979 21.9484 6.22187V5.5C21.9484 4.74375 21.7098 4.09658 21.2326 3.5585C20.7555 3.02042 20.1811 2.75092 19.5097 2.75H4.87742C4.20677 2.75 3.63286 3.0195 3.15569 3.5585C2.67852 4.0975 2.43952 4.74467 2.43871 5.5V6.22187C2.80452 5.96979 3.19064 5.78646 3.5971 5.67188C4.00355 5.55729 4.43032 5.5 4.87742 5.5ZM2.62161 9.96875L16.1869 13.6812C16.3698 13.7271 16.5527 13.7271 16.7356 13.6812C16.9185 13.6354 17.0913 13.5437 17.2539 13.4062L21.4911 9.41875C21.2676 9.075 20.9831 8.7945 20.6376 8.57725C20.2921 8.36 19.9161 8.25092 19.5097 8.25H4.87742C4.34903 8.25 3.8869 8.40492 3.49101 8.71475C3.09513 9.02458 2.80533 9.44258 2.62161 9.96875Z" fill="#C77DFF"/>
                </svg>
              </div>
              
              {notification.isNew && (
                <div
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    left: '199px',
                    top: '10px',
                    background: '#C77DFF',
                    borderRadius: '56px',
                  }}
                />
              )}

              <span
                style={{
                  position: 'absolute',
                  width: '36px',
                  height: '13px',
                  left: '209px',
                  top: '8px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '9px',
                  lineHeight: '13px',
                  color: '#586179',
                }}
              >
                {notification.time}
              </span>

              <span
                style={{
                  position: 'absolute',
                  width: '115px',
                  height: '18px',
                  left: '65px',
                  top: '8px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#C0C6DF',
                }}
              >
                {notification.title}
              </span>

              <span
                style={{
                  position: 'absolute',
                  width: '191px',
                  height: '30px',
                  left: '65px',
                  top: '30px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '10px',
                  lineHeight: '15px',
                  color: '#586179',
                }}
              >
                {notification.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
