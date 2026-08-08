const express = require('express');
const jwt = require('jsonwebtoken');
const Giveaway = require('../models/Giveaway');
const User = require('../models/User');
const Coinflip = require('../models/Coinflip');
const Inventory = require('../models/Inventory');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Get io instance from server (will be set by server.js)
let io;

const setIo = (socketIo) => {
  io = socketIo;
};

// Function to check and complete ended giveaways
const checkAndCompleteGiveaways = async () => {
  try {
    const now = new Date();
    
    // Find all active giveaways that have ended
    const endedGiveaways = await Giveaway.find({
      status: 'active',
      endsAt: { $lte: now }
    });

    for (const giveaway of endedGiveaways) {
      console.log(`Completing giveaway ${giveaway._id} with ${giveaway.participants.length} participants`);
      
      // Select random winner from participants
      if (giveaway.participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * giveaway.participants.length);
        const winnerId = giveaway.participants[randomIndex];
        
        // Get winner user
        const winner = await User.findById(winnerId);
        
        if (winner) {
          // Add items to winner's inventory
          const winnerInventory = await Inventory.findOne({ userId: winnerId });
          if (winnerInventory) {
            winnerInventory.items.push(...giveaway.items);
            await winnerInventory.save();
            
            console.log(`Added ${giveaway.items.length} items to winner ${winner.username}'s inventory`);
          }
          
          // Update giveaway with winner
          giveaway.winner = winnerId;
          giveaway.status = 'completed';
          giveaway.completedAt = now;
          await giveaway.save();
          
          // Emit socket event for giveaway completed
          if (io) {
            io.emit('giveaway-completed', {
              giveawayId: giveaway._id,
              winner: {
                id: winner._id,
                username: winner.username,
                avatarUrl: winner.avatarUrl
              },
              items: giveaway.items,
              totalValue: giveaway.totalValue
            });
          }
          
          console.log(`Giveaway ${giveaway._id} completed. Winner: ${winner.username}`);
        }
      } else {
        // No participants, mark as completed without winner
        giveaway.status = 'completed';
        giveaway.completedAt = now;
        await giveaway.save();
        
        console.log(`Giveaway ${giveaway._id} completed with no participants`);
      }
    }
  } catch (error) {
    console.error('Error checking giveaways:', error);
  }
};

// Start the giveaway checker interval (run every 10 seconds)
let giveawayCheckerInterval;
const startGiveawayChecker = () => {
  if (giveawayCheckerInterval) {
    clearInterval(giveawayCheckerInterval);
  }
  giveawayCheckerInterval = setInterval(checkAndCompleteGiveaways, 10000);
  console.log('Giveaway checker started');
};

