import WaitingCard from './WaitingCard';
import { JackpotEntry } from '@/types';

const REEL_SLOT_COUNT = 14;

const getEntryUserId = (entry: JackpotEntry) =>
  typeof entry.userId === 'string' ? entry.userId : entry.userId._id;

const buildWeightedReel = (entries: JackpotEntry[]) => {
  if (entries.length === 0) return Array<JackpotEntry | undefined>(REEL_SLOT_COUNT).fill(undefined);

  const users = new Map<string, JackpotEntry>();
  for (const entry of entries) {
    const userId = getEntryUserId(entry);
    const existing = users.get(userId);
    users.set(userId, existing ? {
      ...existing,
      items: [...existing.items, ...entry.items],
      totalValue: existing.totalValue + entry.totalValue,
      joinedAt: entry.joinedAt,
    } : { ...entry });
  }

  const entrants = Array.from(users.values());
  const totalValue = entrants.reduce((sum, entry) => sum + entry.totalValue, 0);
  if (totalValue <= 0) return Array<JackpotEntry | undefined>(REEL_SLOT_COUNT).fill(undefined);

  const quotas = entrants.map((entry, index) => {
    const exact = (entry.totalValue / totalValue) * REEL_SLOT_COUNT;
    return { index, slots: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let slotsLeft = REEL_SLOT_COUNT - quotas.reduce((sum, quota) => sum + quota.slots, 0);
  [...quotas]
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
    .forEach((quota) => {
      if (slotsLeft > 0) {
        quotas[quota.index].slots += 1;
        slotsLeft -= 1;
      }
    });

  const weighted = quotas.map((quota) => ({
    entry: entrants[quota.index],
    weight: quota.slots,
    current: 0,
  }));
  const reel: JackpotEntry[] = [];
  for (let slot = 0; slot < REEL_SLOT_COUNT; slot += 1) {
    weighted.forEach((candidate) => { candidate.current += candidate.weight; });
    const winner = weighted.reduce((best, candidate) => candidate.current > best.current ? candidate : best);
    reel.push(winner.entry);
    winner.current -= REEL_SLOT_COUNT;
  }

  const newestUserId = getEntryUserId(entries[entries.length - 1]);
  const newestIndex = reel.findIndex((entry) => getEntryUserId(entry) === newestUserId);
  if (newestIndex < 0) return reel;
  const rotation = (newestIndex - 2 + REEL_SLOT_COUNT) % REEL_SLOT_COUNT;
  return [...reel.slice(rotation), ...reel.slice(0, rotation)];
};

export default function JackpotContainer({ entries }: { entries: JackpotEntry[] }) {
  const reelHalf = buildWeightedReel(entries);
  const reelSlots = [...reelHalf, ...reelHalf];
  const reelKey = entries.map((entry) => entry._id || `${entry.username}-${entry.joinedAt}`).join('|') || 'empty';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        marginTop: '18px',
        marginBottom: '20px',
        border: '11px solid #181C28',
        borderRadius: '15px',
        overflow: 'visible',
      }}
    >
      <style>{`
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      
      <div
        style={{
          position: 'absolute',
          height: '249px',
          left: '0px',
          right: '0px',
          top: '0px',
          borderTop: '5px solid #21252F',
          borderLeft: '5px solid #21252F',
          borderRight: '5px solid #21252F',
          borderBottom: 'none',
          borderRadius: '12px 12px 0 0',
          zIndex: 1,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          height: '249px',
          left: '0px',
          right: '0px',
          top: '0px',
          background: '#191D29',
          boxShadow: 'inset 0px 4px 109.7px rgba(0, 0, 0, 0.25), inset 0px 4px 14.8px rgba(0, 0, 0, 0.25)',
          borderRadius: '12px',
          zIndex: 2,
        }}
      />
      
      <img
        src="/assets/jackpot/arrow.svg"
        alt="Arrow"
        style={{
          position: 'absolute',
          left: '50%',
          top: '-15px',
          transform: 'translateX(-50%)',
          width: '33px',
          height: '30px',
          zIndex: 30,
        }}
      />
      <img
        src="/assets/jackpot/arrow.svg"
        alt="Arrow"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-15px',
          transform: 'translateX(-50%) rotate(180deg)',
          width: '33px',
          height: '30px',
          zIndex: 30,
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '16px',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          key={reelKey}
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
            animation: 'scrollRight 30s linear infinite',
            willChange: 'transform',
          }}
        >
          {reelSlots.map((entry, index) => (
            <WaitingCard
              key={`reel-${index}`}
              entry={entry}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
