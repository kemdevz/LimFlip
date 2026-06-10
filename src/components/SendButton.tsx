'use client';

interface SendButtonProps {
  onSend: () => void;
}

export default function SendButton({ onSend }: SendButtonProps) {
  return (
    <div
      className="absolute"
      onClick={onSend}
      style={{
        width: 'min(3.8vh, 41px)',
        height: 'min(3.8vh, 41px)',
        left: 'min(85%, 310px)',
        bottom: 'min(8vh, 100px)',
        background: '#33394B',
        borderRadius: '11px',
        cursor: 'pointer',
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
          left: 'min(32%, 13px)',
          top: 'min(1vh, 11px)',
          width: 'min(1.5vw, 19px)',
          height: 'min(1.5vw, 19px)',
        }}
      />
    </div>
  );
}
