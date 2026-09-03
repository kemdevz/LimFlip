'use client';

import React, { useState, useEffect } from 'react';
import CoinflipItemCard from '@/components/coinflip/CoinflipItemCard';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/Toast';

interface MM2WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MM2WithdrawModal: React.FC<MM2WithdrawModalProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const isMobile = useIsMobile();
  
  // Get user from useAuth hook
  const { user } = useAuth();
  const { inventory, loading, error, fetchInventory } = useInventory(user?.id || null);

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
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sort inventory items by value (high to low) and filter out marketplace items
  const sortedItems = inventory?.items 
    ? [...inventory.items]
        .filter(item => !item.listedInMarketplace)
        .sort((a, b) => (b.value || 0) - (a.value || 0))
    : [];

  const handleWithdraw = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to withdraw');
      return;
    }

    if (!user?.id) {
      toast.error('User not logged in');
      return;
    }

    setIsWithdrawing(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // Create withdrawal request
      const response = await fetch(`${API_URL}/mm2/withdraw/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          itemIds: Array.from(selectedItems),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create withdrawal request');
      }

      // Open Roblox profile to trade
      window.open('https://www.roblox.com/share?code=08e9a905497e2541bad83194f3fc0888&type=Server', '_blank');

      toast.success('Withdrawal initiated! Trade the bot MM2_BUGGY in the VIP server.');

      // Clear selection
      setSelectedItems(new Set());
      await fetchInventory();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

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
          zIndex: 9999,
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
            zIndex: 10000,
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

        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '32px',
            left: '56px',
            top: '22px',
          }}
        >
          <img
            src="/assets/svg/home/wallet.svg"
            alt="Withdraw"
            style={{
              position: 'absolute',
              width: '30px',
              height: '30px',
              left: '0px',
              top: '0px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '123px',
              height: '33px',
              left: '47px',
              top: '0px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '33px',
              color: '#FFFFFF',
            }}
          >
            Withdraw
          </span>
        </div>


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
            {selectedItems.size} items
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
              width: '190px',
              height: '53px',
              left: '857px',
              top: '86px',
            }}
          >
            <div
              style={{
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
                width: '86px',
                height: '23px',
                left: '26px',
                top: '16px',
                fontFamily: 'Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#495060',
                whiteSpace: 'nowrap',
              }}
            >
              Filter from..
            </span>
            <img
              src="/assets/svg/ui/dropdown.svg"
              alt="Dropdown"
              style={{
                position: 'absolute',
                width: '12px',
                height: '7px',
                right: '20px',
                top: '23px',
              }}
            />
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
            gap: '11px',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '1018px',
            height: isMobile ? 'calc(100% - 200px)' : '418px',
            left: isMobile ? '16px' : '50px',
            top: isMobile ? '180px' : '199px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <span style={{ color: '#6B7289', fontFamily: 'Poppins, sans-serif' }}>Loading inventory...</span>
          ) : sortedItems.length === 0 ? (
            <div
              style={{
                position: 'absolute',
                width: '642px',
                height: '49px',
                left: '215px',
                top: '376px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: '642px',
                  height: '16px',
                  left: '0px',
                  top: '0px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: '25px',
                  lineHeight: '16px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                Uh Oh
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '624px',
                  height: '16px',
                  left: '9px',
                  top: '33px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '16px',
                  color: '#505A71',
                }}
              >
                You have no items in inventory
              </span>
            </div>
          ) : (
            sortedItems.map((item) => (
              <div
                key={item.uniqueId}
                onClick={() => toggleItemSelection(item.uniqueId)}
                style={{
                  position: 'relative',
                  width: '159.29px',
                  height: '203.81px',
                  cursor: 'pointer',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                }}
              >
                {selectedItems.has(item.uniqueId) && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '159.29px',
                      height: '203.81px',
                      left: '0px',
                      top: '0px',
                      border: '1px solid #006EFF',
                      borderRadius: '7.91501px',
                      zIndex: 10,
                    }}
                  />
                )}
                <CoinflipItemCard
                  imageSrc={item.image || '/assets/images/coinflip/item_1side.png'}
                  itemName={item.name || 'Unknown'}
                  itemValue={item.value || 0}
                />
              </div>
            ))
          )}
        </div>


        <div
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '1019px',
            height: isMobile ? '60px' : '74px',
            left: isMobile ? '16px' : '58px',
            bottom: isMobile ? '16px' : '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || selectedItems.size === 0}
            style={{
              padding: '12px 32px',
              background: isWithdrawing || selectedItems.size === 0 ? '#202634' : '#0276FF',
              border: 'none',
              borderRadius: '15px',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isWithdrawing || selectedItems.size === 0 ? 'not-allowed' : 'pointer',
              opacity: isWithdrawing || selectedItems.size === 0 ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MM2WithdrawModal;
