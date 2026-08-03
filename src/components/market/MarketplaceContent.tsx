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
            gap: '18px',
            marginRight: '69px',
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div style={{ color: '#FFFFFF', padding: '20px' }}>Loading...</div>
          ) : (
            listings.slice(0, 12).map((listing) => (
              <div
                key={listing._id}
                onClick={() => toggleSelection(listing._id)}
                style={{
                  width: selectedItems.has(listing._id) ? '205px' : '205px',
                  height: selectedItems.has(listing._id) ? '235px' : '232px',
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
                  top: selectedItems.has(listing._id) ? '1.5px' : '0px',
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
                    ${(listing.price / 1000).toFixed(2)}
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
                  {listing.item.name}
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
                  ${listing.price}
                </span>
              </div>

              
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
                ${(listing.price / listing.item.value * 1000).toFixed(2)}/1k
              </span>
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
