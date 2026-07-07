'use client';

import { useState, useEffect } from 'react';
import MyListingsModal from './MyListingsModal';
import { useIsMobile } from '@/hooks/useMediaQuery';

export default function MarketplaceContent() {
  const isMobile = useIsMobile();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const items = [
    { name: 'Gingerscope', price: '0.35$+', rate: '$15/1k', cartPrice: '$21.22', image: '/assets/images/coinflip/candy.png' },
    { name: 'Chroma Waves', price: '0.35$+', rate: '$15/1k', cartPrice: '$21.22', image: '/assets/images/coinflip/chroma.png' },
    { name: 'Chroma Darkbr..', price: '0.35$+', rate: '$15/1k', cartPrice: '$21.22', image: '/assets/images/coinflip/knife.png' },
    { name: 'Luger', price: '0.35$+', rate: '$15/1k', cartPrice: '$21.22', image: '/assets/images/coinflip/luger.png', featured: true },
    { name: 'Candy', price: '0.35$+', rate: '$15/1k', cartPrice: '$21.22', image: '/assets/images/coinflip/pet.png' },
    { name: 'Nether Star', price: '0.45$+', rate: '$18/1k', cartPrice: '$28.50', image: '/assets/images/coinflip/chroma.png' },
    { name: 'Void Walker', price: '0.50$+', rate: '$20/1k', cartPrice: '$32.00', image: '/assets/images/coinflip/knife.png' },
    { name: 'Shadow Blade', price: '0.40$+', rate: '$16/1k', cartPrice: '$25.60', image: '/assets/images/coinflip/luger.png' },
    { name: 'Crystal Heart', price: '0.55$+', rate: '$22/1k', cartPrice: '$35.20', image: '/assets/images/coinflip/pet.png' },
    { name: 'Dark Matter', price: '0.60$+', rate: '$24/1k', cartPrice: '$38.40', image: '/assets/images/coinflip/candy.png' },
    { name: 'Frost Bite', price: '0.38$+', rate: '$15.5/1k', cartPrice: '$24.32', image: '/assets/images/coinflip/chroma.png' },
    { name: 'Thunder Strike', price: '0.42$+', rate: '$17/1k', cartPrice: '$26.88', image: '/assets/images/coinflip/knife.png' },
    { name: 'Golden Phoenix', price: '0.65$+', rate: '$26/1k', cartPrice: '$41.60', image: '/assets/images/coinflip/luger.png' },
    { name: 'Silver Moon', price: '0.48$+', rate: '$19/1k', cartPrice: '$30.72', image: '/assets/images/coinflip/pet.png' },
    { name: 'Inferno Flame', price: '0.52$+', rate: '$21/1k', cartPrice: '$33.28', image: '/assets/images/coinflip/candy.png' },
    { name: 'Ocean Depth', price: '0.44$+', rate: '$17.5/1k', cartPrice: '$28.16', image: '/assets/images/coinflip/chroma.png' },
    { name: 'Forest Spirit', price: '0.46$+', rate: '$18.5/1k', cartPrice: '$29.44', image: '/assets/images/coinflip/knife.png' },
    { name: 'Sky Diamond', price: '0.58$+', rate: '$23/1k', cartPrice: '$37.12', image: '/assets/images/coinflip/luger.png' },
    { name: 'Mystic Orb', price: '0.54$+', rate: '$21.5/1k', cartPrice: '$34.56', image: '/assets/images/coinflip/pet.png' },
    { name: 'Dragon Scale', price: '0.62$+', rate: '$25/1k', cartPrice: '$39.68', image: '/assets/images/coinflip/candy.png' },
    { name: 'Phoenix Wing', price: '0.56$+', rate: '$22.5/1k', cartPrice: '$35.84', image: '/assets/images/coinflip/chroma.png' },
    { name: 'Ancient Rune', price: '0.47$+', rate: '$19/1k', cartPrice: '$30.08', image: '/assets/images/coinflip/knife.png' },
    { name: 'Cosmic Dust', price: '0.51$+', rate: '$20.5/1k', cartPrice: '$32.64', image: '/assets/images/coinflip/luger.png' },
    { name: 'Starlight', price: '0.49$+', rate: '$19.5/1k', cartPrice: '$31.36', image: '/assets/images/coinflip/pet.png' },
    { name: 'Eternal Flame', price: '0.64$+', rate: '$25.5/1k', cartPrice: '$40.96', image: '/assets/images/coinflip/candy.png' },
  ];

  const cartItems = Array.from(selectedItems).map(index => ({
    name: items[index].name,
    price: items[index].cartPrice,
    image: items[index].image,
  }));

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const removeFromCart = (itemName: string) => {
    const itemIndex = items.findIndex(item => item.name === itemName);
    if (itemIndex !== -1) {
      toggleSelection(itemIndex);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const priceValue = parseFloat(item.price.replace('$', ''));
    return total + priceValue;
  }, 0);

  return (
    <div
      className="marketplace-root"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      {/* Recently Sold Section */}
      <div
        style={{
          marginBottom: '17px',
          marginLeft: '26px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '15px',
            marginLeft: '4px',
            marginRight: '21px',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            Recently Sold
          </span>
          <div style={{ flex: 1 }} />
          <img
            src="/assets/svg/ui/arrow1.svg"
            alt="Arrow Left"
            style={{
              width: '7px',
              height: '12px',
              marginRight: '17px',
            }}
          />
          <img
            src="/assets/svg/ui/arrow2.svg"
            alt="Arrow Right"
            style={{
              width: '7px',
              height: '12px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '42px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '3px',
                width: '177px',
                height: '78px',
                position: 'relative',
                marginRight: '12px',
                flexShrink: 0,
              }}
            >
              {/* Background */}
              <div
                style={{
                  position: 'absolute',
                  width: '177px',
                  height: '78px',
                  left: '0px',
                  top: '0px',
                  backgroundColor: '#1F2435',
                  opacity: '0.2',
                  boxShadow: '0px 4px 56.6px rgba(0, 0, 0, 0.035)',
                  borderRadius: '15px',
                }}
              />

              {/* Price */}
              <span
                style={{
                  position: 'absolute',
                  width: '40px',
                  height: '15px',
                  left: '11px',
                  top: '5px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '10px',
                  lineHeight: '15px',
                  color: '#4C526B',
                }}
              >
                21.35 $
              </span>

              {/* MM2 */}
              <span
                style={{
                  position: 'absolute',
                  width: '23px',
                  height: '15px',
                  left: '147px',
                  top: '5px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '8px',
                  lineHeight: '12px',
                  color: '#4C526B',
                }}
              >
                MM2
              </span>

              {/* blox bash overlay */}
              <div
                style={{
                  position: 'absolute',
                  width: '96px',
                  height: '15px',
                  left: '42px',
                  top: '29px',
                  opacity: '0.06',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '33px',
                    height: '23px',
                    left: '0px',
                    top: '-4px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#FFFFFF',
                  }}
                >
                  blox
                </span>
                <span
                  style={{
                    position: 'absolute',
                    width: '39px',
                    height: '23px',
                    left: '57px',
                    top: '-4px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#FFFFFF',
                    textShadow: '0px 0px 28.9px rgba(47, 143, 255, 0.25)',
                  }}
                >
                  bash
                </span>
              </div>

              {/* Item image with blur */}
              <div
                style={{
                  position: 'absolute',
                  width: '55.93px',
                  height: '56.81px',
                  left: '61px',
                  top: '10px',
                }}
              >
                <img
                  src="/assets/images/coinflip/chroma.png"
                  alt="Item"
                  style={{
                    position: 'absolute',
                    width: '47.65px',
                    height: '47.65px',
                    left: '14px',
                    top: '14.16px',
                    filter: 'blur(31.35px)',
                  }}
                />
                <img
                  src="/assets/images/coinflip/chroma.png"
                  alt="Item"
                  style={{
                    position: 'absolute',
                    width: '47.65px',
                    height: '47.65px',
                    left: '14.35px',
                    top: '13px',
                  }}
                />
              </div>

              {/* Item name and time */}
              <div
                style={{
                  position: 'absolute',
                  width: '187px',
                  height: '27px',
                  left: '11px',
                  top: '47px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '187px',
                    height: '15px',
                    left: '0px',
                    top: '-2px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '9px',
                    lineHeight: '14px',
                    color: '#F5F5F5',
                  }}
                >
                  Chroma Waves
                </span>
                <span
                  style={{
                    position: 'absolute',
                    width: '187px',
                    height: '15px',
                    left: '0px',
                    top: '12px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '8px',
                    lineHeight: '12px',
                    color: '#4C526B',
                  }}
                >
                  12s ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="marketplace-toolbar"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '17px',
          marginLeft: '26px',
          marginRight: '12px',
          gap: '13px',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            height: '53px',
            backgroundColor: '#191D29',
            borderRadius: '15px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: '15px',
          }}
        >
          <img
            src="/assets/svg/ui/search.svg"
            alt="Search"
            style={{
              width: '18px',
              height: '18px',
              marginRight: '11px',
            }}
          />
          <input
            type="text"
            placeholder="Search for collectibles ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#596175',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>
        <button
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#333845',
            borderRadius: '15px',
            borderWidth: '1px',
            padding: '14px 18px',
            marginRight: '13px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          <img
            src="/assets/svg/ui/arrowprice.svg"
            alt="Price"
            style={{
              width: '28px',
              height: '21px',
              marginRight: '12px',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 'bold',
              marginRight: '16px',
            }}
          >
            Price sort low to high
          </span>
          <img
            src="/assets/svg/ui/dropdown.svg"
            alt="Dropdown"
            style={{
              width: '17px',
              height: '9px',
            }}
          />
        </button>
        <button
          onClick={() => setIsMyListingsOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#191D29',
            borderRadius: '15px',
            padding: '13px 22px',
            marginRight: '14px',
            boxShadow: '0px 8.08px 17px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <span
            style={{
              color: '#373F56',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            My Listings
          </span>
        </button>
        <div className="marketplace-toolbar__actions" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                top: isMobile ? '-5px' : '-8px',
                left: isMobile ? '95px' : '124px',
                backgroundColor: '#FF3939',
                borderRadius: '1298px',
                padding: '0 5px',
                color: '#FFFFFF',
                fontSize: isMobile ? '14px' : '17px',
                fontWeight: 'bold',
                zIndex: 10,
              }}
            >
              {selectedItems.size}
            </span>
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#0276FF',
                borderRadius: isMobile ? '12px' : '15px',
                padding: isMobile ? '10px 15px' : '12px 19px',
                boxShadow: '0px 8.08px 17px rgba(0, 0, 0, 0.12)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <img
                src="/assets/svg/ui/cart.svg"
                alt="Cart"
                style={{
                  borderRadius: '15px',
                  width: isMobile ? '22px' : '27px',
                  height: isMobile ? '22px' : '27px',
                  marginRight: isMobile ? '8px' : '11px',
                }}
              />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 'bold',
                }}
              >
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="marketplace-main"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          minHeight: 0,
          padding: '5px 27px',
          overflow: 'hidden',
        }}
      >
        {/* Items Grid */}
        <div
          className="marketplace-grid hide-scrollbar"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            gap: '18px',
            marginRight: '69px',
            overflowY: 'auto',
          }}
        >
          {items.slice(0, 4).map((item, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              style={{
                width: selectedItems.has(index) ? '205px' : '205px',
                height: selectedItems.has(index) ? '235px' : '232px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                position: 'relative',
                backgroundColor: '#191D29',
                boxShadow: selectedItems.has(index) 
                  ? 'inset 0px 4px 111.6px rgba(2, 118, 255, 0.2)' 
                  : '0px 4px 56.6px rgba(0, 0, 0, 0.035)',
                borderRadius: '15px',
                border: selectedItems.has(index) ? '1px solid #0276FF' : 'none',
                cursor: 'pointer',
              }}
            >
              {/* Top gradient section */}
              <div
                style={{
                  position: 'absolute',
                  width: '205px',
                  height: '178px',
                  left: '0px',
                  top: selectedItems.has(index) ? '1.5px' : '0px',
                  background: 'linear-gradient(180deg, #191D29 0%, #141823 100%)',
                  borderRadius: '15px 15px 0px 0px',
                }}
              >
                {/* Multiplier badge */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '6.23685px 4.1579px',
                    gap: '10.39px',
                    position: 'absolute',
                    width: '28px',
                    height: '28px',
                    right: '9px',
                    top: '8px',
                    backgroundColor: '#24293B',
                    boxShadow: '0px 2.07895px 9.97896px rgba(0, 0, 0, 0.15)',
                    borderRadius: '4.1579px',
                  }}
                >
                  <span
                    style={{
                      width: '17px',
                      height: '21px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      fontSize: '14px',
                      lineHeight: '21px',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                      letterSpacing: '-0.02em',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                    }}
                  >
                    3x
                  </span>
                </div>

                {/* Item images with blur */}
                <div
                  style={{
                    position: 'absolute',
                    width: '110.26px',
                    height: '112px',
                    left: '41px',
                    top: '39px',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      width: '109.34px',
                      height: '109.34px',
                      left: '0px',
                      top: '2.66px',
                      filter: 'blur(31.35px)',
                    }}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      width: '109.45px',
                      height: '109.45px',
                      left: '0.81px',
                      top: '0px',
                    }}
                  />
                </div>

                {/* blox bash overlay */}
                <div
                  style={{
                    position: 'absolute',
                    width: '162px',
                    height: '39px',
                    left: '30px',
                    top: '80px',
                    opacity: '0.06',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: '44px',
                      height: '30px',
                      left: '5px',
                      top: '3px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      fontSize: '20px',
                      lineHeight: '30px',
                      color: '#FFFFFF',
                    }}
                  >
                    blox
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: '52px',
                      height: '30px',
                      left: '83px',
                      top: '3px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '700',
                      fontSize: '20px',
                      lineHeight: '30px',
                      color: '#FFFFFF',
                      textShadow: '0px 0px 28.9px rgba(47, 143, 255, 0.25)',
                    }}
                  >
                    bash
                  </span>
                </div>
              </div>

              {/* Item name and price */}
              <div
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '184px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#FFFFFF',
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '13px',
                    lineHeight: '20px',
                    color: '#737E98',
                  }}
                >
                  {item.price}
                </span>
              </div>

              {/* Rate */}
              <span
                style={{
                  position: 'absolute',
                  width: '41px',
                  height: '20px',
                  left: '13px',
                  top: '210px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#0276FF',
                }}
              >
                {item.rate}
              </span>

              {/* Blue bar */}
              <div
                style={{
                  position: 'absolute',
                  width: '83px',
                  height: '6px',
                  left: '64px',
                  top: '226px',
                  backgroundColor: '#0276FF',
                  borderRadius: '4px 4px 0px 0px',
                  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
                }}
              />

              {/* Market icon */}
              <div
                style={{
                  position: 'absolute',
                  width: '44px',
                  height: '42px',
                  left: '156px',
                  top: '181.5px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    left: '6px',
                    top: '6.5px',
                    backgroundColor: '#0276FF',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/assets/svg/ui/market.svg"
                    alt="Market"
                    style={{
                      width: '14px',
                      height: '14px',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Cart Sidebar */}
        {isCartOpen && isMobile && (
          <div
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />
        )}
        <div
          className={`marketplace-cart ${isCartOpen ? 'marketplace-cart--open' : ''}`}
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            width: isMobile ? '85%' : '357px',
            height: isMobile ? '100vh' : '554px',
            right: isMobile ? '0' : (isCartOpen ? '18px' : '-375px'),
            top: isMobile ? '0' : 'calc(50% - 554px/2 + 101px)',
            backgroundColor: '#191D29',
            borderRadius: isMobile ? '0' : '13px',
            transition: isMobile ? 'transform 0.3s ease' : 'right 0.3s ease',
            transform: isMobile ? (isCartOpen ? 'translateX(0)' : 'translateX(100%)') : 'none',
            zIndex: isMobile ? 1000 : 'auto',
            boxShadow: isMobile ? '-5px 0 15px rgba(0, 0, 0, 0.3)' : 'none',
          }}
        >
          {/* Top Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: isMobile ? '20px' : '0px 30px',
              gap: '15px',
              position: 'absolute',
              width: isMobile ? '100%' : '374px',
              height: isMobile ? 'auto' : '52px',
              left: isMobile ? '0' : '-5px',
              top: isMobile ? '0' : '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0px',
                gap: '15px',
                width: isMobile ? '100%' : '314px',
                height: isMobile ? 'auto' : '34px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  gap: isMobile ? '0' : '198px',
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? 'auto' : '34px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '10px',
                    width: isMobile ? 'auto' : '175.2px',
                    height: isMobile ? 'auto' : '33px',
                  }}
                >
                  <img
                    src="/assets/svg/ui/cart.svg"
                    alt="Cart"
                    style={{
                      width: '25.2px',
                      height: '24px',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '5px',
                      width: isMobile ? 'auto' : '140px',
                      height: isMobile ? 'auto' : '33px',
                    }}
                  >
                    <span
                      style={{
                        width: isMobile ? 'auto' : '70px',
                        height: isMobile ? 'auto' : '27px',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: '600',
                        fontSize: isMobile ? '20px' : '18px',
                        lineHeight: '27px',
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                      }}
                    >
                      My Cart
                    </span>
                  </div>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '10px',
                    }}
                  >
                    <img
                      src="/assets/svg/ui/x.svg"
                      alt="Close"
                      style={{
                        width: '18px',
                        height: '18px',
                      }}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              width: isMobile ? '100%' : '314px',
              height: '3px',
              backgroundColor: '#262C40',
              borderRadius: '44px',
              position: 'absolute',
              left: isMobile ? '0' : '23px',
              top: isMobile ? '70px' : '68px',
            }}
          />

          {/* Cart Items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: isMobile ? '20px' : '0px',
              gap: '10px',
              position: 'absolute',
              width: isMobile ? 'calc(100% - 40px)' : '314px',
              height: isMobile ? 'calc(100% - 150px)' : '332px',
              left: isMobile ? '20px' : '23px',
              top: isMobile ? '90px' : '84px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? '80px' : '73px',
                  backgroundColor: '#24293B',
                  borderRadius: '10.3901px',
                  position: 'relative',
                }}
              >
                {/* Item image with blur */}
                <div
                  style={{
                    position: 'absolute',
                    width: isMobile ? '60px' : '48px',
                    height: isMobile ? '60px' : '48.76px',
                    left: isMobile ? '15px' : '14px',
                    top: isMobile ? '10px' : '13px',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '60px' : '47.6px',
                      height: isMobile ? '60px' : '47.6px',
                      left: '0px',
                      top: '1.16px',
                      filter: 'blur(31.35px)',
                    }}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '60px' : '47.65px',
                      height: isMobile ? '60px' : '47.65px',
                      left: '0.35px',
                      top: '0px',
                    }}
                  />
                </div>

                {/* Item name and price */}
                <div
                  style={{
                    position: 'absolute',
                    width: isMobile ? 'calc(100% - 90px)' : '180.22px',
                    height: isMobile ? 'auto' : '47.68px',
                    left: isMobile ? '85px' : '77.39px',
                    top: isMobile ? '15px' : '12.66px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '158.22px',
                      height: isMobile ? 'auto' : '23px',
                      left: '0px',
                      top: '0px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: isMobile ? '16px' : '15px',
                      lineHeight: isMobile ? '24px' : '22px',
                      letterSpacing: '-0.02em',
                      color: '#FFFFFF',
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '158.22px',
                      height: isMobile ? 'auto' : '27px',
                      left: '0px',
                      top: '22.68px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      fontSize: isMobile ? '18px' : '18px',
                      lineHeight: '27px',
                      color: '#737E98',
                    }}
                  >
                    {item.price}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '10px',
                    position: 'absolute',
                    width: isMobile ? '35px' : '31px',
                    height: isMobile ? '35px' : '31px',
                    left: isMobile ? 'calc(100% - 50px)' : '268px',
                    top: isMobile ? '22px' : '21px',
                    backgroundColor: '#2C3349',
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src="/assets/svg/ui/x.svg"
                    alt="Remove"
                    style={{
                      width: isMobile ? '12px' : '11px',
                      height: isMobile ? '15px' : '14px',
                    }}
                  />
                </button>

                {/* Blue bar */}
                <div
                  style={{
                    position: 'absolute',
                    width: isMobile ? '100px' : '83px',
                    height: '6px',
                    left: isMobile ? '85px' : '126px',
                    top: isMobile ? '72px' : '67px',
                    backgroundColor: '#2F8FFF',
                    borderRadius: '4px 4px 0px 0px',
                    transform: 'matrix(-1, 0, 0, 1, 0, 0)',
                  }}
                />
              </div>
            ))}

            {cartItems.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? '100%' : '332px',
                  color: '#737E98',
                  fontSize: isMobile ? '16px' : '14px',
                }}
              >
                Your cart is empty
              </div>
            )}
          </div>

          {/* Vertical divider - hide on mobile */}
          <div
            style={{
              position: 'absolute',
              width: '4px',
              height: '208px',
              left: '346px',
              top: '86px',
              backgroundColor: '#1F2433',
              borderRadius: '3px',
              display: isMobile ? 'none' : 'block',
            }}
          />

          {/* Gradient overlay - hide on mobile */}
          <div
            style={{
              position: 'absolute',
              width: isMobile ? '100%' : '314px',
              height: isMobile ? '52px' : '52px',
              left: isMobile ? '0' : '23px',
              top: isMobile ? 'auto' : '356px',
              bottom: isMobile ? '120px' : 'auto',
              background: 'linear-gradient(353.5deg, #191D29 4.68%, rgba(25, 29, 41, 0) 94.47%)',
              display: isMobile ? 'none' : 'block',
            }}
          />

          {/* Bottom Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: isMobile ? '20px' : '0px 30px',
              gap: '15px',
              position: 'absolute',
              width: isMobile ? '100%' : '374px',
              height: isMobile ? 'auto' : '120px',
              left: isMobile ? '0' : '-8px',
              bottom: isMobile ? '0' : '21px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '3px',
                width: isMobile ? 'calc(100% - 40px)' : '314px',
                height: isMobile ? 'auto' : '45px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  gap: isMobile ? '0' : '130.54px',
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? 'auto' : '21px',
                }}
              >
                <span
                  style={{
                    margin: '0 auto',
                    width: '92px',
                    height: '17px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '-0.02em',
                    color: '#0276FF',
                  }}
                >
                  Items In Cart
                </span>
                <span
                  style={{
                    margin: '0 auto',
                    width: '96px',
                    height: '21px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '-0.02em',
                    color: '#0276FF',
                  }}
                >
                  {cartItems.length}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  gap: isMobile ? '0' : '130.54px',
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? 'auto' : '21px',
                }}
              >
                <span
                  style={{
                    margin: '0 auto',
                    width: isMobile ? 'auto' : '86px',
                    height: isMobile ? 'auto' : '21px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: isMobile ? '18px' : '17px',
                    lineHeight: '26px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  Total Price
                </span>
                <span
                  style={{
                    margin: '0 auto',
                    width: isMobile ? 'auto' : '96px',
                    height: isMobile ? 'auto' : '21px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    fontSize: isMobile ? '20px' : '19px',
                    lineHeight: '28px',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div
              style={{
                width: isMobile ? '100%' : '314px',
                height: '5px',
                backgroundColor: '#262C40',
                borderRadius: '44px',
              }}
            />

            <button
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '15px 20px' : '4px 20px',
                gap: '9.16px',
                width: isMobile ? '100%' : '314px',
                height: isMobile ? '50px' : '40px',
                backgroundColor: '#0276FF',
                boxShadow: '0px 10.9967px 23.9177px rgba(0, 0, 0, 0.22)',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <img
                src="/assets/svg/ui/cart.svg"
                alt="Cart"
                style={{
                  width: isMobile ? '24px' : '22.05px',
                  height: isMobile ? '24px' : '21px',
                }}
              />
              <span
                style={{
                  width: isMobile ? 'auto' : '79px',
                  height: isMobile ? 'auto' : '26px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: isMobile ? '18px' : '17px',
                  lineHeight: '26px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                Purchase
              </span>
            </button>
          </div>
        </div>
      </div>
      <MyListingsModal isOpen={isMyListingsOpen} onClose={() => setIsMyListingsOpen(false)} />
    </div>
  );
}
