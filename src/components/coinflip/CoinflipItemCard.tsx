'use client';

interface CoinflipItemCardProps {
  imageSrc: string;
  itemName?: string;
  itemValue?: number;
}

const formatValue = (value: number) => {
  if (value >= 1000) {
    const inThousands = value / 1000;
    return `B$${inThousands.toFixed(1)}k`;
  } else {
    return `B$${value}`;
  }
};

export default function CoinflipItemCard({ imageSrc, itemName = 'Gingerscope', itemValue = 43800 }: CoinflipItemCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '145px',
        height: '185px',
        borderRadius: '7.91501px',
        flex: 'none',
        order: 0,
        flexGrow: 0,
      }}
    >
      
      <div
        style={{
          position: 'absolute',
          width: '138px',
          height: '138px',
          left: '3.5px',
          top: '3.5px',
          borderRadius: '14.8406px',
          overflow: 'hidden',
        }}
      >
        
        <div
          style={{
            position: 'absolute',
            width: '138px',
            height: '138px',
            left: '0px',
            top: '0px',
            background: '#11151D',
            borderRadius: '14.8406px',
          }}
        />

        
        <div
          style={{
            position: 'absolute',
            width: '113px',
            height: '113px',
            left: '10.8px',
            top: '18.8px',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(28px)',
            borderRadius: '8px',
          }}
        />

        
        <div
          style={{
            position: 'absolute',
            width: '113px',
            height: '113px',
            left: '11.6px',
            top: '16px',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
          }}
        />

        
        <img
          src="/assets/svg/ui/logo.svg"
          alt="Logo"
          style={{
            position: 'absolute',
            width: '108px',
            height: '54px',
            left: '17px',
            top: '45px',
            opacity: '0.2',
          }}
        />
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '138px',
          height: '20px',
          left: '6px',
          top: '145px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#FFFFFF',
        }}
      >
        {itemName}
      </div>

      
      <div
        style={{
          position: 'absolute',
          width: '62px',
          height: '20px',
          left: '6px',
          top: '162px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          fontSize: '13px',
          lineHeight: '20px',
          color: '#A855F7',
        }}
      >
        {formatValue(itemValue)}
      </div>
    </div>
  );
}
