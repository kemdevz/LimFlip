'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';

interface SubnavbarProps {
  onTermsClick?: () => void;
  onSupportClick?: () => void;
  onProvablyFairClick?: () => void;
  onFaqClick?: () => void;
  onAffiliatesClick?: () => void;
  onLeaderboardClick?: () => void;
  onPrivacyClick?: () => void;
}

export default function Subnavbar({ onTermsClick, onSupportClick, onProvablyFairClick, onFaqClick, onAffiliatesClick, onLeaderboardClick, onPrivacyClick }: SubnavbarProps) {
  const { onlineCount } = useSocket();
  return (
    <div className="app-subnavbar">
      
      <div
        className="absolute"
        style={{
          width: '431px',
          height: '20px',
          left: '22px',
          top: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '14px',
        }}
      >
        
        <div
          style={{
            width: '135px',
            height: '20px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <img
            src="/assets/svg/subnav/tos.svg"
            alt="Terms"
            style={{
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '15px',
              height: '18px',
            }}
          />
          <span
            onClick={onTermsClick}
            style={{
              position: 'absolute',
              width: '108px',
              height: '20px',
              left: '21px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#313749',
              cursor: 'pointer',
            }}
          >
            Terms of Service
          </span>
        </div>

        
        <div
          style={{
            width: '112px',
            height: '20px',
            flex: 'none',
            order: 1,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <img
            src="/assets/svg/subnav/fairness.svg"
            alt="Fairness"
            style={{
              position: 'absolute',
              left: '0px',
              top: '1px',
              width: '17px',
              height: '18px',
            }}
          />
          <span
            onClick={onProvablyFairClick}
            style={{
              position: 'absolute',
              width: '85px',
              height: '20px',
              left: '25px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#313749',
              cursor: 'pointer',
            }}
          >
            Provably Fair
          </span>
        </div>

        
        <div
          style={{
            width: '111px',
            height: '20px',
            flex: 'none',
            order: 2,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <img
            src="/assets/svg/subnav/privacy.svg"
            alt="Privacy"
            style={{
              position: 'absolute',
              left: '0px',
              top: '1px',
              width: '13px',
              height: '16px',
            }}
          />
          <span
            onClick={onPrivacyClick}
            style={{
              position: 'absolute',
              width: '90px',
              height: '20px',
              left: '20px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#313749',
              cursor: 'pointer',
            }}
          >
            Privacy Policy
          </span>
        </div>

        
        <div
          style={{
            width: '48px',
            height: '20px',
            flex: 'none',
            order: 3,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <img
            src="/assets/svg/subnav/faq.svg"
            alt="FAQ"
            style={{
              position: 'absolute',
              left: '0px',
              top: '2px',
              width: '15px',
              height: '15px',
            }}
          />
          <span
            onClick={onFaqClick}
            style={{
              position: 'absolute',
              width: '26px',
              height: '20px',
              left: '21px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#313749',
              cursor: 'pointer',
            }}
          >
            FAQ
          </span>
        </div>

        
        <div
          style={{
            width: '106px',
            height: '20px',
            flex: 'none',
            order: 4,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <img
            src="/assets/svg/subnav/leaderboard.svg"
            alt="Leaderboard"
            style={{
              position: 'absolute',
              width: '15px',
              height: '15px',
              left: '2px',
              top: '2px',
            }}
          />
          <span
            onClick={onLeaderboardClick}
            style={{
              position: 'absolute',
              width: '85px',
              height: '20px',
              left: '23px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#A855F7',
              cursor: 'pointer',
            }}
          >
            Leaderboard
          </span>
        </div>
      </div>

      
      <div
        className="absolute"
        style={{
          width: '39px',
          height: '13px',
          right: '20px',
          top: '12px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '7px',
        }}
      >
        <img
          src="/assets/svg/subnav/twitter.svg"
          alt="Twitter"
          width={16}
          height={13}
          style={{
            flex: 'none',
            order: 0,
            flexGrow: 0,
          }}
        />
        <img
          src="/assets/svg/subnav/discord.svg"
          alt="Discord"
          width={16}
          height={13}
          style={{
            flex: 'none',
            order: 1,
            flexGrow: 0,
          }}
        />
      </div>
    </div>
  );
}
