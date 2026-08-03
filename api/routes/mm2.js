const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const API_KEY = "NIGGA";

// Get io instance from server (will be set by server.js)
let io;

const setIo = (socketIo) => {
  io = socketIo;
};

module.exports = { router, setIo };

// Middleware to verify API key
const verifyApiKey = (req, res, next) => {
  const providedKey = req.body.SecurityKey || req.body.key || req.headers['x-api-key'];
  if (providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// Ping bot status
router.post('/ping-bot', (req, res) => {
  try {
    const { botId } = req.body;
    console.log(`Bot ping received from: ${botId}`);
    res.json({ status: 'ok', message: 'Bot status updated' });
  } catch (error) {
    console.error('Ping bot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Withdraw - Get session (check eligibility and get items)
router.post('/withdraw/get-session', async (req, res) => {
  try {
    const { Data } = req.body;
    const { UserId } = Data;

    const user = await User.findOne({ robloxUserId: UserId });
    if (!user) {
      return res.json({ Exists: false, Items: [] });
    }

    const inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory || !inventory.items || inventory.items.length === 0) {
      return res.json({ Exists: true, Items: [] });
    }

    // Get item details for inventory items
    const itemIds = inventory.items.map(i => i.itemId);
    const items = await Item.find({ itemId: { $in: itemIds } });

    // Map inventory items with their details
    const itemsWithDetails = inventory.items.map(invItem => {
      const itemDetails = items.find(i => i.itemId === invItem.itemId);
      return {
        _id: invItem.uniqueId,
        itemId: invItem.itemId,
        inGameUID: itemDetails?.itemId || invItem.itemId,
        name: itemDetails?.name || 'Unknown',
        value: itemDetails?.value || 0,
        image: itemDetails?.image || ''
      };
    });

    res.json({ Exists: true, Items: itemsWithDetails });
  } catch (error) {
    console.error('Withdraw get-session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Withdraw - Confirm session (remove items from inventory)
router.post('/withdraw/confirm-session', verifyApiKey, async (req, res) => {
  try {
    const { Data } = req.body;
    const { UserId, currentWithdraw } = Data;

    const user = await User.findOne({ robloxUserId: UserId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    // Remove withdrawn items from inventory
    const withdrawnIds = currentWithdraw || [];
    inventory.items = inventory.items.filter(item => !withdrawnIds.includes(item.uniqueId));

    // Recalculate total value
    const itemIds = inventory.items.map(i => i.itemId);
    const items = await Item.find({ itemId: { $in: itemIds } });
    inventory.totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);

    await inventory.save();

    console.log(`Withdrawal confirmed for user ${UserId}: ${withdrawnIds.length} items`);
    res.json({ success: true, message: 'Withdrawal confirmed' });
  } catch (error) {
    console.error('Withdraw confirm-session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deposit - Add items to inventory
router.post('/deposit', verifyApiKey, async (req, res) => {
  try {
    const { Data } = req.body;
    const { UserId, items } = Data;

    const user = await User.findOne({ robloxUserId: UserId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get or create inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      inventory = new Inventory({
        userId: user._id,
        items: [],
        totalValue: 0
      });
    }

    // Add deposited items to inventory
    for (const itemData of items) {
      // Find or create item in database
      let item = await Item.findOne({ itemId: itemData.inGameUID });
      
      if (!item) {
        // Create new item if it doesn't exist
        item = new Item({
          itemId: itemData.inGameUID,
          name: itemData.name,
          value: 0, // Will need to be updated later
          rarity: itemData.rarity?.toLowerCase() || 'common',
          category: itemData.itemType?.toLowerCase() || 'weapon',
          image: itemData.assetId || ''
        });
        await item.save();
      }

      // Add to inventory
      const uniqueId = `${item.itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      inventory.items.push({
        uniqueId,
        itemId: item.itemId,
        acquiredAt: new Date()
      });
    }

    // Recalculate total value
    const itemIds = inventory.items.map(i => i.itemId);
    const dbItems = await Item.find({ itemId: { $in: itemIds } });
    inventory.totalValue = dbItems.reduce((sum, item) => sum + (item.value || 0), 0);

    await inventory.save();

    console.log(`Deposit confirmed for user ${UserId}: ${items.length} items`);

    // Emit socket notification to user
    if (io) {
      io.emit('deposit-received', {
        userId: user._id.toString(),
        username: user.username,
        itemCount: items.length,
        totalValue: inventory.totalValue
      });
    }

    res.json({ success: true, message: 'Deposit confirmed' });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
