'use client';

import { useState, useEffect } from 'react';
import MyListingsModal from './MyListingsModal';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';

interface MarketplaceContentProps {
  onMyListingsClick?: () => void;
}

interface Listing {
  _id: string;
  item: {
    _id: string;
    name: string;
    image: string;
    rarity: string;
    value: number;
    category: string;
  };
  seller: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
  price: number;
  status: string;
  createdAt: string;
}

export default function MarketplaceContent({ onMyListingsClick }: MarketplaceContentProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCartTotal, setDisplayedCartTotal] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [recentlySold, setRecentlySold] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    fetchListings();
    fetchRecentlySold();
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-bash.onrender.com';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const fetchListings = async (search?: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-bash.onrender.com';
      const url = search 
        ? `${API_URL}/marketplace/listings?search=${encodeURIComponent(search)}`
        : `${API_URL}/marketplace/listings`;
      
      const response = await fetch(url);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentlySold = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-bash.onrender.com';
      const response = await fetch(`${API_URL}/marketplace/recently-sold`);
      const data = await response.json();
      setRecentlySold(data);
    } catch (error) {
      console.error('Error fetching recently sold:', error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchListings(searchQuery);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const cartItems = Array.from(selectedItems).map(listingId => {
    const listing = listings.find(l => l._id === listingId);
    return listing ? {
      id: listing._id,
      name: listing.item.name,
      price: listing.price,
      image: listing.item.image,
    } : null;
  }).filter(Boolean);

  const toggleSelection = (listingId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId);
    } else {
      newSelected.add(listingId);
    }
    setSelectedItems(newSelected);
  };

  const removeFromCart = (listingId: string) => {
    toggleSelection(listingId);
  };

  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      setPurchaseError('Your cart is empty');
      return;
    }

    if (cartTotal > userBalance) {
      setPurchaseError('Insufficient balance');
      return;
    }

    setIsPurchasing(true);
    setPurchaseError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-bash.onrender.com';
      const token = localStorage.getItem('token');

      // Purchase each item in cart
      const purchasePromises = cartItems.map(async (cartItem) => {
        if (!cartItem?.id) return null;
        
        const response = await fetch(`${API_URL}/marketplace/buy/${cartItem.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to purchase item');
        }

        return response.json();
      });

      await Promise.all(purchasePromises);

      // Clear cart and refresh data
      setSelectedItems(new Set());
      await fetchListings();
      await fetchRecentlySold();
      await fetchUserBalance();
      setIsCartOpen(false);
    } catch (error: any) {
      setPurchaseError(error.message || 'Failed to complete purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item?.price || 0);
  }, 0);

  // Animate cart total when it changes
  useEffect(() => {
    const duration = 600; // animation duration in ms
    const startTime = performance.now();
    const startValue = displayedCartTotal;
    const endValue = cartTotal;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quintic function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 5);
      
      setDisplayedCartTotal(startValue + (endValue - startValue) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [cartTotal]);

  return (
    <div
      className="marketplace-root"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      
      <div
        style={{
          marginBottom: '17px',
          marginLeft: isMobile ? '12px' : '26px',
          marginRight: isMobile ? '12px' : '42px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '15px',
            marginLeft: isMobile ? '0' : '4px',
            marginRight: isMobile ? '0' : '21px',
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
          {!isMobile && (
            <>
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
            </>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: isMobile ? '0' : '42px',
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
          {recentlySold.map((sale, index) => (
            <div
              key={sale._id || index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '3px',
                width: isMobile ? 'calc(50% - 6px)' : '177px',
                height: '78px',
                position: 'relative',
                marginRight: isMobile ? '12px' : '12px',
                flexShrink: 0,
              }}
            >
              
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
                ${sale.price}
              </span>

              
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
                  src={sale.item?.image || '/assets/images/coinflip/chroma.png'}
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
                  src={sale.item?.image || '/assets/images/coinflip/chroma.png'}
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
                  {sale.item?.name || 'Unknown'}
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
                  {Math.floor((Date.now() - new Date(sale.soldAt).getTime()) / 1000)}s ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div
        className="marketplace-toolbar"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          marginBottom: '17px',
          marginLeft: isMobile ? '12px' : '26px',
          marginRight: isMobile ? '12px' : '26px',
          gap: isMobile ? '10px' : '13px',
        }}
      >
        {isMobile ? (
          <>
            <div style={{ display: 'flex', gap: '13px', width: '100%' }}>
              <button
                onClick={() => onMyListingsClick && onMyListingsClick()}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#191D29',
                  borderRadius: '15px',
                  padding: '13px 22px',
                  boxShadow: '0px 8.08px 17px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer',
                  border: 'none',
                  flex: 1,
                  justifyContent: 'center',
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
                  placeholder="Search"
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
            </div>
            <div className="marketplace-toolbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%' }}>
              <button
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#333845',
                  borderRadius: '15px',
                  borderWidth: '1px',
                  padding: '14px 30px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  flex: 1,
                  justifyContent: 'center',
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
                  }}
                >
                  Low to High
                </span>
              </button>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '95px',
                    backgroundColor: '#FF3939',
                    borderRadius: '1298px',
                    padding: '0 5px',
                    color: '#FFFFFF',
                    fontSize: '14px',
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
                    borderRadius: '12px',
                    padding: '10px 15px',
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
                      width: '22px',
                      height: '22px',
                      marginRight: '8px',
                    }}
                  />
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${displayedCartTotal.toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
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
              onClick={() => onMyListingsClick && onMyListingsClick()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#191D29',
                borderRadius: '15px',
                padding: '13px 22px',
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
            <div className="marketplace-toolbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
              <button
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: '#333845',
                  borderRadius: '15px',
                  borderWidth: '1px',
                  padding: '14px 18px',
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
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '124px',
                    backgroundColor: '#FF3939',
                    borderRadius: '1298px',
                    padding: '0 5px',
                    color: '#FFFFFF',
                    fontSize: '17px',
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
                    borderRadius: '15px',
                    padding: '12px 19px',
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
                      width: '27px',
                      height: '27px',
                      marginRight: '11px',
                    }}
                  />
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${displayedCartTotal.toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      
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
        
        <div
          className="marketplace-grid hide-scrollbar"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            gap: '12px',
            marginRight: '20px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div style={{ color: '#FFFFFF', padding: '20px' }}>Loading...</div>
          ) : (
            listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => toggleSelection(listing._id)}
                style={{
                  width: '205px',
                  height: '232px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                  position: 'relative',
                  backgroundColor: '#191D29',
                  boxShadow: selectedItems.has(listing._id) 
                    ? 'inset 0px 4px 111.6px rgba(2, 118, 255, 0.2)' 
                    : '0px 4px 56.6px rgba(0, 0, 0, 0.035)',
                  borderRadius: '15px',
                  border: selectedItems.has(listing._id) ? '1px solid #0276FF' : 'none',
                  cursor: 'pointer',
                }}
              >
              
              <div
                style={{
                  position: 'absolute',
                  width: '205px',
                  height: '178px',
                  left: '0px',
                  top: '0px',
                  background: 'linear-gradient(180deg, #191D29 0%, #141823 100%)',
                  borderRadius: '15px 15px 0px 0px',
                }}
              >
                
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
                    backgroundColor: 'rgba(255, 255, 255, 0.44)',
                    backgroundBlendMode: 'overlay',
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
                    1x
                  </span>
                </div>

                
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
                    src={listing.item.image}
                    alt={listing.item.name}
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
                    src={listing.item.image}
                    alt={listing.item.name}
                    style={{
                      position: 'absolute',
                      width: '109.45px',
                      height: '109.45px',
                      left: '0.81px',
                      top: '0px',
                    }}
                  />
                </div>

                
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

              
              <span
                style={{
                  position: 'absolute',
                  width: '91px',
                  height: '21px',
                  left: '13px',
                  top: '184px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#FFFFFF',
                }}
              >
                {listing.item.name}
              </span>

              
              <span
                style={{
                  position: 'absolute',
                  width: '46px',
                  height: '20px',
                  left: '13px',
                  top: '203px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#737E98',
                }}
              >
                ${(listing.price / 1000).toFixed(2)}$
              </span>

              
              <span
                style={{
                  position: 'absolute',
                  width: '41px',
                  height: '20px',
                  left: '60px',
                  top: '203px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '13px',
                  lineHeight: '20px',
                  color: '#0276FF',
                }}
              >
                ${(listing.price / listing.item.value * 1000).toFixed(2)}/1k
              </span>

              
              <div
                style={{
                  position: 'absolute',
                  width: '83px',
                  height: '6px',
                  left: '64px',
                  top: '226px',
                  background: '#0276FF',
                  borderRadius: '4px 4px 0px 0px',
                  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
                }}
              />

              
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
                    background: '#0276FF',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.832655 1.15902C0.696886 1.41114 0.630127 1.72348 0.496609 2.34676L0.0480473 4.4407C-0.0155247 4.7262 -0.0160171 5.02081 0.0466003 5.30649C0.109218 5.59218 0.233627 5.86293 0.412213 6.10216C0.590799 6.3414 0.819803 6.54409 1.08521 6.69783C1.35061 6.85156 1.64683 6.95311 1.95573 6.99625C2.26463 7.0394 2.57971 7.02322 2.88168 6.94873C3.18365 6.87424 3.46616 6.74299 3.71192 6.56302C3.95767 6.38305 4.1615 6.15814 4.31092 5.90207C4.46035 5.646 4.55222 5.36415 4.58092 5.07378L4.63343 4.59057C4.605 4.89789 4.64555 5.20737 4.75249 5.49924C4.85942 5.7911 5.0304 6.05893 5.25448 6.28561C5.47856 6.5123 5.75083 6.69284 6.05388 6.81572C6.35694 6.9386 6.68411 7.00111 7.01451 6.99925C7.3449 6.99739 7.67124 6.93121 7.97269 6.80493C8.27413 6.67865 8.54405 6.49505 8.76519 6.26587C8.98633 6.03668 9.15384 5.76695 9.257 5.4739C9.36016 5.18085 9.39672 4.87094 9.36432 4.56395L9.41908 5.07378C9.44778 5.36415 9.53965 5.646 9.68908 5.90207C9.8385 6.15814 10.0423 6.38305 10.2881 6.56302C10.5338 6.74299 10.8163 6.87424 11.1183 6.94873C11.4203 7.02322 11.7354 7.02322 12.0443 6.99625C12.3532 6.95311 12.6494 6.85156 12.9148 6.69783C13.1802 6.54409 13.4092 6.3414 13.5878 6.10216C13.7664 5.86293 13.8908 5.59218 13.9534 5.30649C14.016 5.02081 14.0155 4.7262 13.952 4.4407L13.5034 2.34676C13.3699 1.72348 13.3031 1.41184 13.1673 1.15902C13.0259 0.89573 12.8267 0.663154 12.5827 0.47639C12.3387 0.289626 12.0554 0.152848 11.7512 0.0749338C11.4586 7.82663e-08 11.1181 0 10.437 0H3.56303C2.88194 0 2.54139 7.82663e-08 2.24885 0.0749338C1.94458 0.152848 1.66127 0.289626 1.41729 0.47639C1.17331 0.663154 0.974121 0.89573 0.832655 1.15902ZM11.7024 8.05362C12.2885 8.05501 12.865 7.91484 13.3759 7.64674V8.40378C13.3759 11.0447 13.3759 12.3655 12.4968 13.1855C11.7894 13.8466 10.7355 13.9748 8.87526 14V11.5552C8.87526 10.9004 8.87526 10.5734 8.72449 10.3296C8.62574 10.17 8.48371 10.0374 8.31268 9.94518C8.05164 9.80441 7.70135 9.80441 7 9.80441C6.29865 9.80441 5.94836 9.80441 5.68732 9.94518C5.51629 10.0374 5.37426 10.17 5.27551 10.3296C5.12474 10.5734 5.12474 10.9004 5.12474 11.5552V14C3.26449 13.9748 2.21059 13.8459 1.50325 13.1855C0.624126 12.3655 0.624126 11.0447 0.624126 8.40378V7.64674C1.13526 7.91496 1.71203 8.05513 2.29836 8.05362C3.1652 8.05413 3.99978 7.74667 4.63268 7.19364C5.27755 7.74851 6.12302 8.05565 7 8.05362C7.87698 8.05565 8.72245 7.74851 9.36732 7.19364C10.0002 7.74667 10.8355 8.05413 11.7024 8.05362Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        
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
            height: isMobile ? 'calc(100vh - 59px)' : '554px',
            right: isMobile ? '0' : (isCartOpen ? '18px' : '-375px'),
            top: isMobile ? '0' : 'calc(50% - 554px/2 + 101px)',
            backgroundColor: '#191D29',
            border: isMobile ? '1px solid #222530' : 'none',
            borderRadius: isMobile ? '0' : '13px',
            transition: isMobile ? 'transform 0.3s ease' : 'right 0.3s ease',
            transform: isMobile ? (isCartOpen ? 'translateX(0)' : 'translateX(100%)') : 'none',
            zIndex: isMobile ? 1000 : 'auto',
            boxShadow: isMobile ? '-5px 0 15px rgba(0, 0, 0, 0.5)' : 'none',
          }}
        >
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: isMobile ? '20px' : '0px 30px',
              gap: '15px',
              position: 'absolute',
              width: isMobile ? '100%' : '357px',
              height: isMobile ? 'auto' : '52px',
              left: isMobile ? '0' : '0px',
              top: isMobile ? '0' : '16px',
              backgroundColor: '#191D29',
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
              backgroundColor: 'transparent',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {cartItems.map((cartItem) => (
              <div
                key={cartItem?.id}
                style={{
                  width: isMobile ? '100%' : '314px',
                  height: isMobile ? '80px' : '73px',
                  backgroundColor: '#24293B',
                  borderRadius: '10.3901px',
                  position: 'relative',
                }}
              >
                
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
                    src={cartItem?.image}
                    alt={cartItem?.name}
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
                    src={cartItem?.image}
                    alt={cartItem?.name}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '60px' : '47.65px',
                      height: isMobile ? '60px' : '47.65px',
                      left: '0.35px',
                      top: '0px',
                    }}
                  />
                </div>

                
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
                    {cartItem?.name}
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
                    ${cartItem?.price}
                  </span>
                </div>

                
                <button
                  onClick={() => removeFromCart(cartItem?.id || '')}
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
                  backgroundColor: '#191D29',
                }}
              >
                Your cart is empty
              </div>
            )}
          </div>

          
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

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: isMobile ? '20px' : '0px 30px',
              gap: '15px',
              position: 'absolute',
              width: isMobile ? '100%' : '357px',
              height: isMobile ? 'auto' : '120px',
              left: isMobile ? '0' : '0px',
              bottom: isMobile ? '0' : '21px',
              backgroundColor: '#191D29',
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
                  ${displayedCartTotal.toFixed(2)}
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
              onClick={handlePurchase}
              disabled={isPurchasing || cartItems.length === 0}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? '15px 20px' : '4px 20px',
                gap: '9.16px',
                width: isMobile ? '100%' : '314px',
                height: isMobile ? '50px' : '40px',
                backgroundColor: isPurchasing || cartItems.length === 0 ? '#404763' : '#0276FF',
                boxShadow: '0px 10.9967px 23.9177px rgba(0, 0, 0, 0.22)',
                borderRadius: '15px',
                border: 'none',
                cursor: isPurchasing || cartItems.length === 0 ? 'not-allowed' : 'pointer',
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
                  color: '#FFFFFF',
                }}
              >
                {isPurchasing ? 'Purchasing...' : 'Purchase'}
              </span>
            </button>

            {purchaseError && (
              <div
                style={{
                  width: isMobile ? '100%' : '314px',
                  padding: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #EF4444',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#EF4444',
                  }}
                >
                  {purchaseError}
                </span>
              </div>
            )}

            <div
              style={{
                width: isMobile ? '100%' : '314px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#737E98',
                }}
              >
                Your Balance
              </span>
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: '600',
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: cartTotal > userBalance ? '#EF4444' : '#006EFF',
                }}
              >
                ${userBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
