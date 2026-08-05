const express = require('express');
const jwt = require('jsonwebtoken');
const Marketplace = require('../models/Marketplace');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

let io;

const setIo = (socketIo) => {
  io = socketIo;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Get all active marketplace listings
router.get('/listings', async (req, res) => {
  try {
    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = { status: 'active' };
    
    if (search) {
      const items = await Item.find({ name: { $regex: search, $options: 'i' } });
      const itemIds = items.map(item => item._id);
      query.item = { $in: itemIds };
    }
    
    const sortOrder = order === 'asc' ? 1 : -1;
    
    const listings = await Marketplace.find(query)
      .populate('seller', 'username avatarUrl')
      .populate('item', 'name image rarity value category')
      .sort({ [sort]: sortOrder })
      .limit(100);
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get user's own listings
router.get('/my-listings', authenticateToken, async (req, res) => {
  try {
    const listings = await Marketplace.find({ 
      seller: req.userId,
      status: { $in: ['active', 'sold'] }
    })
    .populate('item', 'name image rarity value category')
    .populate('buyer', 'username')
    .sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Create a new listing
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { inventoryItemUniqueId, price } = req.body;
    
    if (!inventoryItemUniqueId || !price) {
      return res.status(400).json({ error: 'Inventory item unique ID and price are required' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    
    // Get user's inventory
    const inventory = await Inventory.findOne({ userId: req.userId });
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    // Find the item in inventory
    const inventoryItem = inventory.items.find(item => item.uniqueId === inventoryItemUniqueId);
    if (!inventoryItem) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }
    
    // Get item details
    const item = await Item.findOne({ itemId: inventoryItem.itemId });
    if (!item) {
      return res.status(404).json({ error: 'Item not found in database' });
    }
    
    // Check if item is already listed
    const existingListing = await Marketplace.findOne({
      inventoryItemUniqueId,
      status: 'active'
    });
    
    if (existingListing) {
      return res.status(400).json({ error: 'Item is already listed for sale' });
    }
    
    // Create listing
    const listing = new Marketplace({
      seller: req.userId,
      item: item._id,
      inventoryItemUniqueId,
      price,
      status: 'active'
    });
    
    await listing.save();

    // Fetch updated inventory with populated item details
    const updatedInventory = await Inventory.findOne({ userId: req.userId });
    const populatedInventory = updatedInventory ? {
      ...updatedInventory.toObject(),
      items: await Promise.all(updatedInventory.items.map(async (item) => {
        const itemDetails = await Item.findOne({ itemId: item.itemId });
        return {
          ...item.toObject(),
          name: itemDetails?.name || item.name,
          image: itemDetails?.image || item.image,
          rarity: itemDetails?.rarity || item.rarity,
          value: itemDetails?.value || item.value,
          category: itemDetails?.category || item.category
        };
      }))
    } : null;

    // Emit inventory update event
    if (io) {
      io.emit('inventory-updated', { userId: req.userId, inventory: populatedInventory });
    }

    // Populate item details for response
    await listing.populate('item', 'name image rarity value category');

    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Buy a listing
router.post('/buy/:listingId', authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Find the listing
    const listing = await Marketplace.findById(listingId)
      .populate('seller', 'username balance')
      .populate('item', 'itemId name image rarity value category');
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Listing is no longer available' });
    }
    
    if (listing.seller._id.toString() === req.userId) {
      return res.status(400).json({ error: 'Cannot buy your own listing' });
    }
    
    // Get buyer's user document
    const buyer = await User.findById(req.userId);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }
    
    // Check if buyer has enough balance
    if (buyer.balance < listing.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Get seller's user document
    const seller = await User.findById(listing.seller._id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    
    // Get buyer's inventory
    const buyerInventory = await Inventory.findOne({ userId: req.userId });
    if (!buyerInventory) {
      return res.status(404).json({ error: 'Buyer inventory not found' });
    }
    
    // Get seller's inventory
    const sellerInventory = await Inventory.findOne({ userId: listing.seller._id });
    if (!sellerInventory) {
      return res.status(404).json({ error: 'Seller inventory not found' });
    }
    
    // Find and remove item from seller's inventory
    const sellerItemIndex = sellerInventory.items.findIndex(
      item => item.uniqueId === listing.inventoryItemUniqueId
    );
    
    if (sellerItemIndex === -1) {
      return res.status(400).json({ error: 'Item no longer in seller\'s inventory' });
    }
    
    const [removedItem] = sellerInventory.items.splice(sellerItemIndex, 1);
    
    // Add item to buyer's inventory
    buyerInventory.items.push({
      uniqueId: removedItem.uniqueId,
      itemId: removedItem.itemId,
      acquiredAt: new Date()
    });
    
    // Transfer balance
    buyer.balance -= listing.price;
    seller.balance += listing.price;
    
    // Update listing status
    listing.status = 'sold';
    listing.buyer = req.userId;
    listing.soldAt = new Date();
    
    // Save all changes
    await sellerInventory.save();
    await buyerInventory.save();
    await buyer.save();
    await seller.save();
    await listing.save();

    // Emit inventory update events for both buyer and seller
    if (io) {
      io.emit('inventory-updated', { userId: req.userId, inventory: buyerInventory });
      io.emit('inventory-updated', { userId: listing.seller._id.toString(), inventory: sellerInventory });
    }

    // Populate buyer info for response
    await listing.populate('buyer', 'username avatarUrl');

    res.json(listing);
  } catch (error) {
    console.error('Error buying listing:', error);
    res.status(500).json({ error: 'Failed to buy listing' });
  }
});

// Cancel a listing
router.post('/cancel/:listingId', authenticateToken, async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const listing = await Marketplace.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only cancel your own listings' });
    }
    
    if (listing.status !== 'active') {
      return res.status(400).json({ error: 'Can only cancel active listings' });
    }
    
    listing.status = 'cancelled';
    await listing.save();
    
    res.json(listing);
  } catch (error) {
    console.error('Error cancelling listing:', error);
    res.status(500).json({ error: 'Failed to cancel listing' });
  }
});

// Get recently sold listings
router.get('/recently-sold', async (req, res) => {
  try {
    const listings = await Marketplace.find({ status: 'sold' })
      .populate('seller', 'username avatarUrl')
      .populate('buyer', 'username avatarUrl')
      .populate('item', 'name image rarity value')
      .sort({ soldAt: -1 })
      .limit(12);
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching recently sold:', error);
    res.status(500).json({ error: 'Failed to fetch recently sold listings' });
  }
});

module.exports = { router, setIo };
