'use client';

import { useState } from 'react';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import SignUpModal from '@/components/auth/SignUpModal';
import MarketplaceContent from '@/components/market/MarketplaceContent';
import MyListingsModal from '@/components/market/MyListingsModal';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';

export default function MarketPage() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  return (
    <div className="page-shell page-shell--fixed">
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
        onProvablyFairClick={() => setIsValidateFairnessOpen(true)}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
        onFaqClick={() => setIsFaqModalOpen(true)}
      />
      <Navbar
        onSignUpClick={() => setIsSignUpModalOpen(true)}
        onLogInClick={() => setIsSignUpModalOpen(true)}
        onSellItemsClick={() => setIsMyListingsOpen(true)}
      />
      <Sidebar onGiftClick={() => setIsCreateGiveawayOpen(true)} onRulesClick={() => setIsRulesModalOpen(true)} />


      <MarketplaceContent onMyListingsClick={() => setIsMyListingsOpen(true)} />

      <Footer />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
      />
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
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
