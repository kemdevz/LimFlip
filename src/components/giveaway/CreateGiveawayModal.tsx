'use client';

import React, { useState, useEffect } from 'react';
import CoinflipItemCard from '../coinflip/CoinflipItemCard';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';

interface InventoryItem {
  uniqueId: string;
  itemId: string;
  name: string;
  image: string;
  rarity: string;
  value: number;
  category: string;
  acquiredAt: string;
  source?: string;
  wagered?: boolean;
}

interface CreateGiveawayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGiveawayModal: React.FC<CreateGiveawayModalProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [duration, setDuration] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useIsMobile();
  const { user } = useAuth();

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

  // Fetch user inventory
  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`http://localhost:3001/inventory/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.items) {
          setInventory(data.items);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, [user, isOpen]);

  const totalSelectedAmount = inventory
    .filter(item => selectedItems.has(item.uniqueId))
    .reduce((sum, item) => sum + (item.value || 0), 0);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.value || 0), 0);
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(1)}k`;
    } else {
      return `B$${amount}`;
    }
  };

  const handleCreateGiveaway = async () => {
    if (selectedItems.size === 0 || !duration) {
      setError('Please select items and enter a duration');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      // Convert selected items to item objects from inventory
      const items = inventory
        .filter(item => selectedItems.has(item.uniqueId))
        .map(item => ({
          itemId: item.itemId,
          name: item.name,
          image: item.image,
          rarity: item.rarity,
          value: item.value,
          category: item.category
        }));

      const response = await fetch('http://localhost:3001/giveaway/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          duration: parseInt(duration)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create giveaway');
      }

      console.log('Giveaway created:', data);
      onClose();
      setSelectedItems(new Set());
      setDuration('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  // Animate amount when it changes
  useEffect(() => {
    const duration = 300; // ms
    const startTime = performance.now();
    const startValue = animatedAmount;
    const endValue = totalSelectedAmount;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setAnimatedAmount(startValue + (endValue - startValue) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalSelectedAmount]);

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

        
        <div
          style={{
            display: isMobile ? 'flex' : 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            padding: '0px',
            gap: isMobile ? '8px' : '213px',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '1019px',
            height: isMobile ? 'auto' : '27px',
            left: isMobile ? '16px' : '58px',
            top: isMobile ? '120px' : '154px',
          }}
        >
          <span
            style={{
              width: isMobile ? 'auto' : '181px',
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
            Selected: <span style={{ color: '#A855F7' }}>{formatAmount(animatedAmount)}</span>
          </span>
          <span
            style={{
              width: isMobile ? 'auto' : '244px',
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              flexGrow: 0,
            }}
          >
            Inventory Value: <span style={{ color: '#A855F7' }}>{formatAmount(totalInventoryValue)}</span>
          </span>
          <span
            style={{
              width: isMobile ? 'auto' : '168px',
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '27px',
              color: '#A855F7',
              flex: 'none',
              order: 2,
              flexGrow: 0,
            }}
          >
            {inventory.length > 0 ? `${formatAmount(Math.min(...inventory.map(i => i.value || 0)))} - ${formatAmount(Math.max(...inventory.map(i => i.value || 0)))}` : 'N/A'}
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
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '100px',
            height: '44px',
            left: isMobile ? '16px' : '780px',
            top: isMobile ? 'calc(100% - 60px)' : '638px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              position: 'absolute',
              width: '100%',
              height: '44px',
              left: '0px',
              top: '0px',
              border: '1.5px solid #495060',
              borderRadius: '15px',
              background: '#191B25',
            }}
          />
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Min"
            style={{
              position: 'absolute',
              width: 'calc(100% - 20px)',
              height: '24px',
              left: '10px',
              top: '10px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '24px',
              color: '#FFFFFF',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>

        
        <div
          onClick={handleCreateGiveaway}
          style={{
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : 'auto',
            minWidth: isMobile ? 'auto' : '120px',
            maxWidth: isMobile ? 'auto' : '250px',
            height: '44px',
            left: isMobile ? '16px' : '890px',
            top: isMobile ? 'calc(100% - 60px)' : '638px',
            background: '#A855F7',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            cursor: selectedItems.size > 0 && duration && !isCreating ? 'pointer' : 'not-allowed',
            opacity: selectedItems.size > 0 && duration && !isCreating ? 1 : 0.5,
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '24px',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            {isCreating ? 'Creating...' : `Create ${formatAmount(animatedAmount)}`}
          </span>
        </div>

        {error && (
          <div
            style={{
              position: 'absolute',
              width: isMobile ? 'calc(100% - 32px)' : '300px',
              left: isMobile ? '16px' : '56px',
              top: isMobile ? 'calc(100% - 110px)' : '590px',
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid #FF0000',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#FF0000',
              fontSize: '12px',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {error}
          </div>
        )}

        
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
            Create Giveaway
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
            gap: isMobile ? '8px' : '11px',
            position: 'absolute',
            width: isMobile ? 'calc(100% - 32px)' : '1030px',
            height: isMobile ? 'calc(100% - 200px)' : '418px',
            left: isMobile ? '16px' : '54px',
            top: isMobile ? '180px' : '201px',
            overflowY: 'auto',
          }}
        >

          {inventory.map((item) => (
            <div
              key={item.uniqueId}
              onClick={() => toggleItemSelection(item.uniqueId)}
              style={{
                position: 'relative',
                width: isMobile ? 'calc(50% - 4px)' : '159.29px',
                height: isMobile ? 'auto' : '203.81px',
                cursor: 'pointer',
                flex: 'none',
                flexGrow: 0,
              }}
            >
              {selectedItems.has(item.uniqueId) && (
                <div
                  style={{
                    position: 'absolute',
                    width: isMobile ? 'calc(50% - 4px)' : '159.29px',
                    height: isMobile ? 'auto' : '203.81px',
                    left: '0px',
                    top: '0px',
                    border: '1px solid #A855F7',
                    borderRadius: '7.91501px',
                    zIndex: 10,
                  }}
                />
              )}
              <CoinflipItemCard
                imageSrc={item.image}
                itemName={item.name}
                itemValue={item.value}
              />
            </div>
          ))}

          {inventory.length === 0 && (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#585D76',
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              No items in inventory
            </div>
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

export default CreateGiveawayModal;
