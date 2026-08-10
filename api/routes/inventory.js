const express = require('express');
const router = express.Router();
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

// Get user's inventory with populated item details
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let inventory = await Inventory.findOne({ userId }).populate('userId', 'username');
    
    if (!inventory) {
      // Create empty inventory for user
      inventory = new Inventory({ userId, items: [] });
      await inventory.save();
    }
    
    // Populate item details for each inventory item
    const populatedItems = await Promise.all(
      inventory.items.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId });
        if (itemDef) {
          return {
            ...invItem.toObject(),
            name: itemDef.name,
            image: itemDef.image,
            rarity: itemDef.rarity,
            value: itemDef.value,
            mm2Value: itemDef.mm2Value,
            category: itemDef.category
          };
        }
        return invItem;
      })
    );
    
    const responseInventory = inventory.toObject();
    responseInventory.items = populatedItems;
    
    res.json(responseInventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to inventory
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ error: 'Missing itemId' });
    }
    
    // Check if item exists in Items collection
    const itemDef = await Item.findOne({ itemId });
    if (!itemDef) {
      return res.status(404).json({ error: 'Item not found in database' });
    }
    
    let inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      inventory = new Inventory({ userId, items: [] });
    }
    
    // Generate unique ID for this inventory item
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    inventory.items.push({
      uniqueId,
      itemId,
      acquiredAt: new Date()
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
    
    res.json({ message: 'Item added to inventory', inventory });
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from inventory by uniqueId
router.delete('/:userId/remove/:uniqueId', async (req, res) => {
  try {
    const { userId, uniqueId } = req.params;
    
    const inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    const itemIndex = inventory.items.findIndex(item => item.uniqueId === uniqueId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }
    
    inventory.items.splice(itemIndex, 1);
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
    
    res.json({ message: 'Item removed from inventory', inventory });
  } catch (error) {
    console.error('Error removing item from inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item in inventory by uniqueId
router.put('/:userId/update/:uniqueId', async (req, res) => {
  try {
    const { userId, uniqueId } = req.params;
    const updates = req.body;
    
    const inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }
    
    const item = inventory.items.find(item => item.uniqueId === uniqueId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }
    
    // Only allow updating certain fields
    const allowedUpdates = ['itemId'];
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });
    
    Object.assign(item, filteredUpdates);
    await inventory.save();
    
    res.json({ message: 'Item updated in inventory', inventory });
  } catch (error) {
    console.error('Error updating item in inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
