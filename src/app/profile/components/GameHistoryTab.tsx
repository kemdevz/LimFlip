interface GameHistoryTabProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

export default function GameHistoryTab({ activeSubTab, onSubTabChange }: GameHistoryTabProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '12px',
        width: '100%',
        maxWidth: '312px',
        minHeight: '38px',
        overflowX: 'auto',
        marginTop: '20px',
      }}
    >
      <div
        onClick={() => onSubTabChange('Live Bets')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '11px 15px',
          gap: '7px',
          width: '123px',
          height: '38px',
          background: activeSubTab === 'Live Bets' ? '#1E222F' : 'transparent',
          borderRadius: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src="/assets/profile/live.svg"
          alt="Live"
          style={{
            width: '20px',
            height: '16px',
          }}
        />
        <span
          style={{
            fontFamily: 'Proxima Nova, Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '16px',
            color: activeSubTab === 'Live Bets' ? '#FFFFFF' : '#5C6174',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          Live Bets
        </span>
      </div>

      <div
        onClick={() => onSubTabChange('Previous Bets')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '11px 15px',
          gap: '12px',
          width: '177px',
          height: '38px',
          borderRadius: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src="/assets/profile/dice.svg"
          alt="Previous"
          style={{
            width: '31px',
            height: '25px',
          }}
        />
        <span
          style={{
            fontFamily: 'Proxima Nova, Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '19px',
            color: activeSubTab === 'Previous Bets' ? '#FFFFFF' : '#5C6174',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          Previous Bets
        </span>
      </div>
    </div>
  );
}
