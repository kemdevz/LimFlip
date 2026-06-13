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
        width: '47.55px',
        height: '46.58px',
        left: '292px',
        bottom: '10px',
        opacity: 0.44,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '47.55px',
          height: '47.55px',
          left: '0px',
          top: '-0.97px',
          background: '#1F232F',
          borderRadius: '10.6755px',
        }}
      />
      <img
        src="/assets/svg/chat/send.svg"
        alt="Send"
        style={{
          position: 'absolute',
          left: '31.54%',
          right: '30.72%',
          top: '30.68%',
          bottom: '32.12%',
          width: '18px',
          height: '18px',
        }}
      />
    </div>
  );
}
