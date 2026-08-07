'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProfileModal from '@/components/chat/ProfileModal';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import HistoryTable from './components/HistoryTable';
import LinkingTab from './components/LinkingTab';
import ProfileTab from './components/ProfileTab';
import GameHistoryTab from './components/GameHistoryTab';
import TransactionsTab from './components/TransactionsTab';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';

export default function ProfilePage() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [activeSubTab, setActiveSubTab] = useState('Live Bets');
  const [transactionsSubTab, setTransactionsSubTab] = useState('Deposits');

  const handleProfileClick = (username: string, avatarUrl: string) => {
    setIsProfileModalOpen(true);
  };

  return (
    <div className="page-shell">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
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
      />
      <Navbar
        onSignUpClick={() => {}}
        onLogInClick={() => {}}
        onSellItemsClick={() => setIsMyListingsOpen(true)}
      />
      <Sidebar onProfileClick={handleProfileClick} onGiftClick={() => setIsCreateGiveawayOpen(true)} />

      <div className="page-content-area" style={{ overflow: 'auto' }}>
        <div
          style={{
            minHeight: 'auto',
            backgroundColor: '#131621',
            backgroundImage: 'linear-gradient(rgba(19, 22, 33, 0.5), rgba(19, 22, 33, 0.5)), url(/assets/profile/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: isMobile ? '20px 12px' : '40px 60px',
          }}
        >
          {user ? (
            <>
              <ProfileHeader user={user} isMobile={isMobile} />
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div
                key={activeTab}
                style={{
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                {activeTab === 'Profile' && <ProfileTab />}
                {activeTab === 'Linking' && <LinkingTab />}
                {activeTab === 'Game History' && (
                  <>
                    <GameHistoryTab activeSubTab={activeSubTab} onSubTabChange={setActiveSubTab} />
                    <HistoryTable />
                  </>
                )}
                {activeTab === 'Transactions' && (
                  <>
                    <TransactionsTab activeSubTab={transactionsSubTab} onSubTabChange={setTransactionsSubTab} />
                    <HistoryTable />
                  </>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                backgroundColor: '#191D29',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '40px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#FFFFFF',
                  fontSize: isMobile ? '18px' : '20px',
                  marginBottom: '20px',
                }}
              >
                Please log in to view your profile
              </p>
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        username={user?.username || 'User'}
        avatarUrl="/assets/images/coinflip/item_1side.png"
      />
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
    </div>
  );
}
