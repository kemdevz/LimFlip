const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Get recent messages (last 50)
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      username: msg.username,
      message: msg.message,
      time: new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: msg.avatarUrl,
      isWhale: msg.isWhale
    }));

    // Reverse to show oldest first
    res.json(formattedMessages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new message (called by socket handler)
router.post('/', async (req, res) => {
  try {
    const { username, message, avatarUrl, isWhale } = req.body;

    if (!username || !message) {
      return res.status(400).json({ error: 'Username and message are required' });
    }

    if (message.length > 75) {
      return res.status(400).json({ error: 'Message too long (max 75 characters)' });
    }

    const newMessage = new Message({
      username,
      message,
      avatarUrl: avatarUrl || '/assets/images/coinflip/item_1side.png',
      isWhale: isWhale || false
    });

    await newMessage.save();

    // Format for frontend
    const formattedMessage = {
      username: newMessage.username,
      message: newMessage.message,
      time: new Date(newMessage.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      avatarUrl: newMessage.avatarUrl,
      isWhale: newMessage.isWhale
    };

    res.json(formattedMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear old messages (keep only last 100)
router.delete('/cleanup', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).skip(100);
    
    if (messages.length > 0) {
      const idsToDelete = messages.map(m => m._id);
      await Message.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.json({ message: 'Old messages cleaned up' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
