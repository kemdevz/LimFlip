interface TransactionsTabProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

export default function TransactionsTab({ activeSubTab, onSubTabChange }: TransactionsTabProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '12px',
        width: '100%',
        maxWidth: '405px',
        minHeight: '38px',
        overflowX: 'auto',
        marginTop: '20px',
      }}
    >
      <div
        onClick={() => onSubTabChange('Deposits')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '11px 15px',
          gap: '9px',
          width: '121px',
          height: '37px',
          background: activeSubTab === 'Deposits' ? '#1E222F' : 'transparent',
          borderRadius: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src="/assets/profile/deposit.svg"
          alt="Deposits"
          style={{
            width: '15px',
            height: '19px',
          }}
        />
        <span
          style={{
            fontFamily: 'Proxima Nova, Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            color: activeSubTab === 'Deposits' ? '#FFFFFF' : '#5C6174',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          Deposits
        </span>
      </div>

      <div
        onClick={() => onSubTabChange('Withdrawals')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '11px 15px',
          gap: '12px',
          width: '167px',
          height: '38px',
          background: activeSubTab === 'Withdrawals' ? '#1E222F' : 'transparent',
          borderRadius: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src="/assets/profile/withdraw.svg"
          alt="Withdrawals"
          style={{
            width: '21px',
            height: '28px',
          }}
        />
        <span
          style={{
            fontFamily: 'Proxima Nova, Poppins, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '19px',
            color: activeSubTab === 'Withdrawals' ? '#FFFFFF' : '#5C6174',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          Withdrawals
        </span>
      </div>

      <div
        onClick={() => onSubTabChange('Tips')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '11px 15px',
          gap: '12px',
          width: '93px',
          height: '38px',
          background: activeSubTab === 'Tips' ? '#1E222F' : 'transparent',
          borderRadius: '11px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <img
          src="/assets/profile/tip.svg"
          alt="Tips"
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
            fontSize: '16px',
            lineHeight: '19px',
            color: activeSubTab === 'Tips' ? '#FFFFFF' : '#5C6174',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          Tips
        </span>
      </div>
    </div>
  );
}