module.exports = { router, setIo, startGiveawayChecker };

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Create a new giveaway
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { items, duration } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!duration || isNaN(duration) || duration <= 0) {
      return res.status(400).json({ error: 'Valid duration is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user inventory
    const inventory = await Inventory.findOne({ userId: req.userId });
    if (!inventory) {
      return res.status(400).json({ error: 'Inventory not found' });
    }

    // Check if user owns all the items by itemId
    const inventoryItemIds = inventory.items.map(item => item.itemId);
    const missingItems = items.filter(item => !inventoryItemIds.includes(item.itemId));

    if (missingItems.length > 0) {
      return res.status(400).json({ error: 'You do not own all the selected items' });
    }

    // Remove items from inventory
    const itemIdsToRemove = items.map(item => item.itemId);
    inventory.items = inventory.items.filter(item => !itemIdsToRemove.includes(item.itemId));
    await inventory.save();

    // Calculate total value
    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);

    // Calculate end time
    const endsAt = new Date();
    endsAt.setMinutes(endsAt.getMinutes() + parseInt(duration));

    // Create giveaway
    const giveaway = new Giveaway({
      creator: req.userId,
      items,
      totalValue,
      duration: parseInt(duration),
      endsAt,
      participants: [req.userId]
    });

    await giveaway.save();

    // Emit socket event for new giveaway
    if (io) {
      io.emit('giveaway-created', {
        id: giveaway._id,
        creator: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl
        },
        items,
        totalValue,
        duration: parseInt(duration),
        endsAt,
        status: giveaway.status,
        participantCount: 1
      });
    }

    res.json({
      message: 'Giveaway created successfully',
      giveaway: {
        id: giveaway._id,
        creator: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl
        },
        items,
        totalValue,
        duration: parseInt(duration),
        endsAt,
        status: giveaway.status,
        participantCount: 1
      }
    });
  } catch (error) {
    console.error('Create giveaway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all active giveaways
router.get('/active', async (req, res) => {
  try {
    const giveaways = await Giveaway.find({ status: 'active' })
      .populate('creator', 'username avatarUrl')
      .populate('winner', 'username avatarUrl')
      .sort({ createdAt: -1 });

    const formattedGiveaways = giveaways.map(giveaway => ({
      id: giveaway._id,
      creator: {
        id: giveaway.creator._id,
        username: giveaway.creator.username,
        avatarUrl: giveaway.creator.avatarUrl
      },
      items: giveaway.items,
      totalValue: giveaway.totalValue,
      duration: giveaway.duration,
      endsAt: giveaway.endsAt,
      status: giveaway.status,
      participantCount: giveaway.participants.length,
      winner: giveaway.winner ? {
        id: giveaway.winner._id,
        username: giveaway.winner.username,
        avatarUrl: giveaway.winner.avatarUrl
      } : null
    }));

    res.json(formattedGiveaways);
  } catch (error) {
    console.error('Get active giveaways error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join a giveaway
router.post('/:giveawayId/join', authenticateToken, async (req, res) => {
  try {
    const { giveawayId } = req.params;

    const giveaway = await Giveaway.findById(giveawayId);
    if (!giveaway) {
      return res.status(404).json({ error: 'Giveaway not found' });
    }

    if (giveaway.status !== 'active') {
      return res.status(400).json({ error: 'Giveaway is not active' });
    }

    if (giveaway.participants.includes(req.userId)) {
      return res.status(400).json({ error: 'Already joined this giveaway' });
    }

    // Check if giveaway has ended
    if (new Date() > giveaway.endsAt) {
      return res.status(400).json({ error: 'Giveaway has ended' });
    }

    // Check if user has completed a coinflip in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCoinflip = await Coinflip.findOne({
      $or: [
        { creator: req.userId },
        { joiner: req.userId }
      ],
      status: 'completed',
      completedAt: { $gte: twentyFourHoursAgo }
    });

    if (!recentCoinflip) {
      return res.status(400).json({ error: 'You must complete a coinflip within the last 24 hours to join a giveaway' });
    }

    // Add user to participants
    giveaway.participants.push(req.userId);
    await giveaway.save();

    // Emit socket event for giveaway join
    if (io) {
      io.emit('giveaway-joined', {
        giveawayId: giveaway._id,
        participantCount: giveaway.participants.length
      });
    }

    res.json({
      message: 'Joined giveaway successfully',
      participantCount: giveaway.participants.length
    });
  } catch (error) {
    console.error('Join giveaway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get giveaway by ID
router.get('/:giveawayId', async (req, res) => {
  try {
    const { giveawayId } = req.params;

    const giveaway = await Giveaway.findById(giveawayId)
      .populate('creator', 'username avatarUrl')
      .populate('participants', 'username avatarUrl')
      .populate('winner', 'username avatarUrl');

    if (!giveaway) {
      return res.status(404).json({ error: 'Giveaway not found' });
    }

    res.json({
      id: giveaway._id,
      creator: {
        id: giveaway.creator._id,
        username: giveaway.creator.username,
        avatarUrl: giveaway.creator.avatarUrl
      },
      items: giveaway.items,
      totalValue: giveaway.totalValue,
      duration: giveaway.duration,
      endsAt: giveaway.endsAt,
      status: giveaway.status,
      participants: giveaway.participants.map(p => ({
        id: p._id,
        username: p.username,
        avatarUrl: p.avatarUrl
      })),
      participantCount: giveaway.participants.length,
      winner: giveaway.winner ? {
        id: giveaway.winner._id,
        username: giveaway.winner.username,
        avatarUrl: giveaway.winner.avatarUrl
      } : null,
      createdAt: giveaway.createdAt,
      completedAt: giveaway.completedAt
    });
  } catch (error) {
    console.error('Get giveaway error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
