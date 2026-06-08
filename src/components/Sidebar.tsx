export default function Sidebar() {
  return (
    <div
      className="absolute"
      style={{
        width: '352px',
        height: '1080px',
        left: '0px',
        top: '0px',
        background: '#161922',
      }}
    >
      {/* Top left header */}
      <div
        className="absolute"
        style={{
          width: '352px',
          height: '132px',
          left: '0px',
          top: '0px',
          background: '#111318',
        }}
      >
        {/* Logo container */}
        <div
          className="absolute"
          style={{
            width: '300px',
            height: '162px',
            left: '26px',
            top: '-15px',
          }}
        >
          <img
            src="/logo.svg"
            alt="bloxbash logo"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Blur effect */}
        <div
          className="absolute"
          style={{
            width: '276px',
            height: '65px',
            left: '13.5px',
            top: '-37px',
            background: 'rgba(2, 118, 255, 0.22)',
            filter: 'blur(45.65px)',
            borderRadius: '66px',
          }}
        />
      </div>

      {/* Chat input */}
      <div
        className="absolute"
        style={{
          width: '298px',
          height: '46px',
          left: '0px',
          bottom: '90px',
        }}
      >
        {/* Input box */}
        <div
          className="absolute"
          style={{
            width: '287px',
            height: '41px',
            left: '5px',
            top: '0px',
            border: '1px solid #33394B',
            borderRadius: '8px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '126px',
              height: '21px',
              left: '23px',
              top: '12px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              lineHeight: '21px',
              color: '#33394B',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Write something..
          </span>

          {/* Emoji icon */}
          <img
            src="/assets/svg/emoji.svg"
            alt="Emoji"
            width={19}
            height={19}
            style={{
              position: 'absolute',
              right: '10px',
              top: '11px',
            }}
          />
        </div>

        {/* Send button */}
        <div
          className="absolute"
          style={{
            width: '41px',
            height: '41px',
            left: '303px',
            top: '-1px',
            background: '#33394B',
            borderRadius: '11px',
          }}
        >
          {/* Send icon */}
          <img
            src="/assets/svg/send.svg"
            alt="Send"
            width={19}
            height={19}
            style={{
              position: 'absolute',
              left: '13px',
              top: '11px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
