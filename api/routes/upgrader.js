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

// Get stock account inventory
router.get('/stock/:robloxUserId', async (req, res) => {
  try {
    const { robloxUserId } = req.params;
    
    // Find user by robloxUserId first
    const user = await User.findOne({ robloxUserId });
    if (!user) {
      return res.status(404).json({ error: 'Stock account user not found' });
    }
    
    let inventory = await Inventory.findOne({ userId: user._id }).populate('userId', 'username');
    
    if (!inventory) {
      // Create empty inventory for stock account
      inventory = new Inventory({ userId: user._id, items: [] });
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
    console.error('Error fetching stock inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process upgrade attempt
router.post('/upgrade', async (req, res) => {
  try {
    const { userId, stockRobloxUserId, inputItemIds, desiredItemId } = req.body;

    if (!userId || !stockRobloxUserId || !inputItemIds || !desiredItemId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find stock user by robloxUserId
    const stockUser = await User.findOne({ robloxUserId: stockRobloxUserId });
    if (!stockUser) {
      return res.status(404).json({ error: 'Stock account user not found' });
    }

    // Get user inventory
    const userInventory = await Inventory.findOne({ userId });
    if (!userInventory) {
      return res.status(404).json({ error: 'User inventory not found' });
    }

    // Get stock inventory
    const stockInventory = await Inventory.findOne({ userId: stockUser._id });
    if (!stockInventory) {
      return res.status(404).json({ error: 'Stock inventory not found' });
    }
    
    // Verify input items exist in user inventory
    const inputItems = [];
    for (const uniqueId of inputItemIds) {
      const itemIndex = userInventory.items.findIndex(item => item.uniqueId === uniqueId);
      if (itemIndex === -1) {
        return res.status(400).json({ error: 'Input item not found in user inventory' });
      }
      inputItems.push(userInventory.items[itemIndex]);
    }
    
    // Verify desired item exists in stock inventory
    const desiredItemIndex = stockInventory.items.findIndex(item => item.uniqueId === desiredItemId);
    if (desiredItemIndex === -1) {
      return res.status(400).json({ error: 'Desired item not found in stock inventory' });
    }
    const desiredItem = stockInventory.items[desiredItemIndex];
    
    // Get item values
    const inputItemDefs = await Promise.all(
      inputItems.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId });
        return itemDef;
      })
    );
    
    const desiredItemDef = await Item.findOne({ itemId: desiredItem.itemId });
    
    const inputValue = inputItemDefs.reduce((sum, item) => sum + (item?.value || 0), 0);
    const desiredValue = desiredItemDef?.value || 0;
    
    // Calculate win chance (input value / desired value * 100)
    const winChance = (inputValue / desiredValue) * 100;
    
    // Determine win/lose based on chance
    const randomRoll = Math.random() * 100;
    const won = randomRoll < winChance;
    
    if (won) {
      // User wins - transfer desired item to user, remove input items from user
      // Remove input items from user inventory
      userInventory.items = userInventory.items.filter(
        item => !inputItemIds.includes(item.uniqueId)
      );
      
      // Add desired item to user inventory
      const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      userInventory.items.push({
        uniqueId: newUniqueId,
        itemId: desiredItem.itemId,
        acquiredAt: new Date()
      });
      
      // Remove desired item from stock inventory
      stockInventory.items.splice(desiredItemIndex, 1);
      
      await userInventory.save();
      await stockInventory.save();

      // Emit socket events
      if (io) {
        const populatedUserInventory = await populateItemDetails(userInventory.items);
        io.emit('inventory-updated', {
          userId,
          inventory: { ...userInventory.toObject(), items: populatedUserInventory }
        });

        const populatedStockInventory = await populateItemDetails(stockInventory.items);
        io.emit('inventory-updated', {
          userId: stockUser._id,
          inventory: { ...stockInventory.toObject(), items: populatedStockInventory }
        });
      }

      res.json({
        success: true,
        won: true,
        winChance: winChance.toFixed(2),
        inputValue,
        desiredValue,
        message: 'Upgrade successful! You won the desired item.'
      });
    } else {
      // User loses - transfer input items to stock account
      // Remove input items from user inventory
      userInventory.items = userInventory.items.filter(
        item => !inputItemIds.includes(item.uniqueId)
      );
      
      // Add input items to stock inventory
      for (const inputItem of inputItems) {
        const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        stockInventory.items.push({
          uniqueId: newUniqueId,
          itemId: inputItem.itemId,
          acquiredAt: new Date()
        });
      }
      
      await userInventory.save();
      await stockInventory.save();

      // Emit socket events
      if (io) {
        const populatedUserInventory = await populateItemDetails(userInventory.items);
        io.emit('inventory-updated', {
          userId,
          inventory: { ...userInventory.toObject(), items: populatedUserInventory }
        });

        const populatedStockInventory = await populateItemDetails(stockInventory.items);
        io.emit('inventory-updated', {
          userId: stockUser._id,
          inventory: { ...stockInventory.toObject(), items: populatedStockInventory }
        });
      }

      res.json({
        success: true,
        won: false,
        winChance: winChance.toFixed(2),
        inputValue,
        desiredValue,
        message: 'Upgrade failed. Your items were transferred to the stock account.'
      });
    }
  } catch (error) {
    console.error('Error processing upgrade:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
