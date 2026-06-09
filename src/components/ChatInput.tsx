export default function ChatInput() {
  return (
    <div
      className="absolute"
      style={{
        width: 'min(85%, 298px)',
        height: 'min(4vh, 46px)',
        left: '0px',
        bottom: 'min(8vh, 90px)',
      }}
    >
      <div
        style={{
          width: 'min(96%, 287px)',
          height: 'min(3.8vh, 41px)',
          left: 'min(2%, 5px)',
          top: '0px',
          border: '1px solid #33394B',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
      <span
        style={{
          position: 'absolute',
          width: 'auto',
          height: 'auto',
          left: 'min(8%, 23px)',
          top: 'min(1vh, 12px)',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'min(1.1vw, 14px)',
          lineHeight: '1.5',
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
          right: 'min(3%, 10px)',
          top: 'min(1vh, 11px)',
          width: 'min(1.5vw, 19px)',
          height: 'min(1.5vw, 19px)',
        }}
      />
      </div>
    </div>
  );
}
