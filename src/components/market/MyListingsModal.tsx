'use client';

import { useState, useEffect } from 'react';

interface MyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyListingsModal({ isOpen, onClose }: MyListingsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className="responsive-modal-panel"
        style={{
          position: 'relative',
          width: '1066px',
          height: '701px',
          background: '#191D29',
          border: '1px solid #222530',
          borderRadius: '15px',
          filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* My Listings Header */}
        <div
          style={{
            position: 'absolute',
            width: '240px',
            height: '32px',
            left: '27px',
            top: '22px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '3px',
              height: '26px',
              left: '0px',
              top: '3px',
              background: '#0276FF',
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

        {/* Close button */}
        <img
          src="/assets/svg/ui/x.svg"
          alt="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            width: '19px',
            height: '20px',
            right: '20px',
            top: '18px',
            cursor: 'pointer',
          }}
        />

        {/* Search bar */}
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
            <div
              style={{
                position: 'absolute',
                width: '17px',
                height: '17px',
                left: '30px',
                top: '16px',
                border: '2.5px solid #737991',
                borderRadius: '50%',
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

        {/* High to low filter */}
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
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              right: '20px',
              top: '22px',
              background: '#404763',
              transform: 'rotate(90deg)',
            }}
          />
        </div>

        {/* Filter from.. */}
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
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              right: '20px',
              top: '22px',
              background: '#404763',
              transform: 'rotate(90deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '2px',
              height: '10px',
              right: '10px',
              top: '22px',
              background: '#424964',
            }}
          />
        </div>

        {/* Stats row */}
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
            Selected: B$43.8k
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
            Listing Value: B$1.2m
          </span>
        </div>

        {/* Empty state */}
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
            You have no listings up, click "List Items" to start listing items on the market.
          </span>
        </div>

        {/* Scrollbar */}
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

        {/* Select All button */}
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

        {/* Edit R$0 button */}
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
            Edit R$0
          </span>
        </div>

        {/* List Items button */}
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
