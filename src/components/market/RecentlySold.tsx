'use client';

export default function RecentlySold() {
  const items = [
    {
      price: '21.35 $',
      timeAgo: '12s ago',
      game: 'MM2',
      itemName: 'Chroma Waves',
      itemImage: '/assets/images/market/item1.png',
    },
    {
      price: '21.35 $',
      timeAgo: '12s ago',
      game: 'MM2',
      itemName: 'Gingerscope',
      itemImage: '/assets/images/market/item2.png',
    },
    {
      price: '21.35 $',
      timeAgo: '12s ago',
      game: 'MM2',
      itemName: 'Gingerscope',
      itemImage: '/assets/images/market/item3.png',
    },
    {
      price: '21.35 $',
      timeAgo: '12s ago',
      game: 'MM2',
      itemName: 'Chroma Dark..',
      itemImage: '/assets/images/market/item4.png',
    },
    {
      price: '21.35 $',
      timeAgo: '12s ago',
      game: 'MM2',
      itemName: 'Luger',
      itemImage: '/assets/images/market/item5.png',
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 'calc(min(22vw, 352px) + 20px)',
        top: 'calc(min(3.5vh, 39px) + min(8vh, 92px) + 20px + 80px)',
        marginBottom: '8px',
        marginLeft: '26px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: '15px',
          marginLeft: '4px',
          marginRight: '21px',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          Recently Sold
        </span>
        <div style={{ flex: 1 }} />
        <img
          src="/assets/svg/ui/arrow-left.svg"
          alt="Arrow Left"
          style={{
            width: '7px',
            height: '12px',
            marginRight: '17px',
          }}
        />
        <img
          src="/assets/svg/ui/arrow-right.svg"
          alt="Arrow Right"
          style={{
            width: '7px',
            height: '12px',
          }}
        />
      </div>

      {/* Items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: '42px',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#1E2434',
              borderRadius: '15px',
              padding: '8px 11px',
              marginRight: index < items.length - 1 ? '12px' : '0',
              boxShadow: '0px 4px 56px rgba(0, 0, 0, 0.08)',
              position: 'relative',
            }}
          >
            {/* Price and time */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: '18px',
              }}
            >
              <span
                style={{
                  color: '#4C526B',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '45px',
                }}
              >
                {item.price}
              </span>
              <span
                style={{
                  color: '#4C526B',
                  fontSize: '8px',
                  fontWeight: 'bold',
                }}
              >
                {item.timeAgo}
              </span>
            </div>

            {/* Item image */}
            <img
              src={item.itemImage}
              alt={item.itemName}
              style={{
                width: '55px',
                height: '55px',
                marginRight: '31px',
              }}
            />

            {/* Game name */}
            <span
              style={{
                color: '#4C526B',
                fontSize: '8px',
                fontWeight: 'bold',
              }}
            >
              {item.game}
            </span>

            {/* Item name */}
            <span
              style={{
                position: 'absolute',
                bottom: '23px',
                left: '11px',
                color: '#F5F5F5',
                fontSize: '9px',
                fontWeight: 'bold',
              }}
            >
              {item.itemName}
            </span>

            {/* Platform branding - left */}
            <span
              style={{
                position: 'absolute',
                top: '29px',
                left: '42px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              blox
            </span>

            {/* Platform branding - right */}
            <span
              style={{
                position: 'absolute',
                top: '29px',
                right: '41px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              bash
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
