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
  
  // Get user from useAuth hook
  const { user } = useAuth();
  const { inventory, loading, error } = useInventory(user?.id || null);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const totalSelectedAmount = Array.from(selectedItems).reduce((sum, itemId) => {
    const item = inventory?.items.find(i => i.itemId === itemId);
    return sum + (item?.value || 0);
  }, 0);
  
  const formatAmount = (amount: number) => {
    return `B$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
                key={item.itemId}
                onClick={() => toggleItemSelection(item.itemId)}
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
                {selectedItems.has(item.itemId) && (
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
            height: '54px',
            left: '755px',
            top: '631px',
            opacity: 0.55,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '127px',
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
              width: '68px',
              height: '24px',
              left: '30px',
              top: '17px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Edit <span style={{ color: '#006EFF' }}>R$0</span>
          </span>
        </div>


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
            style={{
              position: 'absolute',
              width: '153px',
              height: '50px',
              left: '0px',
              top: '0px',
              background: '#006EFF',
              borderRadius: '15px',
              cursor: 'pointer',
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
            List Items
          </span>
        </div>
      </div>
    </div>
  );
}
