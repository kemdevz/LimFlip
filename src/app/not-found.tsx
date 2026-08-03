'use client';

import { useState } from 'react';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import SignUpModal from '@/components/auth/SignUpModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';

export default function NotFound() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#12151C]">
      
      <div
        className="absolute inset-0"
        style={{
          width: '2662px',
          height: '1248px',
          left: '-371px',
          top: '-84px',
          backgroundImage: 'url(/assets/images/backgrounds/mainbg.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'luminosity',
        }}
      />

      
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '1652px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '241px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />

      <Subnavbar 
        onTermsClick={() => window.location.href = '/tos'}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
      />
      <Navbar 
        onSignUpClick={() => setIsSignUpModalOpen(true)}
        onLogInClick={() => setIsSignUpModalOpen(true)}
      />
      <Sidebar onGiftClick={() => setIsCreateGiveawayOpen(true)} />

      
      <div
        className="absolute"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0px',
          gap: '17px',
          position: 'absolute',
          width: '642px',
          height: '102px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            width: '642px',
            height: '16px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '25px',
            lineHeight: '16px',
            textAlign: 'center',
            color: '#FFFFFF',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          Error
        </div>
        <div
          style={{
            width: '642px',
            height: '16px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '16px',
            color: '#505A71',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          We can't seem to find page you're looking for. Try going back to the homepage.
        </div>
        <div
          style={{
            width: '151px',
            height: '36px',
            flex: 'none',
            order: 2,
            flexGrow: 0,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '151px',
              height: '36px',
              left: '0px',
              top: '0px',
              background: '#0276FF',
              borderRadius: '15px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '144px',
              height: '14px',
              left: '18px',
              top: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            onClick={() => window.location.href = '/'}
          >
            Goto Home-Page
          </div>
        </div>
      </div>
      
      <Footer />
      
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
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
