interface ProfileHeaderProps {
  user: any;
  isMobile: boolean;
}

export default function ProfileHeader({ user, isMobile }: ProfileHeaderProps) {
  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? 'auto' : '191px',
          borderRadius: '15px',
          padding: isMobile ? '20px' : '0',
        }}
      >
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '120px',
            height: isMobile ? 'auto' : '120px',
            left: isMobile ? '0' : '0px',
            top: isMobile ? '0' : '0px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: isMobile ? '20px' : '0',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              border: '1.71429px solid #1D2339',
              borderRadius: '161.143px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: 'calc(100% - 3.42858px)',
                height: 'calc(100% - 3.42858px)',
                left: '1.71429px',
                top: '1.71429px',
                background: user?.avatarUrl ? `url(${user.avatarUrl})` : `url(/assets/images/coinflip/item_1side.png), #131621`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '73.7143px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '128px',
            height: isMobile ? 'auto' : '33px',
            left: isMobile ? '0' : '144px',
            top: isMobile ? '0' : '36px',
            marginBottom: isMobile ? '20px' : '0',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '22px',
              lineHeight: '33px',
              color: '#FFFFFF',
            }}
          >
            @{user.username || 'justjakep'}
          </span>
        </div>

        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              width: '216px',
              height: '51px',
              right: '0px',
              top: '26px',
              background: '#0276FF',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '27px',
                color: '#FFFFFF',
              }}
            >
              Tip
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            gap: isMobile ? '20px' : '0',
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '100%',
            height: isMobile ? 'auto' : '46px',
            left: isMobile ? '0' : '0',
            top: isMobile ? '0' : '145px',
            padding: isMobile ? '20px 0 0 0' : '0',
          }}
        >
          <div
            style={{
              width: '167px',
              height: '43px',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '30px',
                left: '0px',
                top: '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              152*****63
            </span>
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '24px',
                left: '1px',
                top: '27px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#484C63',
              }}
            >
              USER ID
            </span>
          </div>

          <div
            style={{
              width: '195px',
              height: '46px',
              position: 'relative',
            }}
          >
            <img
              src="/assets/profile/wallet.svg"
              alt="Total Bet"
              style={{
                position: 'absolute',
                width: '22px',
                height: '18px',
                left: '0px',
                top: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '30px',
                left: '29px',
                top: '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              R$50.000
            </span>
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '24px',
                left: '0px',
                top: '28px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#484C63',
              }}
            >
              TOTAL BET
            </span>
          </div>

          <div
            style={{
              width: '195px',
              height: '44px',
              position: 'relative',
            }}
          >
            <img
              src="/assets/profile/wallet.svg"
              alt="Total Profit"
              style={{
                position: 'absolute',
                width: '22px',
                height: '18px',
                left: '0px',
                top: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '30px',
                left: '29px',
                top: '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              R$50.000
            </span>
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '24px',
                left: '0px',
                top: '28px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#484C63',
              }}
            >
              TOTAL PROFIT
            </span>
          </div>

          <div
            style={{
              width: '195px',
              height: '44px',
              position: 'relative',
            }}
          >
            <img
              src="/assets/profile/wallet.svg"
              alt="Total Won"
              style={{
                position: 'absolute',
                width: '22px',
                height: '18px',
                left: '0px',
                top: '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '30px',
                left: '29px',
                top: '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '30px',
                color: '#FFFFFF',
              }}
            >
              R$50.000
            </span>
            <span
              style={{
                position: 'absolute',
                width: '166px',
                height: '24px',
                left: '0px',
                top: '28px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#484C63',
              }}
            >
              TOTAL WON
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '1px',
          background: '#262937',
          marginTop: '20px',
        }}
      />
    </>
  );
}
