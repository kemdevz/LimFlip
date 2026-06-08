import Subnavbar from '@/components/Subnavbar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#12151C]">
      {/* Background image with luminosity blend mode */}
      <div
        className="absolute inset-0"
        style={{
          width: '2662px',
          height: '1248px',
          left: '-371px',
          top: '-84px',
          backgroundImage: 'url(/mainbg.png)',
          backgroundSize: 'cover',
          mixBlendMode: 'luminosity',
        }}
      />

      {/* Blur effects */}
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '1652px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '358px',
          height: '372px',
          left: '241px',
          bottom: '702px',
          background: '#006EFF',
          opacity: '0.08',
          filter: 'blur(114px)',
          borderRadius: '344.22px',
        }}
      />

      <Subnavbar />
      <Navbar />
      <Sidebar />

      {/* 404 graphic */}
      <div
        className="absolute"
        style={{
          left: 'calc(min(22vw, 352px) + (100vw - min(22vw, 352px)) / 2)',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img
          src="/assets/svg/404.svg"
          alt="404"
          style={{
            width: 'min(45vw, 546px)',
            height: 'min(26vw, 318px)',
            filter: 'drop-shadow(0px 4px 75.1px rgba(2, 118, 255, 0.38))',
          }}
        />
      </div>

      {/* Error text */}
      <div
        className="absolute"
        style={{
          width: 'auto',
          height: 'auto',
          left: 'calc(min(22vw, 352px) + (100vw - min(22vw, 352px)) / 2)',
          top: 'calc(50% + min(26vw, 318px) / 2 + 20px)',
          transform: 'translateX(-50%)',
          fontFamily: 'Poppins, sans-serif',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: 'min(2.5vw, 25px)',
          lineHeight: '1.2',
          color: '#FFFFFF',
        }}
      >
        Error
      </div>

      {/* Description text */}
      <div
        className="absolute"
        style={{
          width: 'min(50vw, 642px)',
          height: 'auto',
          left: 'calc(min(22vw, 352px) + (100vw - min(22vw, 352px)) / 2)',
          top: 'calc(50% + min(26vw, 318px) / 2 + 20px + min(2.5vw, 25px) + 15px)',
          transform: 'translateX(-50%)',
          fontFamily: 'Poppins, sans-serif',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: 'min(1.2vw, 16px)',
          lineHeight: '1.5',
          color: '#505A71',
          textAlign: 'center',
        }}
      >
        We can't seem to find page you're looking for. Try going back to the homepage.
      </div>

      {/* Goto Home-Page button */}
      <div
        className="absolute"
        style={{
          width: 'min(12vw, 151px)',
          height: 'min(3vw, 36px)',
          left: 'calc(min(22vw, 352px) + (100vw - min(22vw, 352px)) / 2)',
          top: 'calc(50% + min(26vw, 318px) / 2 + 20px + min(2.5vw, 25px) + 15px + min(1.2vw, 16px) * 1.5 + 20px)',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            background: '#0276FF',
            borderRadius: '7px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 'min(1vw, 13px)',
            lineHeight: '1',
            color: '#FFFFFF',
          }}
        >
          Goto Home-Page
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
