const express = require('express');
const jwt = require('jsonwebtoken');
const Giveaway = require('../models/Giveaway');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

    // Calculate total value
    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);

    // Check if user has enough balance
    if (user.balance < totalValue) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from user balance
    user.balance -= totalValue;
    await user.save();

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

    // Add user to participants
    giveaway.participants.push(req.userId);
    await giveaway.save();

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

module.exports = router;
