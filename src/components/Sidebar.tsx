import MessageChat from './MessageChat';

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
        <div
          className="absolute"
          style={{
            width: 'min(85%, 300px)',
            height: 'min(12vh, 162px)',
            left: 'min(7%, 26px)',
            top: 'min(-1vh, -15px)',
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
      <div
        className="absolute"
        style={{
          width: 'min(85%, 298px)',
          height: 'min(4vh, 46px)',
          left: '0px',
          bottom: 'min(8vh, 90px)',
        }}
      >
        {/* Input box */}
        <div
          className="absolute"
          style={{
            width: 'min(96%, 287px)',
            height: 'min(3.8vh, 41px)',
            left: 'min(2%, 5px)',
            top: '0px',
            border: '1px solid #33394B',
            borderRadius: '8px',
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

        {/* Send button */}
        <div
          className="absolute"
          style={{
            width: 'min(3.8vh, 41px)',
            height: 'min(3.8vh, 41px)',
            left: 'min(86%, 303px)',
            top: 'min(-0.1vh, -1px)',
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
              left: 'min(32%, 13px)',
              top: 'min(1vh, 11px)',
              width: 'min(1.5vw, 19px)',
              height: 'min(1.5vw, 19px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
