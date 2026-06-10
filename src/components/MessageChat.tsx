interface MessageChatProps {
  username?: string;
  message?: string;
  time?: string;
  avatarUrl?: string;
  isWhale?: boolean;
}

export default function MessageChat({
  username = 'jakep',
  message = 'i gambled my life savings, and won. thank you bloxybet. now im a whale.',
  time = '15:24',
  avatarUrl,
  isWhale = true,
}: MessageChatProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '10px 14px',
        position: 'relative',
        width: '333px',
        minHeight: '81px',
        height: 'auto',
        borderRadius: '20px',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          position: 'absolute',
          width: '29px',
          height: '29px',
          left: '-6px',
          top: '-14px',
        }}
      >
        <div
          style={{
            boxSizing: 'border-box',
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '0px',
            bottom: '0px',
            border: '2px solid #464A58',
            borderRadius: '65px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '19px',
            height: '19px',
            left: '5px',
            top: '5px',
            background: avatarUrl ? `url(${avatarUrl})` : '#464A58',
            borderRadius: '43px',
            backgroundSize: 'cover',
          }}
        />
      </div>

      {/* Content frame */}
      <div
        style={{
          position: 'absolute',
          width: '239px',
          minHeight: '76px',
          height: 'auto',
          left: '33px',
          top: '-18px',
        }}
      >
        {/* Username row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '12px',
            position: 'absolute',
            width: '239px',
            height: '24px',
            left: '-1px',
            top: '5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '5px',
              width: '239px',
              height: '24px',
              flex: 'none',
              order: 0,
              flexGrow: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px',
                gap: '6px',
                width: '69px',
                height: '24px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
              }}
            >
              <span
                style={{
                  width: '46px',
                  height: '24px',
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: isWhale ? '#006EFF' : '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                }}
              >
                {username}
              </span>
              {isWhale && (
                <img
                  src="/whale.svg"
                  alt="whale"
                  style={{
                    width: '17px',
                    height: '17px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Message text */}
        <div
          style={{
            position: 'absolute',
            width: '321px',
            minHeight: '46px',
            height: 'auto',
            left: '-36px',
            top: '36px',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '150%',
            color: '#787A8B',
          }}
        >
          {message}
        </div>
      </div>

      {/* Timestamp */}
      <div
        style={{
          position: 'absolute',
          width: '36px',
          height: '21px',
          left: '282px',
          top: '-12px',
          fontFamily: 'Poppins, sans-serif',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '21px',
          color: '#464A58',
        }}
      >
        {time}
      </div>
    </div>
  );
}
