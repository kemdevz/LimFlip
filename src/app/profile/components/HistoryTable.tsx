export default function HistoryTable() {
  return (
    <div
      className="history-table hide-scrollbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '16px',
        width: '100%',
        marginTop: '20px',
        overflowX: 'auto',
      }}
    >
      
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '0px 24px',
          width: '100%',
          height: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '10px',
            width: '320px',
            height: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '16px',
              color: '#666D7E',
            }}
          >
            Game
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '10px',
            width: '320px',
            height: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '16px',
              color: '#666D7E',
            }}
          >
            User
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '10px',
            width: '268.33px',
            height: '16px',
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '16px',
              color: '#666D7E',
            }}
          >
            Wager
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '10px',
            width: '268.33px',
            height: '16px',
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '16px',
              color: '#666D7E',
            }}
          >
            Multiplier
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0px',
            gap: '10px',
            width: '268.33px',
            height: '16px',
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '16px',
              color: '#666D7E',
            }}
          >
            Payout
          </span>
        </div>
      </div>

      
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '12px 16px',
            width: '100%',
            height: index % 2 === 1 ? '61px' : '58px',
            background: index % 2 === 1 ? '#161A26' : 'transparent',
            borderRadius: '12px',
          }}
        >
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '12px',
              width: '320px',
              height: '37px',
            }}
          >
            <img
              src="/assets/profile/coinflip.svg"
              alt="Coinflip"
              style={{
                width: '34px',
                height: '34px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '5px',
                width: '71px',
                height: '37px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Proxima Nova, Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '16px',
                  color: '#898C94',
                }}
              >
                Coinflip
              </span>
              <span
                style={{
                  fontFamily: 'Proxima Nova, Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '16px',
                  color: '#FFFFFF',
                }}
              >
                08:47
              </span>
            </div>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '10px',
              width: '320px',
              height: '30px',
            }}
          >
            <img
              src="/assets/images/coinflip/item_1side.png"
              alt="Avatar"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '25px',
              }}
            />
            <span
              style={{
                fontFamily: 'Proxima Nova, Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '16px',
                color: '#BABFD5',
              }}
            >
              Anonymous
            </span>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '6px',
              width: '273.67px',
              height: '18px',
              flex: 1,
            }}
          >
            <img
              src="/assets/profile/wallet.svg"
              alt="Wager"
              style={{
                width: '22px',
                height: '18px',
              }}
            />
            <span
              style={{
                fontFamily: 'Proxima Nova, Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '16px',
                color: '#BABFD5',
              }}
            >
              R$32.00
            </span>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '10px',
              width: '273.67px',
              height: '32px',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px',
                gap: '10px',
                width: '58px',
                height: '32px',
                background: 'rgba(199, 125, 255, 0.11)',
                borderRadius: '24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Proxima Nova, Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '15px',
                  lineHeight: '16px',
                  color: '#C77DFF',
                }}
              >
                {index % 2 === 1 ? '0.00x' : '2.00x'}
              </span>
            </div>
          </div>

          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '0px',
              gap: '6px',
              width: '273.67px',
              height: '20px',
              flex: 1,
            }}
          >
            <img
              src="/assets/profile/payout.svg"
              alt="Payout"
              style={{
                width: '20px',
                height: '20px',
              }}
            />
            <span
              style={{
                fontFamily: 'Proxima Nova, Poppins, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '16px',
                color: '#C77DFF',
              }}
            >
              160.00
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
