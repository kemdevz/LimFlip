'use client';

import { useEffect, useState, useRef } from 'react';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import SignUpModal from '@/components/auth/SignUpModal';
import ProfileModal from '@/components/chat/ProfileModal';
import CoinFlipRow from '@/components/coinflip/CoinFlipRow';
import CoinflipToolbar from '@/components/coinflip/CoinflipToolbar';
import CoinflipViewModal from '@/components/coinflip/CoinflipViewModal';
import CoinflipCreateModal from '@/components/coinflip/CoinflipCreateModal';
import CoinflipJoinModal from '@/components/coinflip/CoinflipJoinModal';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';
import { useSocket } from '@/context/SocketContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';

function LoadingScreen({ isFadingOut }: { isFadingOut: boolean }) {
  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.98) translateY(-20px);
          }
        }
        .logo-animate {
          animation: pulse 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode === document.head) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#131721',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      <div
        className="logo-animate"
        style={{
          position: 'relative',
        }}
      >
        <img
          src="/assets/svg/ui/logo.svg"
          alt="Loading"
          style={{
            width: '300px',
            height: '162px',
          }}
        />
      </div>

      <div
        className="logo-animate"
        style={{
          position: 'absolute',
          width: '276px',
          height: '65px',
          background: 'rgba(2, 118, 255, 0.13)',
          filter: 'blur(45.65px)',
          borderRadius: '66px',
        }}
      />
    </div>
  );
}

function MaintenancePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#131721]">
      
      <div
        className="absolute inset-0"
        style={{
          width: '2022px',
          height: '1205px',
          left: '-13px',
          top: '-84px',
          backgroundImage: 'url(/assets/images/backgrounds/background.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'color-dodge',
        }}
      />

      
      <div
        className="absolute"
        style={{
          width: '459px',
          height: '248px',
          left: 'calc(50% - 229.5px)',
          top: '485px',
        }}
      >
        <img
          src="/assets/svg/ui/logo.svg"
          alt="MM2Stake logo"
          width={459}
          height={248}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      
      <div
        className="absolute font-bold text-center"
        style={{
          width: '464px',
          height: '53px',
          left: 'calc(50% - 219px)',
          top: '650px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '35px',
          lineHeight: '52px',
          color: '#FFFFFF',
        }}
      >
        Down for maintenance...
      </div>

      
      <div
        className="absolute"
        style={{
          width: '54px',
          height: '54px',
          left: 'calc(50% - 88px)',
          bottom: '40px',
        }}
      >
        <svg
          width="54"
          height="54"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      
      <div
        className="absolute"
        style={{
          width: '52px',
          height: '52px',
          left: 'calc(50% + 14px)',
          bottom: '41px',
        }}
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </div>
    </div>
  );
}

