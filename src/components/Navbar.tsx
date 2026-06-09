interface NavbarProps {
  onSignUpClick?: () => void;
  onLogInClick?: () => void;
  onCoinflipClick?: () => void;
  onDiceDuelClick?: () => void;
  onJackpotClick?: () => void;
}

export default function Navbar({ onSignUpClick, onLogInClick, onCoinflipClick, onDiceDuelClick, onJackpotClick }: NavbarProps) {
  return (
    <div
      className="absolute"
      style={{
        width: 'calc(100vw - min(22vw, 352px))',
        height: 'min(8vh, 92px)',
        left: 'min(22vw, 352px)',
        top: 'min(3.5vh, 39px)',
        background: '#191C25',
      }}
    >
      {/* Navigation items */}
      <div
        className="absolute"
        style={{
          left: 'min(3vw, 50px)',
          top: 'min(2.5vh, 35px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'min(3vw, 50px)',
        }}
      >
        {/* Coinflip */}
        <div
          onClick={onCoinflipClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
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
              fontSize: 'min(1.3vw, 17px)',
              lineHeight: '1',
              color: '#286DFF',
              fontWeight: '700',
            }}
          >
            Coinflip
          </span>
        </div>

        {/* Dice Duel */}
        <div
          onClick={onDiceDuelClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
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
          onClick={onJackpotClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
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
        onClick={onSignUpClick}
        style={{
          width: 'min(10vw, 159px)',
          height: 'min(4.5vh, 50px)',
          right: 'min(2vw, 20px)',
          top: 'min(2vh, 21px)',
          background: '#006EFF',
          borderRadius: '13px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'min(1.3vw, 17px)',
            lineHeight: '1',
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
        onClick={onLogInClick}
        style={{
          width: 'min(10vw, 159px)',
          height: 'min(4.5vh, 50px)',
          right: 'min(16vw, 200px)',
          top: 'min(2vh, 21px)',
          background: '#242737',
          borderRadius: '13px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'min(1.3vw, 17px)',
            lineHeight: '1',
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
