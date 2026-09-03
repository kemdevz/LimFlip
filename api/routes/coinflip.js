const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

// Helper function to generate unique ID
const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to format amount
const formatAmount = (amount) => {
  if (amount >= 1000000) {
    return `B$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `B$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `B$${amount.toFixed(0)}`;
  }
};

// Get coinflip stats (all-time)
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;

    // Total bets: sum of totalValue across all completed games
    const totalBetsAgg = await Coinflip.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalValue' } } }
    ]);
    const totalBets = totalBetsAgg.length > 0 ? totalBetsAgg[0].total : 0;

    // Unique players: count distinct creators + joiners across completed games
    const uniquePlayersAgg = await Coinflip.aggregate([
      { $match: { status: 'completed' } },
      { $project: { players: { $setUnion: ['$creator', { $ifNull: ['$joiner', []] }] } } },
      { $unwind: '$players' },
      { $group: { _id: null, uniquePlayers: { $addToSet: '$players' } } },
      { $project: { count: { $size: '$uniquePlayers' } } }
    ]);
    const playerCount = uniquePlayersAgg.length > 0 ? uniquePlayersAgg[0].count : 0;

    // Your bets: sum of totalValue for games where user is creator or joiner
    let yourBets = 0;
    if (userId) {
      const yourBetsAgg = await Coinflip.aggregate([
        { $match: { status: 'completed', $or: [{ creator: mongoose.Types.ObjectId(userId) }, { joiner: mongoose.Types.ObjectId(userId) }] } },
        { $group: { _id: null, total: { $sum: '$totalValue' } } }
      ]);
      yourBets = yourBetsAgg.length > 0 ? yourBetsAgg[0].total : 0;
    }

    res.json({ playerCount, totalBets, yourBets });
  } catch (error) {
    console.error('Error fetching coinflip stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard data
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'profit' } = req.query;

    // Get all completed coinflip games
    const completedGames = await Coinflip.find({ status: 'completed' })
      .populate('creator', 'username avatarUrl')
      .populate('joiner', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');

    // Calculate wager and profit data per user
    const userStats = {};

    completedGames.forEach(game => {
      const creatorId = game.creator._id.toString();
      const joinerId = game.joiner?._id.toString();
      const winnerId = game.winner?._id.toString();

      // Get wager amounts (use betAmount for balance-based, totalValue for item-based)
      const creatorWager = game.isBalanceBased ? game.creatorBetAmount : game.totalValue;
      const joinerWager = game.isBalanceBased ? game.joinerBetAmount : game.totalValue;

      // Initialize user stats if not exists
      if (!userStats[creatorId]) {
        userStats[creatorId] = {
          userId: creatorId,
          username: game.creator.username,
          avatarUrl: game.creator.avatarUrl,
          totalWager: 0,
          totalProfit: 0,
          gamesPlayed: 0
        };
      }

      if (joinerId && !userStats[joinerId]) {
        userStats[joinerId] = {
          userId: joinerId,
          username: game.joiner.username,
          avatarUrl: game.joiner.avatarUrl,
          totalWager: 0,
          totalProfit: 0,
          gamesPlayed: 0
        };
      }

      // Update wager stats
      userStats[creatorId].totalWager += creatorWager;
      userStats[creatorId].gamesPlayed += 1;

      if (joinerId) {
        userStats[joinerId].totalWager += joinerWager;
        userStats[joinerId].gamesPlayed += 1;
      }

      // Calculate profit
      if (winnerId) {
        if (winnerId === creatorId) {
          userStats[creatorId].totalProfit += joinerWager;
          if (joinerId) {
            userStats[joinerId].totalProfit -= creatorWager;
          }
        } else if (winnerId === joinerId) {
          userStats[joinerId].totalProfit += creatorWager;
          userStats[creatorId].totalProfit -= joinerWager;
        }
      }
    });

    // Convert to array and sort based on type
    let sortedUsers = Object.values(userStats);

    if (type === 'profit') {
      sortedUsers.sort((a, b) => b.totalProfit - a.totalProfit);
    } else if (type === 'wager') {
      sortedUsers.sort((a, b) => b.totalWager - a.totalWager);
    } else if (type === 'least') {
      sortedUsers.sort((a, b) => a.totalProfit - b.totalProfit);
    }

    // Take top 10 and add rank
    const leaderboard = sortedUsers.slice(0, 10).map((user, index) => ({
      rank: index + 1,
      username: user.username,
      avatar: user.avatarUrl,
      profit: user.totalProfit,
      wager: user.totalWager,
      gamesPlayed: user.gamesPlayed
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to emit inventory update
const emitInventoryUpdate = (userId, inventory) => {
  if (io) {
    io.emit('inventory-updated', { userId, inventory });
  }
};

// Helper function to remove items from inventory by uniqueId
const removeItemsFromInventory = (inventory, uniqueIds) => {
  uniqueIds.forEach(uniqueId => {
    const index = inventory.items.findIndex(item => item.uniqueId === uniqueId);
    if (index !== -1) {
      inventory.items.splice(index, 1);
    }
  });
};

// Helper function to create inventory item with unique ID
const createInventoryItem = (itemId) => {
  return {
    uniqueId: generateUniqueId(),
    itemId: itemId,
    acquiredAt: new Date()
  };
};

// Create a new coinflip game
router.post('/create', async (req, res) => {
  try {
    const { userId, uniqueIds, betAmount, selectedCoin, isBalanceBased } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Handle balance-based coinflip
    if (isBalanceBased) {
      if (!betAmount || betAmount <= 0) {
        console.log('Invalid bet amount:', betAmount);
        return res.status(400).json({ error: 'Invalid bet amount' });
      }

      // Get user and check balance
      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('User balance:', user.balance, 'Bet amount:', betAmount);

      if (user.balance < betAmount) {
        console.log('Insufficient balance:', { userBalance: user.balance, betAmount });
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      console.log('Creating balance-based coinflip:', { userId, betAmount, selectedCoin });

      // Deduct balance from user
      user.balance -= betAmount;
      await user.save();

      // Create balance-based game
      const game = new Coinflip({
        creator: userId,
        creatorItems: [],
        items: [],
        totalValue: betAmount,
        status: 'waiting',
        selectedCoin: selectedCoin || 'heads',
        isBalanceBased: true,
        creatorBetAmount: betAmount,
        joinerBetAmount: 0
      });

      await game.save();

      // Populate creator data before emitting
      const populatedGame = await Coinflip.findById(game._id)
        .populate('creator', 'username avatarUrl')
        .populate('joiner', 'username avatarUrl');

      // Emit socket event for new game
      if (io) {
        io.emit('coinflip-created', { game: populatedGame });
      }

      return res.json({ message: 'Balance-based coinflip game created', game: populatedGame });
    }

    // Handle item-based coinflip (existing logic)
    if (!uniqueIds || uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get user inventory
    let inventory = await Inventory.findOne({ userId });

    if (!inventory) {
      // Create inventory if it doesn't exist
      inventory = new Inventory({ userId, items: [] });
      await inventory.save();
    }

    // Check if user owns all the items by uniqueId
    const inventoryUniqueIds = inventory.items.map(item => item.uniqueId);
    const missingItems = uniqueIds.filter(id => !inventoryUniqueIds.includes(id));

    if (missingItems.length > 0) {
      return res.status(400).json({ error: 'You do not own all the selected items' });
    }

    // Get selected items with populated details BEFORE removing
    const selectedItems = inventory.items.filter(item => uniqueIds.includes(item.uniqueId));
    const populatedItems = await populateItemDetails(selectedItems);
    const totalValue = populatedItems.reduce((sum, item) => sum + item.value, 0);

    // Atomically remove items from inventory FIRST to prevent duping
    const updateResult = await Inventory.updateOne(
      { _id: inventory._id, 'items.uniqueId': { $in: uniqueIds } },
      { $pull: { items: { uniqueId: { $in: uniqueIds } } } }
    );

    if (updateResult.modifiedCount === 0) {
      // Items were not removed - they may have been used in another transaction
      console.log('Race condition detected: items already used in another transaction');
      return res.status(400).json({ error: 'Items are no longer available' });
    }

    // Create game in database AFTER items are removed
    const game = new Coinflip({
      creator: userId,
      creatorItems: populatedItems,
      items: populatedItems,
      totalValue,
      status: 'waiting',
      selectedCoin: selectedCoin || 'heads',
      isBalanceBased: false,
      creatorBetAmount: 0,
      joinerBetAmount: 0
    });

    await game.save();

    console.log('Game saved to database:', game._id);

    // Populate creator data before emitting
    const populatedGame = await Coinflip.findById(game._id)
      .populate('creator', 'username avatarUrl')
      .populate('joiner', 'username avatarUrl');

    // Refresh inventory after atomic update
    const updatedInventory = await Inventory.findOne({ userId });

    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(updatedInventory.items);
    const responseInventory = {
      ...updatedInventory.toObject(),
      items: populatedInventory
    };

    // Emit socket event for inventory update
    emitInventoryUpdate(userId, responseInventory);

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
    const { userId, uniqueIds, betAmount, isBalanceBased } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Atomically find and update game to prevent race condition
    const game = await Coinflip.findOneAndUpdate(
      { _id: gameId, status: 'waiting' },
      { $set: { status: 'joining' } },
      { new: true }
    );

    if (!game) {
      return res.status(400).json({ error: 'Game is not available for joining' });
    }

    // Check if user is the creator (can't join own game)
    const creatorId = typeof game.creator === 'object' ? game.creator._id : game.creator;
    if (String(creatorId) === String(userId)) {
      // Reset status back to waiting
      await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
      return res.status(400).json({ error: 'You cannot join your own game' });
    }

    // Handle balance-based joining
    if (game.isBalanceBased || isBalanceBased) {
      if (!betAmount || betAmount <= 0) {
        await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
        return res.status(400).json({ error: 'Invalid bet amount' });
      }

      // Check if bet is within 10% of game value
      const gameValue = game.totalValue;
      const minValue = gameValue * 0.9;
      const maxValue = gameValue * 1.1;

      if (betAmount < minValue || betAmount > maxValue) {
        await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
        return res.status(400).json({
          error: `Bet amount must be between ${formatAmount(minValue)} and ${formatAmount(maxValue)}`
        });
      }

      // Get user and check balance
      const user = await User.findById(userId);
      if (!user) {
        await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.balance < betAmount) {
        await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Deduct balance from joiner
      user.balance -= betAmount;
      await user.save();

      // Update game with joiner
      game.joiner = userId;
      game.joinerItems = [];
      game.items = [];
      game.totalValue += betAmount;
      game.status = 'active';
      game.joinerBetAmount = betAmount;
      game.isBalanceBased = true;

      await game.save();

      // Populate game data before emitting
      const populatedGame = await Coinflip.findById(game._id)
        .populate('creator', 'username avatarUrl')
        .populate('joiner', 'username avatarUrl');

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
          
          console.log('Balance-based game completed:', { gameId: game._id, winner: winnerId, result: coinFlip });

          // Populate game data before emitting
          const completedGame = await Coinflip.findById(game._id)
            .populate('creator', 'username avatarUrl')
            .populate('joiner', 'username avatarUrl');

          // Calculate total pot (no tax for balance-based games)
          const totalPot = game.creatorBetAmount + game.joinerBetAmount;

          // Give total pot to winner
          const winner = await User.findById(winnerId);
          if (winner) {
            winner.balance += totalPot;
            await winner.save();
          }

          // Emit socket event for game completion
          if (io) {
            io.emit('coinflip-completed', { game: completedGame });
          }
        } catch (error) {
          console.error('Error completing balance-based game:', error);
        }
      }, 5000); // 5 second countdown
      
      return res.json({ message: 'Joined balance-based coinflip game', game: populatedGame });
    }

    // Handle item-based joining (existing logic)
    if (!uniqueIds || uniqueIds.length === 0) {
      await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user inventory first to validate items
    let inventory = await Inventory.findOne({ userId });

    if (!inventory) {
      // Create inventory if it doesn't exist
      inventory = new Inventory({ userId, items: [] });
      await inventory.save();
    }

    // Check if user owns all the items by uniqueId
    const inventoryUniqueIds = inventory.items.map(item => item.uniqueId);
    const missingItems = uniqueIds.filter(id => !inventoryUniqueIds.includes(id));

    if (missingItems.length > 0) {
      await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
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

    if (totalValue < minValue || totalValue > maxValue) {
      // Reset status back to waiting
      await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
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

    // Atomically remove items from inventory to prevent race condition
    const updateResult = await Inventory.updateOne(
      { _id: inventory._id, 'items.uniqueId': { $in: uniqueIds } },
      { $pull: { items: { uniqueId: { $in: uniqueIds } } } }
    );

    if (updateResult.modifiedCount === 0) {
      // Items were not removed - they may have been used in another transaction
      console.log('Race condition detected: items already used in another transaction');
      // Rollback - reset game status to waiting
      await Coinflip.findByIdAndUpdate(game._id, { status: 'waiting', joiner: null, joinerItems: [] });
      return res.status(400).json({ error: 'Items are no longer available' });
    }

    // Refresh inventory after atomic update
    const updatedInventory = await Inventory.findOne({ userId });

    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(updatedInventory.items);
    const responseInventory = {
      ...updatedInventory.toObject(),
      items: populatedInventory
    };

    // Emit socket event for inventory update
    emitInventoryUpdate(userId, responseInventory);

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

        // Calculate tax: 10% of total value, within 0-12% range
        const allItems = [...game.creatorItems, ...game.joinerItems];
        const totalValue = allItems.reduce((sum, item) => sum + (item.value || 0), 0);
        const taxTargetValue = totalValue * 0.10;
        const taxMinValue = 0;
        const taxMaxValue = totalValue * 0.12;

        // Find tax items by value (greedy approach - take highest value items first)
        const sortedByValue = [...allItems].sort((a, b) => (b.value || 0) - (a.value || 0));
        const taxItems = [];
        let taxValue = 0;

        for (const item of sortedByValue) {
          const itemValue = item.value || 0;
          if (taxValue + itemValue <= taxMaxValue) {
            taxItems.push(item);
            taxValue += itemValue;
            if (taxValue >= taxMinValue && taxValue <= taxMaxValue) {
              break;
            }
          }
        }

        // Only apply tax if we found items within the 0-12% range
        let itemsForWinner = allItems;
        if (taxItems.length > 0 && taxValue >= taxMinValue && taxValue <= taxMaxValue) {
          console.log(`Applying tax: ${taxItems.length} items worth ${taxValue} (target: ${taxTargetValue})`);
          itemsForWinner = allItems.filter(item => !taxItems.includes(item));

          // Transfer tax items to tax account (robloxUserId: 7848923878)
          const taxUser = await User.findOne({ robloxUserId: '7848923878' });
          if (taxUser) {
            let taxInventory = await Inventory.findOne({ userId: taxUser._id });
            if (!taxInventory) {
              const newTaxItems = taxItems.map(item => createInventoryItem(item.itemId));
              taxInventory = await Inventory.create({
                userId: taxUser._id,
                items: newTaxItems
              });
            } else {
              taxItems.forEach(item => {
                taxInventory.items.push(createInventoryItem(item.itemId));
              });
              await taxInventory.save();
            }
            console.log(`Tax items transferred to user ${taxUser._id}`);
          } else {
            console.log('Tax user not found, items will go to winner');
            itemsForWinner = allItems;
          }
        } else {
          console.log('No tax applied - no items fit within 0-12% range');
        }

        // Give remaining items to winner with new unique IDs
        const winnerInventory = await Inventory.findOne({ userId: winnerId });
        if (!winnerInventory) {
          const newInventoryItems = itemsForWinner.map(item => createInventoryItem(item.itemId));
          winnerInventory = await Inventory.create({
            userId: winnerId,
            items: newInventoryItems
          });
        } else {
          itemsForWinner.forEach(item => {
            winnerInventory.items.push(createInventoryItem(item.itemId));
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

    // Atomically find and update game to prevent race condition
    const game = await Coinflip.findOneAndUpdate(
      { _id: gameId, status: 'waiting', joiner: null },
      { $set: { status: 'cancelling' } },
      { new: true }
    );

    if (!game) {
      return res.status(400).json({ error: 'Game cannot be cancelled - it may already be joined or cancelled' });
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
      // Reset status back to waiting
      await Coinflip.findByIdAndUpdate(gameId, { $set: { status: 'waiting' } });
      return res.status(403).json({ error: 'Only the creator can cancel the game' });
    }

    // Handle balance-based cancellation
    if (game.isBalanceBased) {
      // Return balance to creator
      const user = await User.findById(userId);
      if (user) {
        user.balance += game.creatorBetAmount;
        await user.save();
      }

      // Delete the game
      await Coinflip.findByIdAndDelete(gameId);

      return res.json({ message: 'Balance-based game cancelled successfully, balance returned' });
    }

    // Handle item-based cancellation (existing logic)
    // Return items to user's inventory atomically
    const Inventory = require('../models/Inventory');
    let inventory = await Inventory.findOne({ userId });

    if (!inventory) {
      inventory = new Inventory({
        userId,
        items: []
      });
      await inventory.save();
    }

    // Add items back to inventory with unique IDs
    const newItems = game.items.map(item => createInventoryItem(item.itemId));

    // Atomically add items to inventory using $push with $each
    const updateResult = await Inventory.updateOne(
      { _id: inventory._id },
      { $push: { items: { $each: newItems } } }
    );

    if (updateResult.modifiedCount === 0 && !inventory._id) {
      // If inventory was just created, try again with the new _id
      const retryResult = await Inventory.updateOne(
        { _id: inventory._id },
        { $push: { items: { $each: newItems } } }
      );
      if (retryResult.modifiedCount === 0) {
        console.log('Failed to add items to new inventory');
        return res.status(500).json({ error: 'Failed to return items to inventory' });
      }
    }

    // Refresh inventory after atomic update
    inventory = await Inventory.findOne({ userId });

    // Populate inventory items for socket emission
    const populatedInventory = await populateItemDetails(inventory.items);
    const responseInventory = {
      ...inventory.toObject(),
      items: populatedInventory
    };

    // Emit inventory update event
    emitInventoryUpdate(userId, responseInventory);

    // Delete the game
    await Coinflip.findByIdAndDelete(gameId);

    res.json({ message: 'Game cancelled successfully, items returned to inventory' });
  } catch (error) {
    console.error('Error cancelling game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
