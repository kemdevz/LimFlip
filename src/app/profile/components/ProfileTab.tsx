export default function ProfileTab() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '18px',
        width: '100%',
        marginTop: '20px',
      }}
    >
      
      <div
        style={{
          position: 'relative',
          flex: 1,
          background: '#191D29',
          borderRadius: '15px',
          padding: '21px',
          minWidth: '0',
        }}
      >
        
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '22px',
            lineHeight: '33px',
            color: '#FFFFFF',
            display: 'block',
            marginBottom: '20px',
          }}
        >
          Profile
        </span>

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <img
            src="/assets/images/coinflip/item_1side.png"
            alt="Avatar"
            style={{
              width: '94px',
              height: '94px',
              borderRadius: '69px',
            }}
          />
          <div>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '22px',
                lineHeight: '33px',
                color: '#FFFFFF',
                display: 'block',
              }}
            >
              @justjakep
            </span>
          </div>
        </div>

        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              Username
            </span>
            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                height: '50px',
                border: '1px solid #333845',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#717991',
                }}
              >
                jakep
              </span>
            </div>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#5B6172',
                display: 'block',
              }}
            >
              Access your profile at https://MM2Stake.com/profile/justjakep
            </span>
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '36px',
              }}
            >
              <div
                style={{
                  width: '73px',
                  height: '34px',
                  background: '#C77DFF',
                  borderRadius: '15px',
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
                    fontSize: '15px',
                    lineHeight: '22px',
                    color: '#FFFFFF',
                  }}
                >
                  Save
                </span>
              </div>
            </div>
          </div>

          
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '22px',
                color: '#FFFFFF',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              Email
            </span>
            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                height: '50px',
                border: '1px solid #333845',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#717991',
                }}
              >
                j***p@MM2Stake.com
              </span>
            </div>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#5B6172',
                display: 'block',
              }}
            >
              Once your email is set you cant change it.
            </span>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '22px',
                lineHeight: '33px',
                color: '#FFFFFF',
              }}
            >
              Change Password
            </span>

            
            <div>
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#FFFFFF',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                New Password
              </span>
              <div
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '50px',
                  border: '1px solid #333845',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#555F76',
                  }}
                >
                  New Password
                </span>
              </div>
            </div>

            
            <div>
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '22px',
                  color: '#FFFFFF',
                  display: 'block',
                  marginBottom: '9px',
                }}
              >
                Confirm Password
              </span>
              <div
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '50px',
                  border: '1px solid #333845',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#555F76',
                  }}
                >
                  Confirm Password
                </span>
              </div>
            </div>
          </div>
        </div>

        
        <div
          style={{
            width: '100%',
            height: '57px',
            background: '#C77DFF',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '17px',
              lineHeight: '26px',
              color: '#FFFFFF',
            }}
          >
            Save
          </span>
        </div>
      </div>

      
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          flex: 1,
          minWidth: '0',
        }}
      >
        
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#191D29',
            borderRadius: '15px',
            padding: '22px',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '33px',
              color: '#FFFFFF',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Connections
          </span>
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#4C5468',
              display: 'block',
              marginBottom: '20px',
            }}
          >
            Connect your account to various platforms to unlock perks like discord, and roblox.
          </span>
          <div
            style={{
              width: '100%',
              height: '57px',
              background: '#C77DFF',
              borderRadius: '15px',
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
                fontSize: '17px',
                lineHeight: '26px',
                color: '#FFFFFF',
              }}
            >
              Go-to Linking
            </span>
          </div>
        </div>

        
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#191D29',
            borderRadius: '15px',
            padding: '22px',
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '33px',
              color: '#FFFFFF',
              display: 'block',
              marginBottom: '20px',
            }}
          >
            Two Factor Authentication
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#4C5468',
              }}
            >
              Enable two-factor authentication and add an extra level of security to your bloxshop account.
            </span>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#4C5468',
              }}
            >
              By enabling this feature you are responsible for keeping backup codes in-case of loss of access to the application.
            </span>
            <span
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '17px',
                lineHeight: '26px',
                color: '#4C5468',
              }}
            >
              Two Factor can be setup using any authenticator app with ease, simply click the enable 2fa button to start the process.
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '57px',
              background: '#252B3C',
              borderRadius: '15px',
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
                fontSize: '16px',
                lineHeight: '24px',
                color: '#5F687E',
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
