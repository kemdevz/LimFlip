export default function Navbar() {
  return (
    <div
      className="absolute"
      style={{
        width: '1568px',
        height: '92px',
        left: '352px',
        top: '39px',
        background: '#191C25',
      }}
    >
      {/* Navigation items */}
      <div
        className="absolute"
        style={{
          left: '50px',
          top: '35px',
          display: 'flex',
          alignItems: 'center',
          gap: '50px',
        }}
      >
        {/* Coinflip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src="/assets/svg/navbar/coinflip.svg"
            alt="Coinflip"
            width={22}
            height={22}
          />
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontSize: '17px',
              lineHeight: '17px',
              color: '#286DFF',
              fontWeight: '700',
            }}
          >
            Coinflip
          </span>
        </div>

        {/* Dice Duel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src="/assets/svg/navbar/dice.svg"
            alt="Dice"
            width={21}
            height={21}
          />
          <span
            style={{
              fontFamily: 'Proxima Nova, sans-serif',
              fontSize: '17px',
              lineHeight: '17px',
              color: '#4C526B',
              fontWeight: '700',
            }}
          >
            Dice Duel
          </span>
        </div>

        {/* Jackpot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <img
            src="/assets/svg/navbar/jackpot.svg"
            alt="Jackpot"
            width={17}
            height={17}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                fontFamily: 'Proxima Nova, sans-serif',
                fontSize: '17px',
                lineHeight: '17px',
                color: '#4C526B',
                fontWeight: '700',
              }}
            >
              Jackpot
            </span>
            <span
              style={{
                fontFamily: 'Proxima Nova, sans-serif',
                fontSize: '15px',
                lineHeight: '15px',
                color: '#286DFF',
                fontWeight: '700',
              }}
            >
              R$3.2k
            </span>
          </div>
        </div>
      </div>

      {/* Sign Up button */}
      <div
        className="absolute"
        style={{
          width: '159px',
          height: '50px',
          left: '1259px',
          top: '21px',
          background: '#006EFF',
          borderRadius: '13px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: '66px',
            height: '26px',
            left: '48px',
            top: '11px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '17px',
            lineHeight: '26px',
            color: '#FFFFFF',
            fontWeight: '600',
          }}
        >
          Sign Up
        </span>
      </div>

      {/* Log In button */}
      <div
        className="absolute"
        style={{
          width: '159px',
          height: '50px',
          left: '1070px',
          top: '21px',
          background: '#242737',
          borderRadius: '13px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: '51px',
            height: '26px',
            left: '54px',
            top: '11px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '17px',
            lineHeight: '26px',
            color: '#4A4F6F',
            fontWeight: '600',
          }}
        >
          Log In
        </span>
      </div>
    </div>
  );
}
