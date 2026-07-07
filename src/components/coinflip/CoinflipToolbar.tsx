'use client';

interface CoinflipToolbarProps {
  onBetItemsClick?: () => void;
}

export default function CoinflipToolbar({ onBetItemsClick }: CoinflipToolbarProps) {
  return (
    <div className="coinflip-toolbar">
      <div
        style={{
          width: '246px',
          height: '44px',
          background: '#191D29',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
        }}
      >
        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '18px', color: '#006EFF', marginRight: '10px' }}>$</span>
        <input
          type="text"
          placeholder="Enter bet amount ..."
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: '16px',
            color: '#525D7D',
            background: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        style={{
          minWidth: '121px',
          height: '42px',
          background: '#0276FF',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Proxima Nova, sans-serif',
          fontWeight: 700,
          fontSize: '17px',
          color: '#FFFFFF',
          padding: '0 16px',
        }}
      >
        PLACE BET
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <img src="/assets/images/coinflip/heads.png" alt="Heads" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
        <img src="/assets/images/coinflip/tails.png" alt="Tails" style={{ width: '42px', height: '42px', cursor: 'pointer' }} />
      </div>

      {/* Divider */}
      <img
        src="/assets/svg/ui/divider.svg"
        alt="Divider"
        style={{
          width: '3px',
          height: '29px',
          margin: '0 10px',
        }}
      />

      <button
        type="button"
        onClick={onBetItemsClick}
        style={{
          minWidth: '121px',
          height: '42px',
          background: '#0276FF',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Proxima Nova, sans-serif',
          fontWeight: 700,
          fontSize: '17px',
          color: '#FFFFFF',
          padding: '0 16px',
        }}
      >
        BET ITEMS
      </button>

      <div className="coinflip-toolbar__stats" style={{ marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src="/assets/svg/home/dice.svg" alt="Players" style={{ width: '27px', height: '22px' }} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#FFFFFF' }}>36</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src="/assets/svg/home/wallet.svg" alt="Total Bets" style={{ width: '20px', height: '16px' }} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#0276FF' }}>R$1.59m</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <img src="/assets/svg/home/wallet.svg" alt="Your Bets" style={{ width: '20px', height: '16px' }} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '18px', color: '#0276FF' }}>$56.13</span>
        </div>
      </div>

      <div className="coinflip-toolbar__sort">
        <div
          style={{
            width: '253px',
            maxWidth: '100%',
            height: '42px',
            boxSizing: 'border-box',
            border: '1px solid #333845',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 15px',
            cursor: 'pointer',
          }}
        >
          <img src="/assets/svg/home/down.svg" alt="Sort" style={{ width: '19px', height: '14px', marginRight: '10px' }} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '15px', color: '#FFFFFF', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Price sort high to low
          </span>
          <img src="/assets/svg/home/arrow.svg" alt="Sort" style={{ width: '17px', height: '9px', marginLeft: '8px' }} />
        </div>
      </div>
    </div>
  );
}
