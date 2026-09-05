'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Jackpot } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/context/SocketContext';

const fetchActiveJackpot = async (): Promise<Jackpot | null> => {
  const response = await fetch('http://localhost:3001/jackpot/active', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load jackpot');
  const data = await response.json();
  return data.jackpot;
};

export default function JackpotPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [jackpot, setJackpot] = useState<Jackpot | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchActiveJackpot()
      .then((activeJackpot) => {
        if (!cancelled) setJackpot(activeJackpot);
      })
      .catch((error) => console.error('Error loading jackpot:', error));
    const clock = window.setInterval(() => setNow(Date.now()), 250);
    return () => {
      cancelled = true;
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const update = ({ jackpot: nextJackpot }: { jackpot: Jackpot }) => setJackpot(nextJackpot);
    const resolve = () => {
      fetchActiveJackpot()
        .then(setJackpot)
        .catch((error) => console.error('Error refreshing resolved jackpot:', error));
    };
    socket.on('jackpot-joined', update);
    socket.on('jackpot-timer-started', update);
    socket.on('jackpot-started', update);
    socket.on('jackpot-completed', resolve);
    socket.on('jackpot-refunded', resolve);
    return () => {
      socket.off('jackpot-joined', update);
      socket.off('jackpot-timer-started', update);
      socket.off('jackpot-started', update);
      socket.off('jackpot-completed', resolve);
      socket.off('jackpot-refunded', resolve);
    };
  }, [socket]);

  const userWager = useMemo(() => jackpot?.entries.reduce((sum, entry) => {
    const entryUserId = typeof entry.userId === 'string' ? entry.userId : entry.userId._id;
    return entryUserId === user?.id ? sum + entry.totalValue : sum;
  }, 0) || 0, [jackpot, user?.id]);
  const userChance = jackpot?.totalValue ? (userWager / jackpot.totalValue) * 100 : 0;
  const timeRemaining = jackpot?.timerEndsAt
    ? Math.max(0, Math.ceil((new Date(jackpot.timerEndsAt).getTime() - now) / 1000))
    : null;

  useEffect(() => {
    if (!jackpot?._id || timeRemaining !== 0 || !['waiting', 'active'].includes(jackpot.status)) return;

    let cancelled = false;
    const syncResolvedRound = async () => {
      try {
        const response = await fetch(`http://localhost:3001/jackpot/${jackpot._id}`, { cache: 'no-store' });
        if (!response.ok) return;
        const data: { jackpot: Jackpot } = await response.json();
        if (cancelled) return;
        if (data.jackpot.status === 'completed' || data.jackpot.status === 'refunded') {
          setJackpot(await fetchActiveJackpot());
        }
      } catch (error) {
        console.error('Error checking expired jackpot:', error);
      }
    };

    syncResolvedRound();
    const poll = window.setInterval(syncResolvedRound, 1000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [jackpot?._id, jackpot?.status, timeRemaining]);

  const handleProfileClick = (username: string) => {
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Jackpot Components */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <JackpotStats
              jackpotValue={jackpot?.totalValue || 0}
              userWager={userWager}
              userChance={userChance}
              timeRemaining={timeRemaining}
            />
            <JackpotContainer entries={jackpot?.entries || []} />
            <JackpotWheel jackpot={jackpot} onJackpotJoined={setJackpot} />
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
