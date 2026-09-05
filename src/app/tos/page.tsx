'use client';

import { useState } from 'react';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import SignUpModal from '@/components/auth/SignUpModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';

export default function TOSPage() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="page-shell bg-[#12151C]">
      
      <div
        className="page-bg"
        style={{
          backgroundImage: 'url(/assets/images/backgrounds/background.png)',
          mixBlendMode: 'luminosity',
          opacity: 0.5,
        }}
      />

      
      <div
        className="absolute"
        style={{
          width: '688px',
          height: '704px',
          left: '241px',
          bottom: '702px',
          background: '#A855F7',
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
        className="page-content-area hide-scrollbar"
        style={{
          overflowY: 'auto',
          paddingBottom: '60px',
        }}
      >
        
        <div
          style={{
            width: 'calc(100% - 32px)',
            maxWidth: '900px',
            margin: '0 auto',
            marginTop: '20px',
            padding: '0 16px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 'clamp(14px, 2vw, 20px)',
            lineHeight: '1.5',
          }}
        >
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Welcome to MM2Stake! This Privacy Policy (the "Policies") govern your privacy of the MM2Stake website and its related services (the "Service"). By accessing or using our Service, you agree to comply with these Policies. Please read them carefully.
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          Last Updated: 9/04/2024
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Information We Collect
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          We may collect the following types of personal information: Account Information: Information you provide when you create an account, such as your name, email address, and password.
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          Usage Data: Information about how you interact with our services, including your IP address, browser type, device information, and location data.
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          Transaction Information: If you make a purchase through our services, we may collect your payment information.
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          Sensitive Personal Data: In certain cases, we may collect sensitive personal data, such as your health information or biometric data, if you voluntarily provide it.
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          Third-Party Data: We may collect information from third-party sources, such as social media platforms, if you allow us to do so.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          How We Use Your Information
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          We may use your personal information for the following purposes: To provide and improve our services. To personalize your experience. To communicate with you. To process transactions. For marketing purposes. For analytics and research. To comply with legal obligations.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Data Usage for Marketing Purposes
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          We may use your information to tailor advertisements to your interests and preferences, display ads to you on other websites based on your previous interactions with our services, and contact you with marketing communications. You have the right to opt out of your marketing communications at any time.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Your Rights
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          You have the right to: Access and correct your personal information. Request the deletion of your personal information. Opt out of your marketing communications. Object to certain processing of your personal information. Request a copy of your personal information in a structured, commonly used, and machine-readable format. Withdraw your consent to data processing.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Data Security
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Children's Privacy
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          MM2Stake is for mature audiences. We do not knowingly collect personal information or allow individuals under the age of 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
        </p>
        <p style={{ marginBottom: '20px', color: '#C77DFF' }}>
          Contact
        </p>
        <p style={{ marginBottom: '20px', color: '#FFFFFF' }}>
          For any inquiries or concerns regarding these Policies, please contact us at https://discord.gg/MM2Stake or by our on-site support system.
        </p>
        </div>
      </div>

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
