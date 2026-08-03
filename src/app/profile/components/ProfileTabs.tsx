interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = ['Profile', 'Linking', 'Game History', 'Transactions'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        gap: '8px',
        width: '520px',
        height: '57px',
        background: '#191D29',
        borderRadius: '17px',
        marginTop: '20px',
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 12px',
            gap: '7px',
            flex: 1,
            height: '37px',
            background: activeTab === tab ? '#1E222F' : 'transparent',
            borderRadius: '11px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'Proxima Nova, Poppins, sans-serif',
              fontStyle: 'normal',
              fontWeight: activeTab === tab ? 700 : 600,
              fontSize: '16px',
              lineHeight: '19px',
              color: activeTab === tab ? '#FFFFFF' : '#5C6174',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
            }}
          >
            {tab}
          </span>
        </div>
      ))}
    </div>
  );
}
