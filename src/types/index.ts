export interface User {
  username: string;
  avatarUrl?: string;
  balance?: number;
  totalBet?: number;
  totalProfit?: number;
  totalWon?: number;
  inventoryTotalValue?: number;
  [key: string]: any;
}

export interface InventoryItem {
  uniqueId: string;
  itemId: string;
  name: string;
  image: string;
  rarity: string;
  value: number;
  category: string;
  acquiredAt?: string;
}

export interface Inventory {
  userId: string;
  items: InventoryItem[];
  totalValue: number;
  updatedAt: string;
}

export interface Message {
  username: string;
  message: string;
  time: string;
  avatarUrl: string;
  isWhale?: boolean;
  role?: 'User' | 'Moderator' | 'Owner';
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon?: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
  iconSize?: {
    width: number;
    height: number;
  };
}

export interface CryptoConfig {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  minDeposit: number;
  maxDeposit: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'tip';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface GameHistory {
  id: string;
  game: 'coinflip' | 'jackpot' | 'dice';
  wager: number;
  payout: number;
  result: 'win' | 'loss';
  date: string;
  opponent?: string;
}
