interface SubnavbarProps {
  onTermsClick?: () => void;
  onSupportClick?: () => void;
  onProvablyFairClick?: () => void;
  onFaqClick?: () => void;
  onAffiliatesClick?: () => void;
}

export default function Subnavbar({ onTermsClick, onSupportClick, onProvablyFairClick, onFaqClick, onAffiliatesClick }: SubnavbarProps) {
  return (
    <div
      className="absolute"
      style={{
        width: 'calc(100vw - min(22vw, 352px))',
        height: 'min(3.5vh, 39px)',
        left: 'min(22vw, 352px)',
        top: '0px',
        background: '#14161D',
      }}
    >
      {/* Navigation links */}
      <div
        className="absolute"
        style={{
          width: 'auto',
          height: 'auto',
          left: 'min(1.5vw, 20px)',
          top: 'min(1vh, 11px)',
          display: 'flex',
          gap: 'min(1vw, 14px)',
          alignItems: 'center',
        }}
      >
        <span
          onClick={onTermsClick}
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 'min(1vw, 14px)',
            lineHeight: '1.2',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Terms of Service
        </span>
        <span
          onClick={onSupportClick}
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 'min(1vw, 14px)',
            lineHeight: '1.2',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Support
        </span>
        <span
          onClick={onProvablyFairClick}
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 'min(1vw, 14px)',
            lineHeight: '1.2',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Provably Fair
        </span>
        <span
          onClick={onFaqClick}
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 'min(1vw, 14px)',
            lineHeight: '1.2',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Frequently Asked
        </span>
        <span
          onClick={onAffiliatesClick}
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: 'min(1vw, 14px)',
            lineHeight: '1.2',
            color: '#006EFF',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Affiliates
        </span>
      </div>

      {/* Right side elements */}
      <div
        className="absolute"
        style={{
          right: 'min(2vw, 20px)',
          top: 'min(1vh, 11px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'min(0.5vw, 8px)',
        }}
      >
        {/* Social icons */}
        <div
          style={{
            display: 'flex',
            gap: 'min(0.5vw, 7px)',
          }}
        >
          <img
            src="/assets/svg/twitter.svg"
            alt="Twitter"
            width={16}
            height={13}
          />
          <img
            src="/assets/svg/discord.svg"
            alt="Discord"
            width={16}
            height={13}
          />
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '17px',
            background: '#313749',
          }}
        />

        {/* Balance display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <img
            src="/assets/svg/online.svg"
            alt="Online"
            width={18}
            height={18}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'min(0.9vw, 11.25px)',
              lineHeight: '1.5',
              color: '#006EFF',
              fontWeight: '700',
            }}
          >
            327
          </span>
        </div>
      </div>
    </div>
  );
}