function NotFoundPage({ onSignUpClick, onProfileClick }: { onSignUpClick: () => void; onProfileClick?: (username: string, avatarUrl: string) => void }) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isCoinflipViewModalOpen, setIsCoinflipViewModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isCoinflipCreateModalOpen, setIsCoinflipCreateModalOpen] = useState(false);
  const [isCoinflipJoinModalOpen, setIsCoinflipJoinModalOpen] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [newGameIds, setNewGameIds] = useState<Set<string>>(new Set());
  const prevGameIdsRef = useRef<Set<string>>(new Set());
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://api-bash-0ouj.onrender.com/coinflip/active');
        const data = await response.json();
        const newGames = data.games || [];
        
        console.log('Fetched games:', newGames.map((g: any) => ({ 
          id: g._id, 
          creator: g.creator, 
          creatorUsername: g.creator?.username,
          joiner: g.joiner,
          joinerUsername: g.joiner?.username 
        })));
        
        // Sort games by totalValue (high to low)
        const sortedGames = newGames.sort((a: any, b: any) => b.totalValue - a.totalValue);
        
        // Detect new games
        const currentIds = new Set<string>(sortedGames.map((g: any) => g._id as string));
        const prevIds = prevGameIdsRef.current;
        
        const newlyAddedIds = new Set<string>();
        currentIds.forEach((id: string) => {
          if (!prevIds.has(id)) {
            newlyAddedIds.add(id);
          }
        });
        
        setNewGameIds(newlyAddedIds);
        setGames(sortedGames);
        prevGameIdsRef.current = currentIds;
        
        // Clear new game IDs after animation
        setTimeout(() => {
          setNewGameIds(new Set());
        }, 500);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 2000); // Poll every 2 seconds for faster updates
    return () => clearInterval(interval);
  }, []);

  // Socket listener for new coinflip games
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCoinflipCreated = (data: { game: any }) => {
      console.log('New coinflip game created via socket:', data.game);
      setGames((prevGames) => {
        // Check if game already exists to prevent duplicates
        if (prevGames.some((g: any) => g._id === data.game._id)) {
          return prevGames;
        }
        const updatedGames = [data.game, ...prevGames];
        // Sort by totalValue (high to low)
        return updatedGames.sort((a: any, b: any) => b.totalValue - a.totalValue);
      });
      setNewGameIds((prev) => new Set([...prev, data.game._id]));
      
      // Auto open view modal only for the creator
      if (user && (data.game.creator._id === (user as any)._id || data.game.creator === (user as any)._id)) {
        setSelectedGame(data.game);
        setIsCoinflipViewModalOpen(true);
      }
      
      // Clear new game ID after animation
      setTimeout(() => {
        setNewGameIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.game._id);
          return newSet;
        });
      }, 500);
    };

    const handleCoinflipJoined = (data: { game: any }) => {
      console.log('Coinflip game joined via socket:', data.game);
      setGames((prevGames) => {
        // Update the game in the list
        return prevGames.map((game) => 
          game._id === data.game._id ? data.game : game
        );
      });
      
      // Auto open view modal for the joined game
      setSelectedGame(data.game);
      setIsCoinflipViewModalOpen(true);
    };

    const handleCoinflipCompleted = (data: { game: any }) => {
      console.log('Coinflip game completed via socket:', data.game);
      setGames((prevGames) => {
        // Update the game in the list
        return prevGames.map((game) => 
          game._id === data.game._id ? data.game : game
        );
      });
      
      // Update selected game if view modal is open
      if (selectedGame && selectedGame._id === data.game._id) {
        setSelectedGame(data.game);
      }
      
      // Remove completed game after 5 minutes
      setTimeout(() => {
        setGames((prevGames) => {
          return prevGames.filter((game) => game._id !== data.game._id);
        });
      }, 300000); // 5 minutes
    };

    socket.on('coinflip-created', handleCoinflipCreated);
    socket.on('coinflip-joined', handleCoinflipJoined);
    socket.on('coinflip-completed', handleCoinflipCompleted);

    return () => {
      socket.off('coinflip-created', handleCoinflipCreated);
      socket.off('coinflip-joined', handleCoinflipJoined);
      socket.off('coinflip-completed', handleCoinflipCompleted);
    };
  }, [socket, isConnected, selectedGame]);

  const handleLeaderboardClose = () => {
    setIsLeaderboardVisible(false);
  };

  const handleJoinGame = (gameId: string) => {
    const game = games.find(g => g._id === gameId);
    if (game) {
      setSelectedGame(game);
      setIsCoinflipJoinModalOpen(true);
    }
  };

  const handlePlaceBet = async (amount: number, selectedCoin: 'heads' | 'tails') => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('https://api-bash-0ouj.onrender.com/coinflip/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          betAmount: amount,
          selectedCoin,
          isBalanceBased: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create game');
      }

      console.log('Balance-based game created:', data.game);
      // The socket listener will handle adding the game and opening the modal
    } catch (error) {
      console.error('Error placing bet:', error);
      throw error;
    }
  };

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
          backgroundColor: 'rgba(19, 22, 33, 0.3)',
        }}
      />

      <Subnavbar
        onTermsClick={() => window.location.href = '/tos'}
        onLeaderboardClick={() => setIsLeaderboardVisible(!isLeaderboardVisible)}
        onProvablyFairClick={() => setIsValidateFairnessOpen(true)}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
        onFaqClick={() => setIsFaqModalOpen(true)}
      />
      <Navbar
        onSignUpClick={onSignUpClick}
        onLogInClick={onSignUpClick}
        onSellItemsClick={() => setIsMyListingsOpen(true)}
      />
      <Sidebar onProfileClick={onProfileClick} onGiftClick={() => setIsCreateGiveawayOpen(true)} onRulesClick={() => setIsRulesModalOpen(true)} />

      <div className="page-content-area">
      <CoinflipToolbar onBetItemsClick={() => setIsCoinflipCreateModalOpen(true)} onPlaceBetClick={handlePlaceBet} />

      
      {games.map((game, index) => (
        <CoinFlipRow
          key={game._id}
          game={game}
          topOffset={index * 110}
          winner="heads"
          onJoinClick={handleJoinGame}
          onViewClick={() => {
            setSelectedGame(game);
            setIsCoinflipViewModalOpen(true);
          }}
          isNew={newGameIds.has(game._id)}
        />
      ))}
      </div>

      <CoinflipViewModal
        isOpen={isCoinflipViewModalOpen}
        onClose={() => setIsCoinflipViewModalOpen(false)}
        game={selectedGame}
      />
      <CoinflipCreateModal
        isOpen={isCoinflipCreateModalOpen}
        onClose={() => setIsCoinflipCreateModalOpen(false)}
        onGameCreated={(game) => {
          console.log('Game created callback:', game);
          // The socket listener will handle adding the game and opening the modal
        }}
      />
      <CoinflipJoinModal
        isOpen={isCoinflipJoinModalOpen}
        onClose={() => setIsCoinflipJoinModalOpen(false)}
        game={selectedGame}
        onGameJoined={(game) => {
          console.log('Game joined callback:', game);
          // Refresh games to show updated state
        }}
      />

      {isLeaderboardVisible && <Leaderboard onClose={handleLeaderboardClose} />}
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const { isConnected } = useSocket();
  const isMaintenance = process.env.MAINTENANCE === 'true';

  useEffect(() => {
    if (isConnected) {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [isConnected]);

  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
      {isMaintenance ? (
        <MaintenancePage />
      ) : (
        <NotFoundPage 
          onSignUpClick={() => setIsSignUpModalOpen(true)}
          onProfileClick={(username, avatarUrl) => {
            setSelectedUsername(username);
            setSelectedAvatarUrl(avatarUrl);
            setIsProfileModalOpen(true);
          }}
        />
      )}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        username={selectedUsername}
        avatarUrl={selectedAvatarUrl}
      />
    </>
  );
}
