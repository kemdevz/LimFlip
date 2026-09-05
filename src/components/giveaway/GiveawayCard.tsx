'use client';

import React, { useState, useEffect } from 'react';

interface GiveawayItem {
  itemId: string;
  name: string;
  image: string;
  rarity: string;
  value: number;
  category: string;
}

interface GiveawayCreator {
  id: string;
  username: string;
  avatarUrl: string;
}

interface GiveawayData {
  id: string;
  creator: GiveawayCreator;
  items: GiveawayItem[];
  totalValue: number;
  duration: number;
  endsAt: string;
  status: string;
  participantCount: number;
}

interface GiveawayCardProps {
  giveaway?: GiveawayData;
  onJoin?: () => void;
}

export default function GiveawayCard({ giveaway, onJoin }: GiveawayCardProps) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate countdown from endsAt
  useEffect(() => {
    if (!giveaway?.endsAt) return;

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const endsAt = new Date(giveaway.endsAt).getTime();
      const difference = endsAt - now;

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setCountdown(calculateCountdown());

    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [giveaway?.endsAt]);

  // Use giveaway data if available, otherwise use fallback
  const username = giveaway?.creator?.username || 'jakep123';
  const entries = giveaway ? `${giveaway.participantCount} entries` : '43 entries';
  const itemName = giveaway?.items?.[0]?.name || 'Luger';
  const itemValue = giveaway?.totalValue ? `B$${giveaway.totalValue.toLocaleString()}` : 'B$1,000';
  const itemImage = giveaway?.items?.[0]?.image || '/assets/wallet/mm2.png';

  return (
    <div
      style={{
        position: 'absolute',
        width: isMobile ? 'calc(100% - 20px)' : '331px',
        height: isMobile ? '140px' : '152px',
        left: isMobile ? '10px' : '10px',
        top: isMobile ? '0px' : 'calc(var(--content-top) + 54px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '100%' : '331px',
          height: isMobile ? '140px' : '152px',
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
          backgroundImage: `url(${itemImage})`,
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
          backgroundImage: `url(${itemImage})`,
          backgroundSize: 'cover',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: isMobile ? '6px' : '9px',
          position: 'absolute',
          width: isMobile ? 'calc(100% - 34px)' : '232px',
          height: '21px',
          left: isMobile ? '17px' : '17px',
          top: isMobile ? '65px' : '74px',
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
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {username}
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
            {entries}
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
          background: '#C77DFF',
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
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {itemName}
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
          {itemValue}
        </span>
      </div>

      <div
        onClick={onJoin}
        style={{
          position: 'absolute',
          width: isMobile ? 'calc(100% - 34px)' : '300px',
          height: isMobile ? '30px' : '33px',
          left: isMobile ? '17px' : '17px',
          top: isMobile ? '95px' : '106px',
          background: '#C77DFF',
          borderRadius: '11px',
          cursor: giveaway ? 'pointer' : 'default',
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
      />
    </div>
  );
}
