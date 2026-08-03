'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import JackpotStats from './components/JackpotStats';
import JackpotContainer from './components/JackpotContainer';
import JackpotWheel from './components/JackpotWheel';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';
import { User } from '@/types';

export default function JackpotPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<User | null>(null);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        onJackpotClick={() => {}}
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
          }}
        >
          <JackpotStats />
          <JackpotContainer />
          <JackpotWheel />
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
