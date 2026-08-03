'use client';

import { useState, useEffect } from 'react';
import CoinflipItemCard from '@/components/coinflip/CoinflipItemCard';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';

interface MyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyListingsModal({ isOpen, onClose }: MyListingsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [listingPrice, setListingPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const [listingError, setListingError] = useState('');
  
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

  const totalSelectedAmount = Array.from(selectedItems).reduce((sum, uniqueId) => {
    const item = inventory?.items.find(i => i.uniqueId === uniqueId);
    return sum + (item?.value || 0);
  }, 0);
  
  const formatAmount = (amount: number) => {
    return `B$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleListItems = async () => {
    if (selectedItems.size === 0) {
      setListingError('Please select at least one item');
      return;
    }

    if (!listingPrice || parseFloat(listingPrice) <= 0) {
      setListingError('Please enter a valid price');
      return;
    }

    setIsListing(true);
    setListingError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');

      // List each selected item
      const listingPromises = Array.from(selectedItems).map(async (uniqueId) => {
        const response = await fetch(`${API_URL}/marketplace/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            inventoryItemUniqueId: uniqueId,
            price: parseFloat(listingPrice),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create listing');
        }

        return response.json();
      });

      await Promise.all(listingPromises);

      // Clear selection and refetch inventory
      setSelectedItems(new Set());
      setListingPrice('');
      await fetchInventory();
      onClose();
    } catch (error: any) {
      setListingError(error.message || 'Failed to list items');
    } finally {
      setIsListing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className="responsive-modal-panel responsive-modal-panel--center"
        style={{
          position: 'relative',
          width: '1066px',
          height: '701px',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.15s ease-in-out',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '1062px',
            height: '701px',
            left: '0px',
            top: '0px',
            background: '#191D29',
            border: '1px solid #222530',
            borderRadius: '15px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '32px',
            left: '27px',
            top: '22px',
          }}
        >
          <img
            src="/assets/market/market.svg"
            alt="Market"
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
            My Listings
          </span>
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '722px',
            height: '48px',
            left: '27px',
            top: '75px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: '7px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '618px',
              height: '48px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '618px',
                height: '48px',
                left: '0px',
                top: '0px',
                border: '1.5px solid #404763',
                borderRadius: '15px',
              }}
            />
            <img
              src="/assets/market/search.svg"
              alt="Search"
              style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                left: '30px',
                top: '14px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '125px',
                height: '23px',
                left: '62px',
                top: '12px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#737991',
              }}
            >
              Search for items
            </span>
          </div>
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '212px',
            height: '53px',
            left: '657px',
            top: '71px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '49px',
              left: '0px',
              top: '4px',
              border: '1.5px solid #404763',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '84px',
              height: '23px',
              left: '44px',
              top: '17px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#737991',
            }}
          >
            High to low
          </span>
          <img
            src="/assets/market/dropdown.svg"
            alt="Dropdown"
            style={{
              position: 'absolute',
              width: '12px',
              height: '7px',
              right: '45 px',
              top: '23px',
            }}
          />
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '190px',
            height: '53px',
            left: '857px',
            top: '71px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '190px',
              height: '50px',
              left: '0px',
              top: '3px',
              border: '1.5px solid #404763',
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
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#737991',
            }}
          >
            Filter from..
          </span>
          <img
            src="/assets/market/dropdown.svg"
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

        
        <div
          style={{
            position: 'absolute',
            width: '1018px',
            height: '27px',
            left: '29px',
            top: '143px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '638px',
          }}
        >
          <span
            style={{
              width: '181px',
              height: '27px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
            }}
          >
            Selected: <span style={{ color: '#006EFF' }}>{formatAmount(totalSelectedAmount)}</span>
          </span>
          <span
            style={{
              width: '190px',
              height: '27px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
            }}
          >
            Inventory Value: <span style={{ color: '#006EFF' }}>{formatAmount(inventory?.totalValue || 0)}</span>
          </span>
        </div>

        
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
            width: '1018px',
            height: '418px',
            left: '29px',
            top: '199px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <span style={{ color: '#6B7289' }}>Loading inventory...</span>
          ) : error ? (
            <span style={{ color: '#EF4444' }}>Error loading inventory</span>
          ) : inventory?.items && inventory.items.length > 0 ? (
            inventory.items.map((item) => (
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
                <CoinflipItemCard imageSrc={item.image} itemName={item.name} itemValue={item.value} />
              </div>
            ))
          ) : (
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
          )}
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '7px',
            height: '183px',
            left: '1049px',
            top: '199px',
            background: '#13141B',
            borderRadius: '41px',
          }}
        />

        
        <div
          style={{
            position: 'absolute',
            width: '131px',
            height: '54px',
            left: '25px',
            top: '631px',
            opacity: 0.55,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '131px',
              height: '54px',
              left: '0px',
              top: '0px',
              background: '#202634',
              borderRadius: '15px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '75px',
              height: '24px',
              left: '26px',
              top: '17px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Select All
          </span>
        </div>

        
        <div
          style={{
            position: 'absolute',
            width: '127px',
            height: '53px',
            left: '755px',
            top: '631px',
            opacity: 0.55,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '127px',
              height: '50px',
              left: '0px',
              top: '3px',
              border: '1.5px solid #404763',
              borderRadius: '15px',
            }}
          />
          <input
            type="number"
            value={listingPrice}
            onChange={(e) => setListingPrice(e.target.value)}
            placeholder="Price"
            style={{
              position: 'absolute',
              width: '80px',
              height: '24px',
              left: '15px',
              top: '17px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>

        {listingError && (
          <div
            style={{
              position: 'absolute',
              width: '300px',
              left: '25px',
              top: '690px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#EF4444',
            }}
          >
            {listingError}
          </div>
        )}


        <div
          style={{
            position: 'absolute',
            width: '153px',
            height: '50px',
            left: '889px',
            top: '635px',
          }}
        >
          <div
            onClick={handleListItems}
            style={{
              position: 'absolute',
              width: '153px',
              height: '50px',
              left: '0px',
              top: '0px',
              background: isListing ? '#404763' : '#006EFF',
              borderRadius: '15px',
              cursor: isListing ? 'not-allowed' : 'pointer',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '80px',
              height: '24px',
              left: '40px',
              top: '13px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            {isListing ? 'Listing...' : 'List Items'}
          </span>
        </div>
      </div>
    </div>
  );
}
