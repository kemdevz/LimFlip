'use client';

import React, { useState, useEffect } from 'react';

interface CoinflipCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoinflipCreateModal: React.FC<CoinflipCreateModalProps> = ({ isOpen, onClose }) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleItemSelection = (index: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const ITEM_VALUE = 43.8; // Each item is worth 43.8K
  const totalSelectedAmount = selectedItems.size * ITEM_VALUE;
  const formatAmount = (amount: number) => `B$${amount.toFixed(1)}k`;

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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: isAnimatingOut ? 'fadeOut 0.2s ease-out' : 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            width: '1134px',
            height: '721px',
            filter: 'drop-shadow(0px 4px 20.4px rgba(0, 0, 0, 0.25))',
            animation: isAnimatingOut ? 'scaleOut 0.2s ease-out' : 'scaleIn 0.2s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Rectangle 18653 - Main background */}
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            width: '1066px',
            height: '701px',
            left: '26px',
            top: '5px',
            background: '#191B25',
            border: '1px solid #222530',
            borderRadius: '12px',
          }}
        />

        {/* Coin icons at bottom */}
        <div
          style={{
            position: 'absolute',
            width: '41px',
            height: '41px',
            left: '774px',
            top: '647px',
            background: 'url(/tails.png)',
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
            left: '821px',
            top: '647px',
            background: 'url(/heads.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />

        {/* Frame 2131328022 - Stats row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '213px',
            position: 'absolute',
            width: '1019px',
            height: '27px',
            left: '58px',
            top: '154px',
          }}
        >
          <span
            style={{
              width: '181px',
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            Selected: {formatAmount(animatedAmount)}
          </span>
          <span
            style={{
              width: '244px',
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              flexGrow: 0,
            }}
          >
            Inventory Value: B$1.2m
          </span>
          <span
            style={{
              width: '168px',
              height: '27px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '27px',
              color: '#FFFFFF',
              flex: 'none',
              order: 2,
              flexGrow: 0,
            }}
          >
            B$43.8K - B$44.6k
          </span>
        </div>

        {/* Frame 2131328009 - Search bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            padding: '0px',
            gap: '7px',
            isolation: 'isolate',
            position: 'absolute',
            width: '722px',
            height: '48px',
            left: '56px',
            top: '86px',
          }}
        >
          <div
            style={{
              width: '722px',
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
                width: '618px',
                height: '48px',
                left: '0px',
                top: '0px',
                border: '1.5px solid #495060',
                borderRadius: '15px',
              }}
            />
            <img
              src="/search.svg"
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

        {/* Frame 2131328044 - High to low dropdown */}
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
            src="/arrowsort.svg"
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

        {/* Frame 2131328043 - Filter dropdown */}
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
            src="/arrowsort.svg"
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

        {/* Frame 2131328002 - Create Game button */}
        <div
          style={{
            position: 'absolute',
            width: '198px',
            height: '54px',
            left: '875px',
            top: '638px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '-1.01%',
              right: '0.51%',
              top: '12.96%',
              bottom: '5.56%',
              background: '#202634',
              borderRadius: '5px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: '185px',
              height: '24px',
              left: '15px',
              top: '17px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          >
            Create Game {formatAmount(animatedAmount)}
          </span>
        </div>

        {/* Frame 2131328533 - Header with coin */}
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

        {/* Frame 2131328010 - Create Coinflip Duel title */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '32px',
            left: '56px',
            top: '33px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '224px',
              height: '33px',
              left: '45px',
              top: '2px',
              fontFamily: 'Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
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

        {/* Frame 2131328205 - Item grid */}
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
            width: '1030px',
            height: '418px',
            left: '54px',
            top: '201px',
          }}
        >
          {/* Item cards - rendering 12 items */}
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              onClick={() => toggleItemSelection(index)}
              style={{
                boxSizing: 'border-box',
                width: '161px',
                height: '206px',
                border: selectedItems.has(index) ? '1px solid #006EFF' : 'none',
                borderRadius: '8px',
                flex: 'none',
                order: index,
                flexGrow: 0,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {selectedItems.has(index) && (
                <div
                  style={{
                    position: 'absolute',
                    width: '160px',
                    height: '205px',
                    left: '0px',
                    top: '1px',
                    background: 'rgba(0, 110, 255, 0.27)',
                    borderRadius: '6px',
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  width: '154px',
                  height: '154px',
                  left: '5px',
                  top: '4px',
                  background: '#13151E',
                  borderRadius: '10px',
                }}
              />
              <img
                src="/knife.png"
                alt="Item"
                style={{
                  position: 'absolute',
                  width: '118px',
                  height: '118px',
                  left: '22px',
                  top: '20px',
                }}
              />
              <img
                src="/assets/svg/coinflip/coin.svg"
                alt="Coin"
                width={54}
                height={54}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '20px',
                  filter: 'drop-shadow(0px 0px 50px rgba(0, 110, 255, 0.25))',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: '154px',
                  height: '23px',
                  left: '7px',
                  top: '162px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#FFFFFF',
                }}
              >
                Knife
              </span>
              <span
                style={{
                  position: 'absolute',
                  width: '69px',
                  height: '23px',
                  left: '7px',
                  top: '181px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#006EFF',
                }}
              >
                R$43.8K
              </span>
            </div>
          ))}
        </div>

        {/* Advanced text */}
        <span
          style={{
            position: 'absolute',
            width: '153px',
            height: '27px',
            left: '60px',
            top: '659px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '27px',
            color: '#585D76',
          }}
        >
          Advanced
        </span>

        {/* Scrollbar */}
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
      </div>
    </div>
    </>
  );
};

export default CoinflipCreateModal;
