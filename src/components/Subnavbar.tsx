export default function Subnavbar() {
  return (
    <div
      className="absolute"
      style={{
        width: '1568px',
        height: '39px',
        left: '352px',
        top: '0px',
        background: '#14161D',
      }}
    >
      {/* Navigation links */}
      <div
        className="absolute"
        style={{
          width: '431px',
          height: '15px',
          left: '20px',
          top: '11px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Terms of Service
        </span>
        <span
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Support
        </span>
        <span
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Provably Fair
        </span>
        <span
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            color: '#313749',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Frequently Asked
        </span>
        <span
          style={{
            fontFamily: 'Proxima Nova, sans-serif',
            fontSize: '14px',
            lineHeight: '17px',
            color: '#006EFF',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          Affiliates
        </span>
      </div>

      {/* Right side elements */}
      <div
        className="absolute"
        style={{
          right: '140px',
          top: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Social icons */}
        <div
          style={{
            display: 'flex',
            gap: '7px',
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
              fontSize: '11.25px',
              lineHeight: '18px',
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
