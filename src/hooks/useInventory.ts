import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

interface InventoryItem {
  uniqueId: string;
  itemId: string;
  name: string;
  image: string;
  rarity: string;
  value: number;
  category: string;
  acquiredAt?: string;
  listedInMarketplace?: boolean;
}

interface Inventory {
  userId: string;
  items: InventoryItem[];
  totalValue: number;
  updatedAt: string;
}

export const useInventory = (userId: string | null) => {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const fetchInventory = async () => {
    if (!userId) {
      console.log('useInventory: No userId provided');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('useInventory: Fetching inventory for userId:', userId);

    try {
      const response = await fetch(`https://api-bash-0ouj.onrender.com/inventory/${userId}`);
      const data = await response.json();

      console.log('useInventory: Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch inventory');
      }

      setInventory(data);
    } catch (err) {
      console.error('useInventory: Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchInventory();

    // Listen for inventory updates via socket
    if (socket) {
      socket.on('inventory-updated', (data: { userId: string, inventory: Inventory }) => {
        console.log('useInventory: Received inventory-updated event');
        console.log('useInventory: Data userId:', data.userId, 'Current userId:', userId);
        console.log('useInventory: Inventory items count:', data.inventory?.items?.length);
        if (data.userId === userId) {
          console.log('useInventory: Updating inventory for current user');
          setInventory(data.inventory);
        } else {
          console.log('useInventory: Ignoring inventory update for different user');
        }
      });

      return () => {
        socket.off('inventory-updated');
      };
    }
  }, [userId, socket]);

  const addItem = async (item: Omit<InventoryItem, 'itemId'>) => {
    if (!userId) return;

    try {
      const response = await fetch(`https://api-bash-0ouj.onrender.com/inventory/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          itemId: Date.now().toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      setInventory(data.inventory);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`https://api-bash-0ouj.onrender.com/inventory/${userId}/remove/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item');
      }

      setInventory(data.inventory);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    addItem,
    removeItem,
  };
};
