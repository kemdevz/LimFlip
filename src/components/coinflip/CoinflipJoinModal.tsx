'use client';

import React, { useState, useEffect } from 'react';
import CoinflipItemCard from './CoinflipItemCard';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/Toast';

interface CoinflipJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: any;
  onGameJoined?: (game: any) => void;
}

const CoinflipJoinModal: React.FC<CoinflipJoinModalProps> = ({ isOpen, onClose, game, onGameJoined }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState('');
  const isMobile = useIsMobile();
  
  // Get user from useAuth hook
  const { user } = useAuth();
  const { inventory, loading, error } = useInventory(user?.id || null);

  // Check if game is balance-based
  const isBalanceBasedGame = game?.isBalanceBased || false;

  const toggleItemSelection = (uniqueId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueId)) {
        newSet.delete(uniqueId);
      } else {
        newSet.add(uniqueId);
      }
      return newSet;
    });
  };

  const ITEM_VALUE = 43.8; // Each item is worth 43.8K
  const totalSelectedAmount = Array.from(selectedItems).reduce((sum, uniqueId) => {
    const item = inventory?.items.find(i => i.uniqueId === uniqueId);
    return sum + (item?.value || ITEM_VALUE);
  }, 0);
  
  // Use balance amount if balance-based game, otherwise use selected items value
  const currentAmount = isBalanceBasedGame ? (parseFloat(balanceAmount) || 0) : totalSelectedAmount;
  
  // Animate amount changes
  useEffect(() => {
    const duration = 300;
    const start = animatedAmount;
    const end = currentAmount;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedAmount(start + (end - start) * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [currentAmount]);
  
  // Calculate 10% less and 10% more of selected value
  const minSelectedValue = animatedAmount * 0.9;
  const maxSelectedValue = animatedAmount * 1.1;
  
  // Calculate target range based on game's value
  const gameValue = game?.totalValue || 0;
  const minGameValue = gameValue * 0.9;
  const maxGameValue = gameValue * 1.1;
  
  // Check if selected amount is within valid range
  const isValidBet = animatedAmount >= minGameValue && animatedAmount <= maxGameValue;
  
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `B$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `B$${amount.toFixed(0)}`;
    }
  };

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      // Reset selections when modal opens
      setSelectedItems(new Set());
      setBalanceAmount('');
    } else {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sort inventory items by value (high to low)
  const sortedItems = inventory?.items 
    ? [...inventory.items].sort((a, b) => (b.value || 0) - (a.value || 0))
    : [];

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `}</style>
      <div
        className="responsive-modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          className="responsive-modal-panel"
          style={{
            position: 'relative',
            width: isMobile ? '100%' : '1134px',
            height: isMobile ? 'calc(100% - 59px)' : '721px',
            maxWidth: isMobile ? '100%' : '1134px',
            maxHeight: isMobile ? 'calc(100% - 59px)' : '721px',
            filter: 'drop-shadow(0px 4px 20.4px rgba(0, 0, 0, 0.25))',
            animation: isAnimatingOut ? 'scaleOut 0.2s ease-out' : 'scaleIn 0.2s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: isMobile ? '100%' : '1066px',
            height: isMobile ? '100%' : '701px',
            left: isMobile ? '0' : '26px',
            top: isMobile ? '0' : '5px',
            background: '#191B25',
            border: isMobile ? 'none' : '1px solid #222530',
            borderRadius: isMobile ? '0' : '12px',
          }}
        />

        
        {!isMobile && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '41px',
                height: '41px',
                left: '770px',
                top: '640px',
                background: 'url(/assets/images/coinflip/tails.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(0px 0px 8.3px #666666)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '41px',
                height: '41px',
                left: '817px',
                top: '640px',
                background: 'url(/assets/images/coinflip/heads.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.5,
              }}
            />
          </>
        )}

        
        <div
          style={{
            display: isMobile ? 'flex' : 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            justifyContent: 'space-between',
            padding: '0px',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '1019px',
            height: isMobile ? 'auto' : '27px',
            left: isMobile ? '16px' : '58px',
            top: isMobile ? '120px' : '154px',
          }}
        >
          <span
            style={{
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            Selected: <span style={{ color: isValidBet ? '#A855F7' : '#EF4444' }}>{formatAmount(animatedAmount)}</span>
          </span>
          <span
            style={{
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 1,
              order: 1,
              flexGrow: 0,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            Target: <span style={{ color: '#A855F7' }}>{formatAmount(gameValue)}</span>
          </span>
          <span
            style={{
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: isValidBet ? '#A855F7' : '#EF4444',
              flex: 'none',
              order: 2,
              flexGrow: 0,
            }}
          >
            {formatAmount(minGameValue)} - {formatAmount(maxGameValue)}
          </span>
        </div>

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            padding: '0px',
            gap: '7px',
            isolation: 'isolate',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '722px',
            height: '48px',
            left: isMobile ? '16px' : '56px',
            top: isMobile ? '60px' : '86px',
          }}
        >
          <div
            style={{
              width: isMobile ? '100%' : '722px',
              height: '48px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              zIndex: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                position: 'absolute',
                width: isMobile ? '100%' : '618px',
                height: '48px',
                left: '0px',
                top: '0px',
                border: '1.5px solid #495060',
                borderRadius: '15px',
              }}
            />
            <img
              src="/assets/svg/ui/search.svg"
              alt="Search"
              width={17}
              height={17}
              style={{
                position: 'absolute',
                left: '30px',
                top: '16px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '126px',
                height: '23px',
                left: '68px',
                top: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#495060',
              }}
            >
              Search for items
            </span>
          </div>
        </div>

        
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              width: '212px',
              height: '53px',
              left: '686px',
              top: '82px',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                position: 'absolute',
                width: '190px',
                height: '49px',
                left: '0px',
                top: '4px',
                border: '1.5px solid #495060',
                borderRadius: '15px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '85px',
                height: '23px',
                left: '44px',
                top: '17px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#495060',
              }}
            >
              High to low
            </span>
            <img
              src="/assets/svg/ui/arrowsort.svg"
              alt="Sort"
              width={12}
              height={7}
              style={{
                position: 'absolute',
                left: '76.89%',
                right: '19.81%',
                top: '49.06%',
                bottom: '28.3%',
              }}
            />
          </div>
        )}

        
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '53px',
              left: '886px',
              top: '82px',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                position: 'absolute',
                width: '190px',
                height: '50px',
                left: '0px',
                top: '3px',
                border: '1.5px solid #495060',
                borderRadius: '15px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '88px',
                height: '23px',
                left: '26px',
                top: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#495060',
              }}
            >
              Filter from..
            </span>
            <img
              src="/assets/svg/ui/arrowsort.svg"
              alt="Filter"
              width={12}
              height={7}
              style={{
                position: 'absolute',
                left: '80%',
                right: '16.32%',
                top: '47.17%',
                bottom: '30.19%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '92.86%',
                right: '5.56%',
                top: '4.72%',
                bottom: '92.79%',
                background: '#424964',
              }}
            />
          </div>
        )}

        
        <div
          onClick={async () => {
            const canJoin = isBalanceBasedGame
              ? (parseFloat(balanceAmount) > 0 && user?.id && !isJoining && isValidBet)
              : (selectedItems.size > 0 && user?.id && !isJoining && isValidBet);

            if (canJoin && user?.id) {
              setIsJoining(true);
              try {
                const body: any = {
                  userId: user.id,
                  betAmount: isBalanceBasedGame ? parseFloat(balanceAmount) : totalSelectedAmount,
                };

                if (isBalanceBasedGame) {
                  body.isBalanceBased = true;
                } else {
                  body.uniqueIds = Array.from(selectedItems);
                }

                const response = await fetch(`http://localhost:3001/coinflip/join/${game._id}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(body),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to join game');
                }

                console.log('Joined coinflip game:', data.game);
                
                toast.success('Joined coinflip game!');
                
                // Call the callback to notify parent component
                onGameJoined?.(data.game);
                
                onClose();
              } catch (err) {
                console.error('Error joining game:', err);
                toast.error(err instanceof Error ? err.message : 'Failed to join game');
              } finally {
                setIsJoining(false);
              }
            }
          }}
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '199px',
            height: '44px',
            left: isMobile ? '16px' : '875px',
            top: isMobile ? 'calc(100% - 60px)' : '638px',
            background: isValidBet ? '#A855F7' : '#EF4444',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: ((isBalanceBasedGame && parseFloat(balanceAmount) > 0) || (!isBalanceBasedGame && selectedItems.size > 0)) && !isJoining && isValidBet ? 'pointer' : 'not-allowed',
            opacity: ((isBalanceBasedGame && parseFloat(balanceAmount) > 0) || (!isBalanceBasedGame && selectedItems.size > 0)) && !isJoining && isValidBet ? 1 : 0.5,
            zIndex: 50,
          }}
        >
          <span
            style={{
              position: 'relative',
              width: isMobile ? 'auto' : '165px',
              height: '24px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isJoining ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    animation: 'spin 1s linear infinite',
                  }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="31.4"
                    strokeDashoffset="10"
                  />
                </svg>
                Joining...
              </>
            ) : `Join Game ${formatAmount(animatedAmount)}`}
          </span>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '7px',
            position: 'absolute',
            width: '74px',
            height: '33px',
            left: '-3px',
            top: '8px',
          }}
        >
          <div
            style={{
              width: '74px',
              height: '33px',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          />
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: isMobile ? '200px' : '240px',
            height: '32px',
            left: isMobile ? '16px' : '56px',
            top: isMobile ? '16px' : '33px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: isMobile ? '180px' : '224px',
              height: '33px',
              left: isMobile ? '40px' : '45px',
              top: '2px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '18px' : '22px',
              lineHeight: '33px',
              color: '#FFFFFF',
            }}
          >
            Join Coinflip Duel
          </span>
          <div
            style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              left: '4px',
              top: '0px',
            }}
          >
            <img src="/assets/svg/coinflip/coin.svg" alt="Coin" width={32} height={32} />
          </div>
        </div>

        {/* Balance input field for balance-based games */}
        {isBalanceBasedGame && (
          <div
            style={{
              position: 'absolute',
              width: isMobile ? 'calc(100% - 32px)' : '722px',
              height: '48px',
              left: isMobile ? '16px' : '56px',
              top: isMobile ? '60px' : '86px',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                position: 'absolute',
                width: '100%',
                height: '48px',
                left: '0px',
                top: '0px',
                border: '1.5px solid #495060',
                borderRadius: '15px',
                background: '#1E222F',
              }}
            />
            <input
              type="number"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              placeholder="Enter bet amount..."
              style={{
                position: 'absolute',
                width: 'calc(100% - 60px)',
                height: '23px',
                left: '30px',
                top: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '20px',
                top: '12px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                color: '#A855F7',
              }}
            >
              Balance: {formatAmount(user?.balance || 0)}
            </span>
          </div>
        )}

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            padding: '0px',
            gap: isMobile ? '8px' : '16px',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '960px',
            height: isMobile ? 'auto' : '440px',
            left: isMobile ? '16px' : '80px',
            top: isMobile ? isBalanceBasedGame ? '130px' : '210px' : '200px',
            overflowY: 'auto',
          }}
          className="hide-scrollbar"
        >
          {!isBalanceBasedGame && (
            <>
              {loading ? (
                <span style={{ color: '#6B7289' }}>Loading inventory...</span>
              ) : error ? (
                <span style={{ color: '#EF4444' }}>Error loading inventory</span>
              ) : sortedItems && sortedItems.length > 0 ? (
                sortedItems.map((item, index) => (
                  <div
                    key={`${item.uniqueId}_${index}`}
                    onClick={() => toggleItemSelection(item.uniqueId)}
                    style={{
                      position: 'relative',
                      width: isMobile ? 'calc(50% - 4px)' : '145px',
                      height: isMobile ? 'auto' : '185px',
                      cursor: 'pointer',
                      flex: 'none',
                      flexGrow: 0,
                      transition: 'transform 0.2s ease, opacity 0.2s ease',
                    }}
                  >
                    {selectedItems.has(item.uniqueId) && (
                      <div
                        style={{
                          position: 'absolute',
                          width: isMobile ? 'calc(50% - 4px)' : '145px',
                          height: isMobile ? 'auto' : '185px',
                          left: '0px',
                          top: '0px',
                          border: '1px solid #A855F7',
                          borderRadius: '7.91501px',
                          zIndex: 10,
                          transition: 'opacity 0.2s ease',
                          animation: 'pulse 0.3s ease-out',
                        }}
                      />
                    )}
                    <CoinflipItemCard imageSrc={item.image} itemName={item.name} itemValue={item.value} />
                  </div>
                ))
              ) : (
                <span style={{ color: '#6B7289' }}>No items in inventory</span>
              )}
            </>
          )}
          {isBalanceBasedGame && (
            <span style={{ color: '#6B7289' }}>Balance-based coinflip - no items needed</span>
          )}
        </div>

        
        {!isMobile && (
          <span
            style={{
              position: 'absolute',
              width: '153px',
              height: '27px',
              left: '60px',
              top: '638px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#585D76',
            }}
          >
          </span>
        )}

        
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              width: '7px',
              height: '183px',
              left: '1078px',
              top: '210px',
              background: '#13141B',
              borderRadius: '41px',
            }}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default CoinflipJoinModal;
