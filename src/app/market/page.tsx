'use client';

import { useState } from 'react';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import SignUpModal from '@/components/auth/SignUpModal';
import MarketplaceContent from '@/components/market/MarketplaceContent';

export default function MarketPage() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <div className="page-shell page-shell--fixed">
      <div
        className="page-bg page-bg--main"
        style={{
          backgroundImage: 'url(/assets/images/backgrounds/mainbg.png)',
        }}
      />
      
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(19, 22, 33, 0.3)',
        }}
      />

      <Subnavbar
        onTermsClick={() => window.location.href = '/tos'}
      />
      <Navbar
        onSignUpClick={() => setIsSignUpModalOpen(true)}
        onLogInClick={() => setIsSignUpModalOpen(true)}
      />
      <Sidebar />

      {/* Marketplace Content */}
      <MarketplaceContent />

      <Footer />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
}
