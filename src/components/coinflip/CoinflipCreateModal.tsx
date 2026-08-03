'use client';

import React, { useState, useEffect } from 'react';
import CoinflipItemCard from './CoinflipItemCard';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/Toast';

interface CoinflipCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated?: (game: any) => void;
}

const CoinflipCreateModal: React.FC<CoinflipCreateModalProps> = ({ isOpen, onClose, onGameCreated }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const isMobile = useIsMobile();
  
  // Get user from useAuth hook
  const { user } = useAuth();
  console.log('CoinflipCreateModal - user:', user);
  console.log('CoinflipCreateModal - user.id:', user?.id);
  const { inventory, loading, error } = useInventory(user?.id || null);

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
  
  // Animate amount changes
  useEffect(() => {
    const duration = 300;
    const start = animatedAmount;
    const end = totalSelectedAmount;
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
  }, [totalSelectedAmount]);
  
  // Calculate 10% less and 10% more of selected value
  const minSelectedValue = animatedAmount * 0.9;
  const maxSelectedValue = animatedAmount * 1.1;
  
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
    } else {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
          zIndex: 1000,
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          className="responsive-modal-panel"
          style={{
            position: 'relative',
            width: isMobile ? '100%' : '1134px',
            height: isMobile ? '100%' : '721px',
            maxWidth: isMobile ? '100%' : '1134px',
            maxHeight: isMobile ? '100%' : '721px',
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
            Selected: <span style={{ color: '#006EFF' }}>{formatAmount(animatedAmount)}</span>
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
            Inventory Value: <span style={{ color: '#006EFF' }}>{formatAmount(inventory?.totalValue || 0)}</span>
          </span>
          <span
            style={{
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#006EFF',
              flex: 'none',
              order: 2,
              flexGrow: 0,
            }}
          >
            {formatAmount(minSelectedValue)} - {formatAmount(maxSelectedValue)}
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
            if (selectedItems.size > 0 && user?.id && !isCreating) {
              setIsCreating(true);
              try {
                const response = await fetch('https://api-bash.onrender.com/coinflip/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: user.id,
                    uniqueIds: Array.from(selectedItems),
                    betAmount: totalSelectedAmount,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create game');
                }

                console.log('Game created:', data.game);
                
                toast.success('Coinflip game created!');
                
                // Call the callback to notify parent component
                onGameCreated?.(data.game);
                
                onClose();
              } catch (err) {
                console.error('Error creating game:', err);
                toast.error(err instanceof Error ? err.message : 'Failed to create game');
              } finally {
                setIsCreating(false);
              }
            }
          }}
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '199px',
            height: '44px',
            left: isMobile ? '16px' : '875px',
            top: isMobile ? 'calc(100% - 60px)' : '638px',
            background: '#006EFF',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: selectedItems.size > 0 && !isCreating ? 'pointer' : 'not-allowed',
            opacity: selectedItems.size > 0 && !isCreating ? 1 : 0.5,
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
            {isCreating ? (
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
                Creating...
              </>
            ) : `Create Game ${formatAmount(animatedAmount)}`}
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
            Create Coinflip Duel
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
            top: isMobile ? '210px' : '200px',
            overflowY: 'auto',
          }}
          className="hide-scrollbar"
        >
          {loading ? (
            <span style={{ color: '#6B7289' }}>Loading inventory...</span>
          ) : error ? (
            <span style={{ color: '#EF4444' }}>Error loading inventory</span>
          ) : inventory?.items && inventory.items.length > 0 ? (
            inventory.items.map((item, index) => (
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
                      border: '1px solid #006EFF',
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

export default CoinflipCreateModal;
