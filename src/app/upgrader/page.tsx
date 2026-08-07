'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';
import { User } from '@/types';

interface LiveWin {
  username: string;
  avatar: string;
  inputItems: string[];
  outputItems: string[];
  inputValue: number;
  outputValue: number;
  multiplier: number;
}

interface Item {
  name: string;
  price: number;
  img: string;
  uniqueId?: string;
  itemId?: string;
}

export default function UpgraderPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [selectedInputItems, setSelectedInputItems] = useState<Item[]>([]);
  const [selectedDesiredItem, setSelectedDesiredItem] = useState<Item | null>(null);
  const [userInventory, setUserInventory] = useState<Item[]>([]);
  const [stockInventory, setStockInventory] = useState<Item[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<'won' | 'lost' | null>(null);
  const [liveWins, setLiveWins] = useState<LiveWin[]>([]);
  const STOCK_USER_ID = '7848923878';

  // Fetch inventories on mount
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        console.log('User object:', user);
        console.log('User id:', user?.id);

        // Fetch user inventory using the actual user's id
        if (user?.id) {
          console.log('Fetching user inventory for:', user.id);
          const userResponse = await fetch(`https://api-bash.onrender.com/inventory/${user.id}`);
          const userData = await userResponse.json();
          console.log('User inventory response:', userData);
          if (userData.items) {
            setUserInventory(userData.items.map((item: any) => ({
              name: item.name,
              price: item.value,
              img: item.image,
              uniqueId: item.uniqueId,
              itemId: item.itemId
            })));
          }
        } else {
          console.log('No user ID available, skipping user inventory fetch');
        }

        // Fetch stock inventory
        console.log('Fetching stock inventory for:', STOCK_USER_ID);
        const stockResponse = await fetch(`https://api-bash.onrender.com/upgrader/stock/${STOCK_USER_ID}`);
        const stockData = await stockResponse.json();
        console.log('Stock inventory response:', stockData);
        if (stockData.items) {
          setStockInventory(stockData.items.map((item: any) => ({
            name: item.name,
            price: item.value,
            img: item.image,
            uniqueId: item.uniqueId,
            itemId: item.itemId
          })));
        }
      } catch (error) {
        console.error('Error fetching inventories:', error);
      }
    };

    fetchInventories();
  }, [user?.id, STOCK_USER_ID]);

  const handleUpgrade = async () => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    if (!selectedInputItems.length) {
      console.log('No input items selected');
      return;
    }

    if (!selectedDesiredItem) {
      console.log('No desired item selected');
      return;
    }

    setIsUpgrading(true);
    setIsSpinning(true);
    setUpgradeResult(null);

    // Calculate win percentage
    const inputValue = selectedInputItems.reduce((sum, item) => sum + item.price, 0);
    const desiredValue = selectedDesiredItem.price;
    const winPercentage = (inputValue / desiredValue) * 100;

    try {
      const response = await fetch('https://api-bash.onrender.com/upgrader/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          stockRobloxUserId: STOCK_USER_ID,
          inputItemIds: selectedInputItems.map(item => item.uniqueId),
          desiredItemId: selectedDesiredItem.uniqueId,
        }),
      });

      const result = await response.json();

      console.log('Upgrade result:', result);

      if (result.success) {
        // Calculate win percentage for landing position
        const inputValue = selectedInputItems.reduce((sum, item) => sum + item.price, 0);
        const desiredValue = selectedDesiredItem.price;
        const winPercentage = (inputValue / desiredValue) * 100;
        const winDegrees = winPercentage * 3.6;

        // Calculate landing position based on result
        let targetDegrees;
        if (result.won) {
          // Land in the blue stroke area (0 to winDegrees)
          targetDegrees = Math.random() * winDegrees;
        } else {
          // Land in the transparent area (winDegrees to 360)
          targetDegrees = winDegrees + Math.random() * (360 - winDegrees);
        }

        // Spin the wheel to land on target
        const spinDegrees = 360 * 5 + (360 - targetDegrees); // 5 full rotations + land on target
        setWheelRotation(spinDegrees);

        // Wait for spin to complete
        setTimeout(async () => {
          setIsSpinning(false);
          setUpgradeResult(result.won ? 'won' : 'lost');

          // Refresh inventories after upgrade
          if (user.id) {
            const userResponse = await fetch(`https://api-bash.onrender.com/inventory/${user.id}`);
            const userData = await userResponse.json();
            if (userData.items) {
              setUserInventory(userData.items.map((item: any) => ({
                name: item.name,
                price: item.value,
                img: item.image,
                uniqueId: item.uniqueId,
                itemId: item.itemId
              })));
            }
          }

          const stockResponse = await fetch(`https://api-bash.onrender.com/upgrader/stock/${STOCK_USER_ID}`);
          const stockData = await stockResponse.json();
          if (stockData.items) {
            setStockInventory(stockData.items.map((item: any) => ({
              name: item.name,
              price: item.value,
              img: item.image,
              uniqueId: item.uniqueId,
              itemId: item.itemId
            })));
          }

          // Clear selections
          setSelectedInputItems([]);
          setSelectedDesiredItem(null);
          setWheelRotation(0);
        }, 3000); // 3 seconds spin duration
      }
    } catch (error) {
      console.error('Error processing upgrade:', error);
      setIsSpinning(false);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Fetch upgrader history on mount
  useEffect(() => {
    const fetchUpgraderHistory = async () => {
      try {
        const response = await fetch('https://api-bash.onrender.com/upgrader/history?limit=10');
        const history = await response.json();
        
        const formattedWins: LiveWin[] = history.map((entry: any) => ({
          username: entry.username,
          avatar: entry.avatar || '',
          inputItems: entry.inputItems.map((item: any) => item.image),
          outputItems: entry.outputItem ? [entry.outputItem.image] : [],
          inputValue: entry.inputValue,
          outputValue: entry.outputValue,
          multiplier: entry.multiplier,
        }));
        
        setLiveWins(formattedWins);
      } catch (error) {
        console.error('Error fetching upgrader history:', error);
        // Set fallback data if fetch fails
        setLiveWins([
          {
            username: 'rockstarbandd',
            avatar: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-97E3EA23B1E47B79D17C79BBE87972BF-Png/420/420/AvatarHeadshot/Png/noFilter',
            inputItems: ['https://tr.rbxcdn.com/180DAY-0f7ffd8e0c2de137e8a0d4dfd0cda775/420/420/Model/Png/noFilter'],
            outputItems: ['https://tr.rbxcdn.com/180DAY-ab2df954762bba83028c1903451bdaf9/420/420/Model/Png/noFilter', 'https://tr.rbxcdn.com/180DAY-ab2df954762bba83028c1903451bdaf9/420/420/Model/Png/noFilter', 'https://tr.rbxcdn.com/180DAY-ab2df954762bba83028c1903451bdaf9/420/420/Model/Png/noFilter', 'https://tr.rbxcdn.com/180DAY-dd607b48a625a65ed26acbe31753e3ec/420/420/Model/Png/noFilter'],
            inputValue: 23,
            outputValue: 28,
            multiplier: 1.22,
          },
        ]);
      }
    };
    
    fetchUpgraderHistory();
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
          pointerEvents: 'none',
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

      <div className="page-content-area" style={{ overflow: 'auto', pointerEvents: 'auto' }}>
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
          {/* Live Wins Section */}
          <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.3s ease-out' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div style={{ position: 'relative', width: '16px', height: '16px' }}>
                <div
                  style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4363',
                    opacity: 0.5,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </div>
              <svg width="20" height="20" viewBox="0 0 576 512" fill="currentColor" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <path d="M80.3 44C69.8 69.9 64 98.2 64 128s5.8 58.1 16.3 84c6.6 16.4-1.3 35-17.7 41.7s-35-1.3-41.7-17.7C7.4 202.6 0 166.1 0 128S7.4 53.4 20.9 20C27.6 3.6 46.2-4.3 62.6 2.3S86.9 27.6 80.3 44zM555.1 20C568.6 53.4 576 89.9 576 128s-7.4 74.6-20.9 108c-6.6 16.4-25.3 24.3-41.7 17.7S489.1 228.4 495.7 212c10.5-25.9 16.3-54.2 16.3-84s-5.8-58.1-16.3-84C489.1 27.6 497 9 513.4 2.3s35 1.3 41.7 17.7zM352 128c0 23.7-12.9 44.4-32 55.4V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V183.4c-19.1-11.1-32-31.7-32-55.4c0-35.3 28.7-64 64-64s64 28.7 64 64zM170.6 76.8C163.8 92.4 160 109.7 160 128s3.8 35.6 10.6 51.2c7.1 16.2-.3 35.1-16.5 42.1s-35.1-.3-42.1-16.5c-10.3-23.6-16-49.6-16-76.8s5.7-53.2 16-76.8c7.1-16.2 25.9-23.6 42.1-16.5s23.6 25.9 16.5 42.1zM464 51.2c10.3 23.6 16 49.6 16 76.8s-5.7 53.2-16 76.8c-7.1 16.2-25.9 23.6-42.1 16.5s-23.6-25.9-16.5-42.1c6.8-15.6 10.6-32.9 10.6-51.2s-3.8-35.6-10.6-51.2c-7.1-16.2 .3-35.1 16.5-42.1s35.1 .3 42.1 16.5z"/>
              </svg>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                LIVE WINS
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px',
              }}
            >
              {liveWins.map((win, index) => (
                <div
                  key={index}
                  style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderRadius: '12px',
                    border: '1px solid #2A3040',
                    backgroundColor: '#191d29',
                    padding: '16px',
                    minWidth: '280px',
                  }}
                >
                  {/* Value display */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <img src="/assets/svg/home/wallet.svg" alt="" width={16} height={14} />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                        {win.inputValue}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(2, 118, 255, 0.2)',
                        padding: '4px 8px',
                      }}
                    >
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>+</span>
                      <img src="/assets/svg/home/wallet.svg" alt="" width={16} height={14} />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                        {win.outputValue - win.inputValue}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <img src="/assets/svg/home/wallet.svg" alt="" width={16} height={14} />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                        {win.outputValue}
                      </span>
                    </div>
                  </div>

                  {/* Items display */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    {/* Input items */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-16px' }}>
                      {win.inputItems.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #1E222F',
                            backgroundColor: '#131621',
                            marginLeft: i > 0 ? '-12px' : '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <img src={item} alt="" width={32} height={32} style={{ objectFit: 'cover' }} />
                        </div>
                      ))}
                      {/* Empty slots */}
                      {[...Array(4 - win.inputItems.length)].map((_, i) => (
                        <div
                          key={`empty-in-${i}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #1E222F',
                            backgroundColor: '#131621',
                            marginLeft: '-12px',
                          }}
                        />
                      ))}
                    </div>

                    {/* Arrow */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>

                    {/* Output items */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '-16px' }}>
                      {win.outputItems.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #1E222F',
                            backgroundColor: '#131621',
                            marginLeft: i > 0 ? '-12px' : '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <img src={item} alt="" width={32} height={32} style={{ objectFit: 'cover' }} />
                        </div>
                      ))}
                      {/* Empty slots */}
                      {[...Array(4 - win.outputItems.length)].map((_, i) => (
                        <div
                          key={`empty-out-${i}`}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #1E222F',
                            backgroundColor: '#131621',
                            marginLeft: '-12px',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* User info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={win.avatar}
                        alt=""
                        width={16}
                        height={16}
                        style={{ borderRadius: '50%' }}
                      />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>
                        {win.username}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                        {win.multiplier.toFixed(2)}
                      </span>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>
                        x
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Upgrader Interface */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {!isMobile && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderRadius: '12px',
                  border: '1px solid #2A3040',
                  backgroundColor: '#191d29',
                  padding: '24px',
                  animation: 'fadeInUp 0.3s ease-out 0.1s both',
                  position: 'relative',
                  pointerEvents: 'auto',
                }}
              >
                {/* Wheel Section */}
                <div style={{ display: 'grid', placeItems: 'center', marginBottom: '0', position: 'relative', height: '400px', overflow: 'visible' }}>
                  <div
                    style={{
                      position: 'absolute',
                      aspectRatio: '1',
                      width: '24.75%',
                      transition: 'opacity 0.3s',
                      opacity: 0,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Success State */}
                    <div
                      style={{
                        position: 'absolute',
                        zIndex: 10,
                        display: 'grid',
                        aspectRatio: '1',
                        width: 'calc(100% - 10px)',
                        transform: 'translateX(5px) translateY(5px)',
                        placeItems: 'center',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        backgroundColor: '#131621',
                      }}
                    >
                      <div
                        style={{
                          pointerEvents: 'none',
                          gridColumn: '1 / -1',
                          gridRow: '1 / -1',
                          padding: '10%',
                          opacity: 0.5,
                          aspectRatio: '1',
                          width: '65%',
                        }}
                      >
                        <svg width="54" height="43" viewBox="0 0 54 43" fill="#0df896" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                          <path d="M7.83907 17.638L2.00475 23.4723L13.3502 34.8178L19.1839 40.6528H19.1852L25.0196 34.8185L51.6666 8.1701L45.8322 2.33578L19.1845 28.9835L7.83907 17.638ZM45.8322 0.921565L53.0808 8.1701L26.4331 34.8178L19.1852 42.067H19.1839L11.9353 34.8185L0.590534 23.4723L7.83907 16.2238L19.1845 27.5693L45.8322 0.921565Z"></path>
                        </svg>
                      </div>
                      <div
                        style={{
                          zIndex: 50,
                          display: 'flex',
                          width: '100%',
                          minWidth: 0,
                          maxWidth: '100%',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gridArea: '1 / 1 / -1 / -1',
                        }}
                      >
                        <div style={{ position: 'relative', width: '80%' }}>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', marginLeft: '-16px' }}></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '18px', fontWeight: 600, color: '#0276FF' }}>
                          <span style={{ marginRight: '4px' }}>+</span>
                          <img src="/assets/svg/home/wallet.svg" width={16} height={14} />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        zIndex: 0,
                        height: '100%',
                        width: '100%',
                        borderRadius: '50%',
                        backgroundColor: '#0276FF',
                        filter: 'blur(16px)',
                        gridArea: '1 / 1 / -1 / -1',
                      }}
                    />
                  </div>

                  {/* Fail State */}
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      width: '24.75%',
                      transition: 'opacity 0.3s',
                      opacity: 0,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        zIndex: 40,
                        display: 'grid',
                        aspectRatio: '1',
                        width: 'calc(100% - 10px)',
                        transform: 'translateX(5px) translateY(5px)',
                        placeItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#131621',
                      }}
                    >
                      <div
                        style={{
                          zIndex: 50,
                          gridColumn: '1 / -1',
                          gridRow: '1 / -1',
                          display: 'flex',
                          width: '100%',
                          minWidth: 0,
                          maxWidth: '100%',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ position: 'relative', width: '80%' }}>
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', marginLeft: '-16px' }}></div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '18px', fontWeight: 600, color: '#ef4363' }}>
                          <span style={{ marginRight: '4px' }}>-</span>
                          <img src="/assets/svg/home/wallet.svg" width={16} height={14} style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(37%) saturate(4348%) hue-rotate(326deg) brightness(98%) contrast(91%)' }} />
                          <span>0</span>
                        </div>
                      </div>
                      <div
                        style={{
                          pointerEvents: 'none',
                          gridColumn: '1 / -1',
                          gridRow: '1 / -1',
                          padding: '10%',
                          opacity: 0.5,
                          aspectRatio: '1',
                          width: '65%',
                        }}
                      >
                        <svg width="45" height="45" viewBox="0 0 45 45" fill="#ef4363" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                          <path d="M44.1221 9.57727L30.877 22.8214L44.1221 36.0665L35.4482 44.7404L22.2031 31.4952L8.95898 44.7404L0.285156 36.0665L13.5293 22.8214L0.285156 9.57727L8.95898 0.903442L22.2031 14.1476L35.4473 0.903442L44.1221 9.57727ZM22.2031 15.5616L8.95898 2.3175L1.69922 9.57727L14.9434 22.8214L1.69824 36.0656L8.95801 43.3253L22.2031 30.0812L35.4482 43.3263L42.708 36.0665L29.4629 22.8214L42.707 9.57727L35.4473 2.31653L22.2031 15.5616Z"></path>
                        </svg>
                      </div>
                    </div>
                    <div
                      style={{
                        zIndex: 0,
                        gridColumn: '1 / -1',
                        gridRow: '1 / -1',
                        height: '100%',
                        width: '100%',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 67, 99, 0.5)',
                        filter: 'blur(16px)',
                      }}
                    />
                  </div>

                  {/* Main Wheel */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 20,
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      aspectRatio: '1',
                      width: '24.75%',
                    }}
                  >
                    {/* Static stroke showing win percentage */}
                    {selectedDesiredItem && selectedInputItems.length > 0 && (
                      <svg
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                          aspectRatio: '1',
                          width: '100%',
                          transform: `rotate(${wheelRotation}deg)`,
                          transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                        }}
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#0276FF"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(selectedInputItems.reduce((sum, item) => sum + item.price, 0) / selectedDesiredItem.price) * 283} 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        zIndex: 20,
                        display: 'grid',
                        aspectRatio: '1',
                        width: 'calc(100% - 20px)',
                        transform: 'translateX(10px) translateY(10px)',
                        placeItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#131621',
                      }}
                    >
                      <div
                        style={{
                          pointerEvents: 'none',
                          zIndex: 50,
                          gridColumn: '1 / -1',
                          gridRow: '1 / -1',
                          display: 'flex',
                          height: '100%',
                          width: '100%',
                          justifyContent: 'center',
                          transform: 'rotate(0deg) scale(1.1)',
                        }}
                      >
                        <span style={{ height: 'fit-content', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '16px solid #0276FF' }}></span>
                      </div>
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          padding: '20%',
                          gridArea: '1 / 1 / -1 / -1',
                        }}
                      >
                        <img src="/assets/svg/ui/logo.svg" alt="" style={{ aspectRatio: '1', width: '100%', opacity: 0.05 }} />
                      </div>
                      <div style={{ textAlign: 'center', gridArea: '1 / 1 / -1 / -1' }}>
                        <span style={{ fontSize: '24px', fontWeight: 500 }}></span>
                        <span style={{ display: 'block', fontSize: '48px', fontWeight: 600, color: '#FFFFFF' }}>
                          {selectedDesiredItem && selectedInputItems.length > 0
                            ? ((selectedInputItems.reduce((sum, item) => sum + item.price, 0) / selectedDesiredItem.price) * 100).toFixed(2) + '%'
                            : '0.00%'}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>Chance of receiving selected items</span>
                      </div>
                    </div>
                  </div>

                  {/* Side Panels */}
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'grid', width: '43%' }}>
                      {selectedInputItems.length > 0 && (
                        <>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '3%' }}>
                            <span style={{ display: 'block', fontSize: '20px', fontWeight: 600 }}>
                              {selectedInputItems.length === 1 ? selectedInputItems[0].name : `${selectedInputItems.length} items`}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#0276FF' }}>
                              <img src="/assets/svg/home/wallet.svg" width={16} height={14} />
                              <span style={{ fontWeight: 600 }}>{selectedInputItems.reduce((sum, item) => sum + item.price, 0)}</span>
                            </span>
                          </div>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedInputItems.length === 1 ? (
                              <img src={selectedInputItems[0].img} width={64} height={64} style={{ aspectRatio: '1', width: '20%' }} />
                            ) : (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {selectedInputItems.slice(0, 3).map((item, index) => (
                                  <img key={index} src={item.img} width={48} height={48} style={{ aspectRatio: '1', width: '15%' }} />
                                ))}
                                {selectedInputItems.length > 3 && (
                                  <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>+{selectedInputItems.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, filter: 'blur(4px)' }}>
                            {selectedInputItems.length === 1 && (
                              <img src={selectedInputItems[0].img} width={80} height={80} style={{ aspectRatio: '1', width: '25%' }} />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ display: 'grid', width: '43%' }}>
                      {selectedDesiredItem && (
                        <>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '3%' }}>
                            <span style={{ display: 'block', fontSize: '20px', fontWeight: 600 }}>{selectedDesiredItem.name}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#0276FF' }}>
                              <img src="/assets/svg/home/wallet.svg" width={16} height={14} />
                              <span style={{ fontWeight: 600 }}>{selectedDesiredItem.price}</span>
                            </span>
                          </div>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={selectedDesiredItem.img} width={64} height={64} style={{ aspectRatio: '1', width: '20%' }} />
                          </div>
                          <div style={{ zIndex: 20, gridColumn: '1 / -1', gridRow: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, filter: 'blur(4px)' }}>
                            <img src={selectedDesiredItem.img} width={80} height={80} style={{ aspectRatio: '1', width: '25%' }} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Win Text Overlay */}
                  <div
                    style={{
                      pointerEvents: 'none',
                      zIndex: 30,
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: upgradeResult === 'won' ? 1 : 0,
                      transition: 'opacity 0.5s',
                    }}
                  >
                    <svg width="368" height="62" viewBox="0 0 220 37" fill="#0df896" xmlns="http://www.w3.org/2000/svg" style={{ height: '15%', width: '40%' }}>
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#0df896" fontSize="28" fontWeight="bold" fontFamily="Poppins">SUCCESS</text>
                    </svg>
                  </div>

                  {/* Fail Text Overlay */}
                  <div
                    style={{
                      pointerEvents: 'none',
                      zIndex: 30,
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: upgradeResult === 'lost' ? 1 : 0,
                      transition: 'opacity 0.5s',
                    }}
                  >
                    <svg width="284" height="62" viewBox="0 0 284 62" fill="#ef4363" xmlns="http://www.w3.org/2000/svg" style={{ height: '15%', width: '40%' }}>
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#ef4363" fontSize="28" fontWeight="bold" fontFamily="Poppins">FAIL</text>
                    </svg>
                  </div>

                  {/* Side Panel Backgrounds */}
                  <div
                    style={{
                      pointerEvents: 'none',
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'space-between',
                      filter: 'blur(16px)',
                      transition: 'opacity 0.3s',
                      opacity: 1,
                    }}
                  >
                    <svg width="626" height="365" viewBox="0 0 626 365" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ aspectRatio: '1.7', height: '100%', width: '43%' }}>
                      <path d="M0.291016 20.3212C0.291016 8.77285 10.0439 -0.375694 21.5686 0.362035L625.169 39V327L21.5368 364.674C10.0235 365.393 0.291016 356.249 0.291016 344.713V20.3212Z"></path>
                    </svg>
                    <svg width="626" height="365" viewBox="0 0 626 365" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ aspectRatio: '1.7', height: '100%', width: '43%' }}>
                      <path d="M625.709 20.3212C625.709 8.77285 615.956 -0.375694 604.431 0.362035L0.831421 39V327L604.463 364.674C615.976 365.393 625.709 356.249 625.709 344.713V20.3212Z"></path>
                    </svg>
                  </div>

                  {/* Side Panel Fills */}
                  <div
                    style={{
                      pointerEvents: 'none',
                      zIndex: 10,
                      gridColumn: '1 / -1',
                      gridRow: '1 / -1',
                      display: 'flex',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'space-between',
                      opacity: 1,
                    }}
                  >
                    <svg width="626" height="365" viewBox="0 0 626 365" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ aspectRatio: '1.7', height: '100%', width: '43%' }}>
                      <path d="M0.291016 20.3212C0.291016 8.77285 10.0439 -0.375694 21.5686 0.362035L625.169 39V327L21.5368 364.674C10.0235 365.393 0.291016 356.249 0.291016 344.713V20.3212Z" fill="#171921"></path>
                    </svg>
                    <svg width="626" height="365" viewBox="0 0 626 365" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ aspectRatio: '1.7', height: '100%', width: '43%' }}>
                      <path d="M625.709 20.3212C625.709 8.77285 615.956 -0.375694 604.431 0.362035L0.831421 39V327L604.463 364.674C615.976 365.393 625.709 356.249 625.709 344.713V20.3212Z" fill="#171921"></path>
                    </svg>
                  </div>
                </div>

                {/* Multiplier Display */}
                <div style={{ textAlign: 'center', marginBottom: '0', marginTop: '20px' }}>
                  <span>Multiplier: </span>
                  <span style={{ fontWeight: 600, color: '#0276FF' }}>
                    {selectedDesiredItem && selectedInputItems.length > 0
                      ? (selectedDesiredItem.price / selectedInputItems.reduce((sum, item) => sum + item.price, 0)).toFixed(2)
                      : '0.00'}
                  </span>
                  <span>x</span>
                </div>

                {/* Bottom Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1000, pointerEvents: 'auto' }}>
                  <div style={{ pointerEvents: 'auto' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>Selected Total</div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#0276FF' }}>
                      <img src="/assets/svg/home/wallet.svg" width={16} height={14} />
                      <span style={{ fontWeight: 600 }}>{selectedInputItems.reduce((sum, item) => sum + item.price, 0)}</span>
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked!');
                      handleUpgrade();
                    }}
                    disabled={isUpgrading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      borderRadius: '8px',
                      backgroundColor: isUpgrading ? '#2A3040' : '#0276FF',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      height: 'unset',
                      width: '240px',
                      fontSize: '18px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: isUpgrading ? 'not-allowed' : 'pointer',
                      fontFamily: 'Poppins',
                      opacity: isUpgrading ? 0.5 : 1,
                      position: 'relative',
                      zIndex: 10000,
                      pointerEvents: 'auto',
                    }}
                  >
                    {isUpgrading ? 'Upgrading...' : 'Upgrade'}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', pointerEvents: 'auto' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>Desired Total</div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#0276FF' }}>
                      <img src="/assets/svg/home/wallet.svg" width={16} height={14} />
                      <span style={{ fontWeight: 600 }}>{selectedDesiredItem ? selectedDesiredItem.price : 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Selection Panels */}
            {!isMobile && (
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  borderRadius: '12px',
                  border: '1px solid #2A3040',
                  backgroundColor: '#191d29',
                  padding: '16px',
                  animation: 'fadeInUp 0.3s ease-out 0.2s both',
                }}
              >
                {/* Left Panel - Input Selection */}
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Select Item
                    </label>
                    <input
                      type="text"
                      placeholder="Search for an item.."
                      style={{
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>High - Low</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Murder Mystery 2</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      maxHeight: '400px',
                      padding: '16px 0',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '16px',
                      }}
                    >
                      {/* User inventory items */}
                      {userInventory.map((item, i) => (
                        <button
                          key={item.uniqueId || i}
                          onClick={() => {
                            const isSelected = selectedInputItems.some(selected => selected.uniqueId === item.uniqueId);
                            if (isSelected) {
                              setSelectedInputItems(selectedInputItems.filter(selected => selected.uniqueId !== item.uniqueId));
                            } else {
                              setSelectedInputItems([...selectedInputItems, item]);
                            }
                          }}
                          style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            borderTop: selectedInputItems.some(selected => selected.uniqueId === item.uniqueId) ? '2px solid #0276FF' : '2px solid transparent',
                            borderRight: selectedInputItems.some(selected => selected.uniqueId === item.uniqueId) ? '2px solid #0276FF' : '2px solid transparent',
                            borderLeft: selectedInputItems.some(selected => selected.uniqueId === item.uniqueId) ? '2px solid #0276FF' : '2px solid transparent',
                            borderBottom: '8px solid #2A3040',
                            backgroundColor: '#131621',
                            padding: '16px 8px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: '128px', maxHeight: '128px' }}>
                            <img
                              src={item.img}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: 'blur(4px)',
                              }}
                            />
                            <img
                              src={item.img}
                              alt=""
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF', maxWidth: '96px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </span>
                            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                              R${item.price}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Right Panel - Output Selection */}
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Select Item
                    </label>
                    <input
                      type="text"
                      placeholder="Search for an item.."
                      style={{
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>High - Low</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Murder Mystery 2</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      maxHeight: '400px',
                      padding: '16px 0',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '16px',
                      }}
                    >
                      {/* Stock inventory items */}
                      {stockInventory.map((item, i) => (
                        <button
                          key={item.uniqueId || i}
                          onClick={() => setSelectedDesiredItem(item)}
                          style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            borderTop: selectedDesiredItem?.uniqueId === item.uniqueId ? '2px solid #0276FF' : '2px solid transparent',
                            borderRight: selectedDesiredItem?.uniqueId === item.uniqueId ? '2px solid #0276FF' : '2px solid transparent',
                            borderLeft: selectedDesiredItem?.uniqueId === item.uniqueId ? '2px solid #0276FF' : '2px solid transparent',
                            borderBottom: '8px solid #2A3040',
                            backgroundColor: '#131621',
                            padding: '16px 8px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: '128px', maxHeight: '128px' }}>
                            <img
                              src={item.img}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                filter: 'blur(4px)',
                              }}
                            />
                            <img
                              src={item.img}
                              alt=""
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#FFFFFF', maxWidth: '96px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </span>
                            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#0276FF' }}>
                              R${item.price}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile View */}
            {isMobile && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #2A3040',
                    backgroundColor: '#191d29',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Select Item
                    </label>
                    <input
                      type="text"
                      placeholder="Search for an item.."
                      style={{
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                      }}
                    >
                      High - Low
                    </button>
                    <button
                      style={{
                        flex: 1,
                        height: '48px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        backgroundColor: 'transparent',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                      }}
                    >
                      Murder Mystery 2
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: '16px',
                      height: '300px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '24px', color: '#FFFFFF' }}>
                      No Items!
                    </span>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Your inventory seems to be empty...
                    </p>
                    <button
                      style={{
                        height: '44px',
                        padding: '0 32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#0276FF',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      Deposit Items
                    </button>
                  </div>
                </div>
              </div>
            )}
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
