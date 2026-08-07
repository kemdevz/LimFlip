'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';

export default function CasesPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  const handleProfileClick = (username: string, avatarUrl: string) => {
    console.log('Profile clicked:', username);
  };

  return (
    <div className="page-shell">
      <div
        className="page-bg page-bg--main"
        style={{
          backgroundImage: 'url(/assets/images/backgrounds/mainbg.png)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(19, 22, 33, 0.3)',
        }}
      />

      <Subnavbar
        onTermsClick={() => window.location.href = '/tos'}
        onLeaderboardClick={() => {}}
        onProvablyFairClick={() => setIsValidateFairnessOpen(true)}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
        onFaqClick={() => setIsFaqModalOpen(true)}
      />
      <Navbar
        onSignUpClick={() => {}}
        onLogInClick={() => {}}
        onCoinflipClick={() => router.push('/')}
        onJackpotClick={() => router.push('/jackpot')}
        onSellItemsClick={() => setIsMyListingsOpen(true)}
      />
      <Sidebar onProfileClick={handleProfileClick} onGiftClick={() => setIsCreateGiveawayOpen(true)} onRulesClick={() => setIsRulesModalOpen(true)} />

      <div className="page-content-area" style={{ overflow: 'auto' }}>
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#131621',
            backgroundImage: 'linear-gradient(rgba(19, 22, 33, 0.5), rgba(19, 22, 33, 0.5)), url(/assets/profile/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: isMobile ? '20px 12px' : '40px 50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#FFFFFF',
            }}
          >
            <h1
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              Coming Soon
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: isMobile ? '16px' : '20px',
                color: '#8B95A3',
              }}
            >
              Cases is currently under development. Check back later!
            </p>
          </div>
        </div>
      </div>
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
      />
      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
      />
      <CreateGiveawayModal
        isOpen={isCreateGiveawayOpen}
        onClose={() => setIsCreateGiveawayOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
    </div>
  );
}
