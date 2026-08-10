import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  robloxUserId: string;
  avatarUrl?: string;
  balance?: number;
  totalBet?: number;
  totalProfit?: number;
  totalWon?: number;
  inventoryTotalValue?: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('useAuth: No token found');
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('useAuth: Fetching user with token');

    try {
      const response = await fetch('https://api-bash-0ouj.onrender.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log('useAuth: Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }

      setUser(data);
      console.log('useAuth: User set:', data);
      console.log('useAuth: User ID:', data.id);
    } catch (err) {
      console.error('useAuth: Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (err instanceof Error && err.message.includes('token')) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
  };
};
