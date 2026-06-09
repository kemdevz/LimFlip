import MessageChat from './MessageChat';
import ChatInput from './ChatInput';
import SendButton from './SendButton';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div
      className="absolute"
      style={{
        width: 'min(22vw, 352px)',
        height: '100vh',
        left: '0px',
        top: '0px',
        background: '#161922',
      }}
    >
      {/* Top left header */}
      <div
        className="absolute"
        style={{
          width: '100%',
          height: 'min(12vh, 132px)',
          left: '0px',
          top: '0px',
          background: '#111318',
        }}
      >
        {/* Logo container */}
        <Link href="/">
          <div
            className="absolute"
            style={{
              width: 'min(85%, 300px)',
              height: 'min(12vh, 162px)',
              left: 'min(7%, 20px)',
              top: 'min(1vh, -2px)',
              cursor: 'pointer',
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
        </Link>

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

      {/* Chat messages area */}
      <div
        className="absolute"
        style={{
          width: '100%',
          height: 'calc(100vh - min(12vh, 132px) - min(13vh, 136px))',
          left: '0px',
          top: 'min(12vh, 132px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
          <MessageChat
            username="jakep"
            message="i gambled my life savings, and won. thank you bloxybet. now im a whale."
            time="15:24"
            avatarUrl="/PFPJAKEP.png"
            isWhale={true}
          />
        </div>
      </div>

      {/* Chat input */}
      <ChatInput />
      <SendButton />
    </div>
  );
}
