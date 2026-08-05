const express = require('express');
const router = express.Router();
const Coinflip = require('../models/Coinflip');
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
const populateItemDetails = async (inventoryItems) => {
  return await Promise.all(
    inventoryItems.map(async (invItem) => {
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
};

// Create a new coinflip game
router.post('/create', async (req, res) => {
  try {
    const { userId, uniqueIds, betAmount, selectedCoin } = req.body;
    
    if (!userId || !uniqueIds || uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get user inventory
    const inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Check if user owns all the items by uniqueId
    const inventoryUniqueIds = inventory.items.map(item => item.uniqueId);
    const missingItems = uniqueIds.filter(id => !inventoryUniqueIds.includes(id));
    
    if (missingItems.length > 0) {
      return res.status(400).json({ error: 'You do not own all the selected items' });
    }
    
    // Get selected items with populated details
    const selectedItems = inventory.items.filter(item => uniqueIds.includes(item.uniqueId));
    const populatedItems = await populateItemDetails(selectedItems);
    const totalValue = populatedItems.reduce((sum, item) => sum + item.value, 0);
    
    // Create game in database
    const game = new Coinflip({
      creator: userId,
      creatorItems: populatedItems,
      items: populatedItems,
      totalValue,
      status: 'waiting',
      selectedCoin: selectedCoin || 'heads',
    });
    
    await game.save();
    
    console.log('Game saved to database:', game._id);
    
    // Populate creator data before emitting
    const populatedGame = await Coinflip.findById(game._id)
      .populate('creator', 'username avatarUrl')
      .populate('joiner', 'username avatarUrl');
    
    // Remove items from inventory by uniqueId
    uniqueIds.forEach(uniqueId => {
      const index = inventory.items.findIndex(item => item.uniqueId === uniqueId);
      if (index !== -1) {
        inventory.items.splice(index, 1);
      }
    });
    await inventory.save();
    
    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(inventory.items);
    const responseInventory = {
      ...inventory.toObject(),
      items: populatedInventory
    };
    
    // Emit socket event for inventory update
    if (io) {
      io.emit('inventory-updated', { userId, inventory: responseInventory });
    }
    
    // Emit socket event for new game
    if (io) {
      io.emit('coinflip-created', { game: populatedGame });
    }
    
    console.log('Game created successfully, emitting events');
    res.json({ message: 'Coinflip game created', game: populatedGame });
  } catch (error) {
    console.error('Error creating coinflip game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join a coinflip game
router.post('/join/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId, uniqueIds, betAmount } = req.body;
    
    if (!userId || !uniqueIds || uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find the game
    const game = await Coinflip.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Check if game is in waiting status
    if (game.status !== 'waiting') {
      return res.status(400).json({ error: 'Game is not available for joining' });
    }
    
    // Check if user is the creator (can't join own game)
    const creatorId = typeof game.creator === 'object' ? game.creator._id : game.creator;
    if (String(creatorId) === String(userId)) {
      return res.status(400).json({ error: 'You cannot join your own game' });
    }
    
    // Get user inventory
    const inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Check if user owns all the items by uniqueId
    const inventoryUniqueIds = inventory.items.map(item => item.uniqueId);
    const missingItems = uniqueIds.filter(id => !inventoryUniqueIds.includes(id));
    
    if (missingItems.length > 0) {
      return res.status(400).json({ error: 'You do not own all the selected items' });
    }
    
    // Get selected items with populated details
    const selectedItems = inventory.items.filter(item => uniqueIds.includes(item.uniqueId));
    const populatedItems = await populateItemDetails(selectedItems);
    const totalValue = populatedItems.reduce((sum, item) => sum + item.value, 0);
    
    // Check if bet is within 10% of game value
    const gameValue = game.totalValue;
    const minValue = gameValue * 0.9;
    const maxValue = gameValue * 1.1;
    
    // Format values for error message
    const formatAmount = (amount) => {
      if (amount >= 1000000) {
        return `B$${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `B$${(amount / 1000).toFixed(0)}K`;
      } else {
        return `B$${amount.toFixed(0)}`;
      }
    };
    
    if (totalValue < minValue || totalValue > maxValue) {
      return res.status(400).json({ 
        error: `Bet amount must be between ${formatAmount(minValue)} and ${formatAmount(maxValue)}` 
      });
    }
    
    // Update game with joiner and their items
    game.joiner = userId;
    game.joinerItems = populatedItems;
    game.items = [...game.creatorItems, ...populatedItems];
    game.totalValue += totalValue;
    game.status = 'active';
    
    await game.save();
    
    console.log('Game joined successfully:', game._id);
    
    // Populate game data before emitting
    const populatedGame = await Coinflip.findById(game._id)
      .populate('creator', 'username avatarUrl')
      .populate('joiner', 'username avatarUrl');
    
    // Remove items from inventory by uniqueId
    uniqueIds.forEach(uniqueId => {
      const index = inventory.items.findIndex(item => item.uniqueId === uniqueId);
      if (index !== -1) {
        inventory.items.splice(index, 1);
      }
    });
    await inventory.save();
    
    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(inventory.items);
    const responseInventory = {
      ...inventory.toObject(),
      items: populatedInventory
    };
    
    // Emit socket event for inventory update
    if (io) {
      io.emit('inventory-updated', { userId, inventory: responseInventory });
    }
    
    // Emit socket event for game joined
    if (io) {
      io.emit('coinflip-joined', { game: populatedGame });
    }
    
    // Schedule game completion after countdown (5 seconds)
    setTimeout(async () => {
      try {
        // Determine winner by random coin flip
        const coinFlip = Math.random() < 0.5 ? 'heads' : 'tails';
        const winnerId = coinFlip === game.selectedCoin ? creatorId : userId;
        
        game.winner = winnerId;
        game.result = coinFlip;
        game.status = 'completed';
        game.completedAt = new Date();
        
        await game.save();
        
        console.log('Game completed:', { gameId: game._id, winner: winnerId, result: coinFlip });
        
        // Populate game data before emitting
        const completedGame = await Coinflip.findById(game._id)
          .populate('creator', 'username avatarUrl')
          .populate('joiner', 'username avatarUrl');
        
        // Give all items to winner with new unique IDs
        const winnerInventory = await Inventory.findOne({ userId: winnerId });
        if (!winnerInventory) {
          const newInventoryItems = [];
          [...game.creatorItems, ...game.joinerItems].forEach(item => {
            newInventoryItems.push({
              uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              itemId: item.itemId,
              acquiredAt: new Date()
            });
          });
          winnerInventory = await Inventory.create({
            userId: winnerId,
            items: newInventoryItems
          });
        } else {
          [...game.creatorItems, ...game.joinerItems].forEach(item => {
            winnerInventory.items.push({
              uniqueId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              itemId: item.itemId,
              acquiredAt: new Date()
            });
          });
          await winnerInventory.save();
        }
        
        // Populate item details for inventory before emitting
        const populatedInventory = await Inventory.findOne({ userId: winnerId }).populate('userId', 'username');
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
          console.log('Emitting inventory-updated for winner:', winnerId);
          console.log('Inventory items count:', responseInventory.items.length);
          io.emit('inventory-updated', { userId: winnerId, inventory: responseInventory });
        }
        
        // Emit socket event for game completion
        if (io) {
          io.emit('coinflip-completed', { game: completedGame });
        }
      } catch (error) {
        console.error('Error completing game:', error);
      }
    }, 5000); // 5 second countdown
    
    res.json({ message: 'Joined coinflip game', game: populatedGame });
  } catch (error) {
    console.error('Error joining coinflip game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's available items for betting
router.get('/:userId/available-items', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      return res.json({ items: [] });
    }
    
    res.json({ items: inventory.items });
  } catch (error) {
    console.error('Error fetching available items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active coinflip games
router.get('/active', async (req, res) => {
  try {
    console.log('Fetching active coinflip games...');
    const fiveMinutesAgo = new Date(Date.now() - 300000); // Games from last 5 minutes
    const games = await Coinflip.find({ 
      status: { $in: ['waiting', 'active', 'completed'] },
      $or: [
        { completedAt: null }, // Games not yet completed
        { completedAt: { $gte: fiveMinutesAgo } } // Games completed in last 5 minutes
      ]
    })
      .populate('creator', 'username avatarUrl')
      .populate('joiner', 'username avatarUrl')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${games.length} active games`);
    games.forEach(game => {
      console.log('Game:', {
        id: game._id,
        creator: game.creator,
        creatorUsername: game.creator?.username,
        joiner: game.joiner,
        joinerUsername: game.joiner?.username,
        status: game.status,
        completedAt: game.completedAt
      });
    });
    
    res.json({ games });
  } catch (error) {
    console.error('Error fetching active games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cancel/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { userId } = req.body;

    console.log('Cancel request received:', { gameId, userId });

    const game = await Coinflip.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log('Game found:', { gameCreator: game.creator, gameCreatorType: typeof game.creator });

    // Extract creator ID - handle both string and object cases
    const creatorId = typeof game.creator === 'object' ? game.creator._id : game.creator;
    const creatorIdString = String(creatorId);
    const userIdString = String(userId);
    
    console.log('ID comparison:', { 
      creatorId, 
      creatorIdString, 
      userId, 
      userIdString,
      areEqual: creatorIdString === userIdString 
    });

    // Check if user is the creator
    if (creatorIdString !== userIdString) {
      return res.status(403).json({ error: 'Only the creator can cancel the game' });
    }

    // Check if game has been joined
    const joinerId = typeof game.joiner === 'object' ? game.joiner._id : game.joiner;
    if (joinerId) {
      return res.status(400).json({ error: 'Cannot cancel a game that has been joined' });
    }

    // Return items to user's inventory
    const Inventory = require('../models/Inventory');
    let inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      inventory = new Inventory({
        userId,
        items: []
      });
    }

    // Add items back to inventory
    game.items.forEach(item => {
      inventory.items.push({
        itemId: item.itemId,
        name: item.name,
        image: item.image,
        value: item.value
      });
    });

    await inventory.save();

    // Emit inventory update event with full inventory data
    if (io) {
      io.emit('inventory-updated', { userId, inventory });
    }

    // Delete the game
    await Coinflip.findByIdAndDelete(gameId);

    res.json({ message: 'Game cancelled successfully, items returned to inventory' });
  } catch (error) {
    console.error('Error cancelling game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
