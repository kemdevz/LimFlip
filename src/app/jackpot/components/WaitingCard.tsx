export default function WaitingCard() {
  return (
    <div
      style={{
        position: 'relative',
        width: '203px',
        height: '234px',
        filter: 'drop-shadow(0px 6px 4px rgba(0, 0, 0, 0.53))',
        borderRadius: '15px',
      }}
    >
      
      <div
        style={{
          position: 'absolute',
          width: '203px',
          height: '234px',
          left: '0px',
          top: '0px',
          border: '3px solid transparent',
          borderRadius: '15px',
          background: 'linear-gradient(to bottom, #72788B 66%, #000000 100%) border-box',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          width: '197px',
          height: '228px',
          left: '3px',
          top: '3px',
          borderRadius: '12px',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            width: '197px',
            height: '228px',
            left: '0px',
            top: '0px',
            background: 'url(/assets/jackpot/grid.png), linear-gradient(180deg, #202431 0%, #272B38 100%)',
            backgroundSize: 'cover',
            border: '1px solid #1B1F2D',
            borderRadius: '12px',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            width: '109px',
            height: '34px',
            left: '44px',
            top: '227px',
            background: '#0276FF',
            opacity: 0.44,
            filter: 'blur(49.5px)',
            zIndex: 1,
          }}
        />
      
      <div
        style={{
          position: 'absolute',
          width: '84px',
          height: '84px',
          left: '57px',
          top: '18px',
          border: '1.2px solid #50576A',
          borderRadius: '112px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '84px',
            height: '84px',
            left: '0px',
            top: '0px',
            background: '#131621',
            borderRadius: '51px',
          }}
        />
        <img
          src="/assets/jackpot/waiting.png"
          alt="Waiting"
          style={{
            position: 'absolute',
            width: '84px',
            height: '84px',
            left: '0px',
            top: '0px',
            borderRadius: '51px',
          }}
        />
      </div>
      
      <span
        style={{
          position: 'absolute',
          width: '109px',
          height: '26px',
          left: '44px',
          top: '133px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '17px',
          lineHeight: '26px',
          textAlign: 'center',
          color: '#FFFFFF',
        }}
      >
        Waiting...
      </span>
      
      <div
        style={{
          position: 'absolute',
          width: '142px',
          height: '32px',
          left: '28px',
          top: '167px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '142px',
            height: '32px',
            left: '0px',
            top: '0px',
            background: 'linear-gradient(180deg, #363D51 0%, #2B3245 100%)',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
            borderRadius: '9px',
          }}
        />
        <img
          src="/assets/svg/navbar/wallet.svg"
          alt="Wallet"
          style={{
            position: 'absolute',
            left: '29px',
            top: '8px',
            width: '16px',
            height: '13px',
          }}
        />
        <span
          style={{
            position: 'absolute',
            width: '66px',
            height: '23px',
            left: '54px',
            top: '4px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '22px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          B$0.00
        </span>
      </div>
      </div>
    </div>
  );
}
