const express = require('express');
const router = express.Router();
const Jackpot = require('../models/Jackpot');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');

// Get io instance from server (will be set by server.js)
let io;

const setIo = (socketIo) => {
  io = socketIo;
};

module.exports = { router, setIo };

// Helper function to populate item details
const populateItemDetails = async (items) => {
  return await Promise.all(items.map(async (item) => {
    const itemDef = await Item.findOne({ itemId: item.itemId });
    if (itemDef) {
      return {
        ...item,
        name: itemDef.name,
        image: itemDef.image,
        rarity: itemDef.rarity,
        value: itemDef.value,
        category: itemDef.category
      };
    }
    return item;
  }));
};

// Get active jackpot
router.get('/active', async (req, res) => {
  try {
    const activeJackpot = await Jackpot.findOne({ status: { $in: ['waiting', 'active'] } })
      .populate('entries.userId', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');
    
    if (!activeJackpot) {
      return res.json({ jackpot: null });
    }
    
    res.json({ jackpot: activeJackpot });
  } catch (error) {
    console.error('Error fetching active jackpot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get jackpot by ID
router.get('/:jackpotId', async (req, res) => {
  try {
    const { jackpotId } = req.params;
    
    const jackpot = await Jackpot.findById(jackpotId)
      .populate('entries.userId', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');
    
    if (!jackpot) {
      return res.status(404).json({ error: 'Jackpot not found' });
    }
    
    res.json({ jackpot });
  } catch (error) {
    console.error('Error fetching jackpot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join jackpot
router.post('/join', async (req, res) => {
  try {
    const { userId, uniqueIds } = req.body;
    
    if (!userId || !uniqueIds || uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's inventory
    const inventory = await Inventory.findOne({ userId });
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Validate ownership of items by uniqueId
    const selectedItems = [];
    let totalValue = 0;
    
    for (const uniqueId of uniqueIds) {
      const itemIndex = inventory.items.findIndex(item => item.uniqueId === uniqueId);
      if (itemIndex === -1) {
        return res.status(400).json({ error: `Item with uniqueId ${uniqueId} not found in inventory` });
      }
      const item = inventory.items[itemIndex];
      selectedItems.push(item);
      totalValue += item.value || 0;
    }
    
    // Get or create active jackpot
    let jackpot = await Jackpot.findOne({ status: { $in: ['waiting', 'active'] } });
    
    if (!jackpot) {
      // Create new jackpot
      jackpot = new Jackpot({
        status: 'waiting',
        entries: [],
        totalValue: 0
      });
    }
    
    // Populate item details for selected items
    const populatedItems = await populateItemDetails(selectedItems);
    
    // Add entry to jackpot
    jackpot.entries.push({
      userId: user._id,
      username: user.username,
      avatarUrl: user.avatarUrl || '',
      items: populatedItems,
      totalValue: totalValue,
      joinedAt: new Date()
    });
    
    await jackpot.save();
    
    // Remove items from user's inventory by uniqueId
    const updatedInventory = await Inventory.findOneAndUpdate(
      { userId },
      { $pull: { items: { uniqueId: { $in: uniqueIds } } } },
      { new: true }
    );
    
    if (!updatedInventory) {
      return res.status(500).json({ error: 'Failed to update inventory' });
    }
    
    // Populate jackpot data before emitting
    const populatedJackpot = await Jackpot.findById(jackpot._id)
      .populate('entries.userId', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');
    
    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(updatedInventory.items);
    const responseInventory = {
      ...updatedInventory.toObject(),
      items: populatedInventory
    };
    
    // Emit socket event for inventory update
    if (io) {
      io.emit('inventory-updated', { userId, inventory: responseInventory });
    }
    
    // Emit socket event for jackpot joined
    if (io) {
      io.emit('jackpot-joined', { jackpot: populatedJackpot });
    }
    
    // Check if this is the first player joining
    if (jackpot.entries.length === 1) {
      // Start 1-minute timer
      jackpot.timerEndsAt = new Date(Date.now() + 60000); // 1 minute from now
      await jackpot.save();
      
      // Schedule refund if no one else joins
      setTimeout(async () => {
        try {
          const currentJackpot = await Jackpot.findById(jackpot._id);
          if (currentJackpot && currentJackpot.status === 'waiting' && currentJackpot.entries.length === 1) {
            // Refund the single player
            await refundJackpot(currentJackpot._id);
          }
        } catch (error) {
          console.error('Error in jackpot timer:', error);
        }
      }, 60000);
      
      const updatedJackpot = await Jackpot.findById(jackpot._id)
        .populate('entries.userId', 'username avatarUrl')
        .populate('winner', 'username avatarUrl');
      
      if (io) {
        io.emit('jackpot-timer-started', { jackpot: updatedJackpot });
      }
    }
    
    // Check if jackpot should start (e.g., after 3 players)
    if (jackpot.entries.length >= 3) {
      jackpot.status = 'active';
      jackpot.startedAt = new Date();
      await jackpot.save();
      
      // Schedule jackpot completion after countdown (10 seconds)
      setTimeout(async () => {
        try {
          await completeJackpot(jackpot._id);
        } catch (error) {
          console.error('Error completing jackpot:', error);
        }
      }, 10000);
      
      const activeJackpot = await Jackpot.findById(jackpot._id)
        .populate('entries.userId', 'username avatarUrl')
        .populate('winner', 'username avatarUrl');
      
      if (io) {
        io.emit('jackpot-started', { jackpot: activeJackpot });
      }
    }
    
    res.json({ message: 'Joined jackpot', jackpot: populatedJackpot });
  } catch (error) {
    console.error('Error joining jackpot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete jackpot and determine winner
async function completeJackpot(jackpotId) {
  try {
    const jackpot = await Jackpot.findById(jackpotId)
      .populate('entries.userId', 'username avatarUrl');
    
    if (!jackpot || jackpot.status === 'completed') {
      return;
    }
    
    // Calculate winning percentage based on total value
    const totalValue = jackpot.totalValue;
    
    if (totalValue === 0 || jackpot.entries.length === 0) {
      console.error('Invalid jackpot: totalValue is 0 or no entries');
      return;
    }
    
    const randomValue = Math.random() * totalValue;
    
    let cumulativeValue = 0;
    let winner = null;
    let winningPercentage = 0;
    
    for (const entry of jackpot.entries) {
      const entryPercentage = entry.totalValue / totalValue;
      cumulativeValue += entry.totalValue;
      
      if (randomValue <= cumulativeValue) {
        winner = entry.userId;
        winningPercentage = entryPercentage;
        break;
      }
    }
    
    // If no winner found (shouldn't happen), pick random
    if (!winner && jackpot.entries.length > 0) {
      const randomIndex = Math.floor(Math.random() * jackpot.entries.length);
      winner = jackpot.entries[randomIndex].userId;
      winningPercentage = jackpot.entries[randomIndex].totalValue / totalValue;
    }
    
    // Ensure winningPercentage is a valid number
    if (isNaN(winningPercentage) || winningPercentage === 0) {
      winningPercentage = 1 / jackpot.entries.length;
    }
    
    jackpot.status = 'completed';
    jackpot.winner = winner;
    jackpot.winningPercentage = winningPercentage;
    jackpot.completedAt = new Date();
    await jackpot.save();
    
    // Give all items to winner with new unique IDs
    const winnerInventory = await Inventory.findOne({ userId: winner });
    const allItems = jackpot.entries.flatMap(entry => entry.items);
    
    if (!winnerInventory) {
      const newInventoryItems = [];
      allItems.forEach(item => {
        newInventoryItems.push({
          uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.itemId,
          acquiredAt: new Date()
        });
      });
      await Inventory.create({
        userId: winner,
        items: newInventoryItems
      });
    } else {
      allItems.forEach(item => {
        winnerInventory.items.push({
          uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.itemId,
          acquiredAt: new Date()
        });
      });
      await winnerInventory.save();
    }
    
    // Populate item details for inventory before emitting
    const populatedInventory = await Inventory.findOne({ userId: winner }).populate('userId', 'username');
    const populatedItems = await Promise.all(
      populatedInventory.items.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId });
        if (itemDef) {
          return {
            ...invItem.toObject(),
            name: itemDef.name,
            image: itemDef.image,
            rarity: itemDef.rarity,
            value: itemDef.value,
            category: itemDef.category
          };
        }
        return invItem;
      })
    );
    
    const responseInventory = populatedInventory.toObject();
    responseInventory.items = populatedItems;
    
    // Emit inventory update for winner with populated data
    if (io) {
      console.log('Emitting inventory-updated for jackpot winner:', winner);
      io.emit('inventory-updated', { userId: winner, inventory: responseInventory });
    }
    
    // Emit socket event for jackpot completion
    const completedJackpot = await Jackpot.findById(jackpot._id)
      .populate('entries.userId', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');
    
    if (io) {
      io.emit('jackpot-completed', { jackpot: completedJackpot });
    }
  } catch (error) {
    console.error('Error completing jackpot:', error);
  }
}

// Refund jackpot if no one else joins
async function refundJackpot(jackpotId) {
  try {
    const jackpot = await Jackpot.findById(jackpotId)
      .populate('entries.userId', 'username avatarUrl');
    
    if (!jackpot || jackpot.status !== 'waiting' || jackpot.entries.length !== 1) {
      return;
    }
    
    const entry = jackpot.entries[0];
    const userId = entry.userId;
    
    // Return items to user's inventory
    const userInventory = await Inventory.findOne({ userId });
    
    if (!userInventory) {
      const newInventoryItems = [];
      entry.items.forEach(item => {
        newInventoryItems.push({
          uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.itemId,
          acquiredAt: new Date()
        });
      });
      await Inventory.create({
        userId,
        items: newInventoryItems
      });
    } else {
      entry.items.forEach(item => {
        userInventory.items.push({
          uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.itemId,
          acquiredAt: new Date()
        });
      });
      await userInventory.save();
    }
    
    // Mark jackpot as refunded
    jackpot.status = 'refunded';
    await jackpot.save();
    
    // Populate item details for inventory before emitting
    const populatedInventory = await Inventory.findOne({ userId }).populate('userId', 'username');
    const populatedItems = await Promise.all(
      populatedInventory.items.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId });
        if (itemDef) {
          return {
            ...invItem.toObject(),
            name: itemDef.name,
            image: itemDef.image,
            rarity: itemDef.rarity,
            value: itemDef.value,
            category: itemDef.category
          };
        }
        return invItem;
      })
    );
    
    const responseInventory = populatedInventory.toObject();
    responseInventory.items = populatedItems;
    
    // Emit inventory update for refunded user
    if (io) {
      console.log('Emitting inventory-updated for jackpot refund:', userId);
      io.emit('inventory-updated', { userId, inventory: responseInventory });
    }
    
    // Emit socket event for jackpot refund
    const refundedJackpot = await Jackpot.findById(jackpot._id)
      .populate('entries.userId', 'username avatarUrl');
    
    if (io) {
      io.emit('jackpot-refunded', { jackpot: refundedJackpot });
    }
  } catch (error) {
    console.error('Error refunding jackpot:', error);
  }
}
