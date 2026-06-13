'use client';

interface CoinflipItemCardProps {
  imageSrc: string;
  itemName?: string;
  itemValue?: string;
}

export default function CoinflipItemCard({ imageSrc, itemName = 'Gingerscope', itemValue = 'B$43.8K' }: CoinflipItemCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '159.29px',
        height: '203.81px',
        borderRadius: '7.91501px',
        flex: 'none',
        order: 0,
        flexGrow: 0,
      }}
    >
      {/* Frame 2131329028 - Image card with logo */}
      <div
        style={{
          position: 'absolute',
          width: '152.36px',
          height: '152.36px',
          left: '4.95px',
          top: '3.96px',
          borderRadius: '14.8406px',
        }}
      >
        {/* Background Rectangle */}
        <div
          style={{
            position: 'absolute',
            width: '152.36px',
            height: '152.36px',
            left: '0px',
            top: '0px',
            background: '#11151D',
            borderRadius: '14.8406px',
          }}
        />

        {/* Blurred Image */}
        <div
          style={{
            position: 'absolute',
            width: '124.53px',
            height: '124.53px',
            left: '11.94px',
            top: '20.84px',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(31.0169px)',
            borderRadius: '8px',
          }}
        />

        {/* Sharp Image */}
        <div
          style={{
            position: 'absolute',
            width: '124.66px',
            height: '124.66px',
            left: '12.86px',
            top: '17.81px',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
          }}
        />

        {/* Logo image */}
        <img
          src="/assets/svg/ui/logo.svg"
          alt="Logo"
          style={{
            position: 'absolute',
            width: '120px',
            height: '60px',
            left: '19.04px',
            top: '50.33px',
            opacity: '0.2',
          }}
        />
      </div>

      {/* Item name */}
      <div
        style={{
          position: 'absolute',
          width: '152.36px',
          height: '22px',
          left: '6.93px',
          top: '160.28px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '14.8406px',
          lineHeight: '22px',
          color: '#FFFFFF',
        }}
      >
        {itemName}
      </div>

      {/* Item value */}
      <div
        style={{
          position: 'absolute',
          width: '68.27px',
          height: '22px',
          left: '6.93px',
          top: '179.08px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '14.8406px',
          lineHeight: '22px',
          color: '#006EFF',
        }}
      >
        {itemValue}
      </div>
    </div>
  );
}
