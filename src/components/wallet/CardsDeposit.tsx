export default function CardsDeposit({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '586px',
        height: '313px',
        filter: 'drop-shadow(0px 4px 27.2px rgba(0, 0, 0, 0.25))',
      }}
    >
      
      <div
        style={{
          position: 'absolute',
          width: '586px',
          height: '313px',
          left: '0px',
          top: '0px',
          background: '#191D29',
          border: '1px solid #222530',
          borderRadius: '15px',
        }}
      />

      
      <img
        src="/assets/svg/ui/x.svg"
        alt="Close"
        onClick={onClose}
        style={{
          position: 'absolute',
          width: '14px',
          height: '14px',
          right: '20px',
          top: '20px',
          cursor: 'pointer',
        }}
      />

      
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          left: '62px',
          top: '32px',
        }}
      >
        <img
          src="/assets/wallet/icon.svg"
          alt="Wallet"
          style={{
            width: '23px',
            height: '20px',
          }}
        />
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '24px',
            color: '#FFFFFF',
          }}
        >
          Wallet
        </span>
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '265px',
          height: '35px',
          left: '173px',
          top: '23px',
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            width: '265px',
            height: '35px',
            left: '0px',
            top: '0px',
            background: '#1C212E',
            borderRadius: '10px',
          }}
        />

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '4px',
            position: 'absolute',
            width: '238px',
            height: '29px',
            left: '6px',
            top: '3px',
          }}
        >
          
          <div
            style={{
              width: '141px',
              height: '29px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '115px',
                height: '29px',
                left: '-2px',
                top: '0px',
                background: '#2A3040',
                borderRadius: '9px',
              }}
            />
            
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                left: '22px',
                top: '6px',
              }}
            >
              <path
                d="M12 4V20M12 4L8 8M12 4L16 8"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                width: '50px',
                height: '20px',
                left: '43px',
                top: '4px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#FFFFFF',
              }}
            >
              Deposit
            </span>
          </div>

          
          <div
            style={{
              width: '94px',
              height: '29px',
              position: 'relative',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                left: '-9px',
                top: '5px',
                transform: 'rotate(-180deg)',
              }}
            >
              <path
                d="M12 4V20M12 4L8 8M12 4L16 8"
                stroke="#676D7A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                width: '64px',
                height: '20px',
                left: '15px',
                top: '4px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#676D7A',
              }}
            >
              Withdraw
            </span>
          </div>
        </div>
      </div>

      
      <span
        style={{
          position: 'absolute',
          width: '58px',
          height: '21px',
          left: '28px',
          top: '84px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '14px',
          lineHeight: '21px',
          color: '#FFFFFF',
        }}
      >
        Amount
      </span>

      
      <div
        style={{
          position: 'absolute',
          width: '536px',
          height: '36px',
          left: '25px',
          top: '111px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '536px',
            height: '47px',
            left: '0px',
            top: '0px',
            background: '#242937',
            borderRadius: '15px',
          }}
        />
        <img
          src="/assets/wallet/icon.svg"
          alt="Wallet"
          style={{
            position: 'absolute',
            width: '18px',
            height: '18px',
            left: '11.5px',
            top: '8px',
          }}
        />
        <span
          style={{
            position: 'absolute',
            width: '43px',
            height: '23px',
            left: '38px',
            top: '8px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '15px',
            lineHeight: '22px',
            color: '#9DA4B7',
          }}
        >
          $6.00
        </span>
      </div>

      
      <img
        src="/assets/wallet/wallets.svg"
        alt="Wallet"
        style={{
          position: 'absolute',
          width: '60px',
          height: '42px',
          left: '501px',
          top: '167px',
          filter: 'drop-shadow(0px 0px 19.5px rgba(255, 255, 255, 0.25))',
          borderRadius: '8px',
        }}
      />

      
      <span
        style={{
          position: 'absolute',
          width: '377px',
          height: '34px',
          left: '28px',
          top: '175px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '500',
          fontSize: '11px',
          lineHeight: '16px',
          color: '#5E6475',
        }}
      >
        All transactions are processed externally. We do not store any credit card information. All Purchases are final.
      </span>

      
      <div
        style={{
          position: 'absolute',
          width: '533px',
          height: '54px',
          left: '28px',
          top: '229px',
          background: '#0276FF',
          borderRadius: '15px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: '135.49px',
            height: '27px',
            left: '224.26px',
            top: '242.5px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '18px',
            lineHeight: '27px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Deposit $6.00
        </span>
      </div>
    </div>
  );
}
