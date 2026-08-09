const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');
const UpgraderHistory = require('../models/UpgraderHistory');

// MM2 Empire API token
const MM2_EMPIRE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4MzZmOWU3ZTc1MTFiOWUzNGZjODYiLCJ0eXBlIjoiYWNjZXNzIiwianRpIjoiemNsWEFQbE55RjVQTWVRQSIsImlhdCI6MTc4NjI3NDc1OCwiZXhwIjoxNzg2Mjc1NjU4LCJhdXRoX3RpbWUiOjE3ODYyNjMyODksImFtciI6WyJyb2Jsb3giXX0.cLZOdLq0Zf4WaJo7ELQ-ZHRSzimCr28KTNM6qU--R5o';

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

// Get third party stock from MM2 Empire
router.get('/third-party-stock', async (req, res) => {
  try {
    // Fetch wallet balance first
    const walletResponse = await fetch('https://api.mm2empire.com/wallet', {
      headers: {
        'authorization': `Bearer ${MM2_EMPIRE_TOKEN}`,
        'Referer': 'https://mm2empire.com/'
      }
    });
    const walletData = await walletResponse.json();
    const walletBalance = walletData?.balance || 0;

    // Fetch marketplace items
    const response = await fetch('https://api.mm2empire.com/marketplace?group_by_item=true&limit=48&offset=0&sort=price_desc&v=200');
    const data = await response.json();
    
    if (data && data.items) {
      const items = [];
      data.items.forEach((item) => {
        const availableCount = item.availableCount || 1;
        const price = item.priceCoins || item.itemDetails?.itemValue || 0;
        
        // Only include items we can afford
        if (price <= walletBalance) {
          for (let i = 0; i < availableCount; i++) {
            items.push({
              name: item.itemDetails?.itemName || item.itemDetails?.name || 'Unknown',
              price: price,
              img: item.itemDetails?.itemImage || item.itemDetails?.image || '/assets/wallet/mm2.png',
              uniqueId: `${item.id || item.itemDetails?.id}_${i}`,
              itemId: item.itemDetails?.id || item.id,
              isThirdParty: true
            });
          }
        }
      });
      
      res.json({ items, walletBalance });
    } else {
      res.json({ items: [], walletBalance });
    }
  } catch (error) {
    console.error('Error fetching third party stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
    
    let desiredItem, desiredValue, desiredItemDef, isThirdParty = false;

    // Check if desired item exists in site stock inventory
    const desiredItemIndex = stockInventory.items.findIndex(item => item.uniqueId === desiredItemId);
    if (desiredItemIndex !== -1) {
      // Site stock item
      desiredItem = stockInventory.items[desiredItemIndex];
      desiredItemDef = await Item.findOne({ itemId: desiredItem.itemId });
      desiredValue = desiredItemDef?.value || 0;
    } else {
      // Third party item - fetch from MM2 Empire API
      isThirdParty = true;
      const response = await fetch('https://api.mm2empire.com/marketplace?group_by_item=true&limit=48&offset=0&sort=price_desc&v=200');
      const data = await response.json();
      
      if (data && data.items) {
        const thirdPartyItem = data.items.find(item => item.id === desiredItemId);
        if (thirdPartyItem) {
          desiredItem = {
            itemId: thirdPartyItem.id,
            name: thirdPartyItem.itemDetails?.itemName || thirdPartyItem.itemDetails?.name || 'Unknown',
            price: thirdPartyItem.priceCoins || thirdPartyItem.itemDetails?.itemValue || 0,
            img: thirdPartyItem.itemDetails?.itemImage || thirdPartyItem.itemDetails?.image || '/assets/wallet/mm2.png'
          };
          desiredValue = desiredItem.price;
          desiredItemDef = {
            name: desiredItem.name,
            image: desiredItem.img,
            value: desiredValue,
            itemId: desiredItem.itemId
          };
        } else {
          return res.status(404).json({ error: 'Third party item not found' });
        }
      } else {
        return res.status(500).json({ error: 'Failed to fetch third party stock' });
      }
    }
    
    // Get item values for input items
    const inputItemDefs = await Promise.all(
      inputItems.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId });
        return itemDef;
      })
    );
    
    const inputValue = inputItemDefs.reduce((sum, item) => sum + (item?.value || 0), 0);
    
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

      if (isThirdParty) {
        // For third party items, we need to purchase from MM2 Empire
        // First, create the item in our database if it doesn't exist
        let itemDef = await Item.findOne({ itemId: desiredItem.itemId });
        if (!itemDef) {
          itemDef = new Item({
            itemId: desiredItem.itemId,
            name: desiredItem.name,
            image: desiredItem.img,
            value: desiredValue,
            rarity: 'godly',
            category: 'gun'
          });
          await itemDef.save();
        }

        // Add purchased item to user inventory
        const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        userInventory.items.push({
          uniqueId: newUniqueId,
          itemId: desiredItem.itemId,
          acquiredAt: new Date()
        });

        // Purchase from MM2 Empire (simplified - in production you'd handle the actual purchase)
        try {
          await fetch('https://api.mm2empire.com/marketplace/purchase', {
            method: 'POST',
            headers: {
              'authorization': `Bearer ${MM2_EMPIRE_TOKEN}`,
              'Content-Type': 'application/json',
              'Referer': 'https://mm2empire.com/'
            },
            body: JSON.stringify({
              listingId: desiredItem.itemId,
              quantity: 1
            })
          });
        } catch (purchaseError) {
          console.error('Error purchasing from MM2 Empire:', purchaseError);
          // Continue anyway - item is already added to user inventory
        }
      } else {
        // Site stock item
        const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        userInventory.items.push({
          uniqueId: newUniqueId,
          itemId: desiredItem.itemId,
          acquiredAt: new Date()
        });

        // Remove desired item from stock inventory
        const desiredItemIndex = stockInventory.items.findIndex(item => item.uniqueId === desiredItemId);
        if (desiredItemIndex !== -1) {
          stockInventory.items.splice(desiredItemIndex, 1);
        }
      }

      try {
        await userInventory.save();
      } catch (versionError) {
        if (versionError.name === 'VersionError') {
          userInventory = await Inventory.findOne({ userId });
          userInventory.items = userInventory.items.filter(
            item => !inputItemIds.includes(item.uniqueId)
          );
          userInventory.items.push({
            uniqueId: newUniqueId,
            itemId: desiredItem.itemId,
            acquiredAt: new Date()
          });
          await userInventory.save();
        } else {
          throw versionError;
        }
      }

      if (!isThirdParty) {
        try {
          await stockInventory.save();
        } catch (versionError) {
          if (versionError.name === 'VersionError') {
            stockInventory = await Inventory.findOne({ userId: stockUser._id });
            const desiredItemIndex = stockInventory.items.findIndex(
              item => item.uniqueId === desiredItemId
            );
            if (desiredItemIndex !== -1) {
              stockInventory.items.splice(desiredItemIndex, 1);
            }
            await stockInventory.save();
          } else {
            throw versionError;
          }
        }
      }

      // Save to upgrader history
      const historyEntry = new UpgraderHistory({
        userId,
        username: (await User.findById(userId)).username,
        avatar: (await User.findById(userId)).avatar || '',
        inputItems: inputItems.map(item => ({
          uniqueId: item.uniqueId,
          itemId: item.itemId,
          name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || '',
          image: inputItemDefs.find(def => def?.itemId === item.itemId)?.image || '',
          value: inputItemDefs.find(def => def?.itemId === item.itemId)?.value || 0
        })),
        outputItem: {
          uniqueId: newUniqueId,
          itemId: desiredItem.itemId,
          name: desiredItemDef?.name || '',
          image: desiredItemDef?.image || '',
          value: desiredValue
        },
        inputValue,
        outputValue: desiredValue,
        winChance,
        won: true,
        multiplier: desiredValue / inputValue,
        isThirdParty
      });
      await historyEntry.save();

      // Emit socket events
      if (io) {
        const populatedUserInventory = await populateItemDetails(userInventory.items);
        io.emit('inventory-updated', {
          userId,
          inventory: { ...userInventory.toObject(), items: populatedUserInventory }
        });

        if (!isThirdParty) {
          const populatedStockInventory = await populateItemDetails(stockInventory.items);
          io.emit('inventory-updated', {
            userId: stockUser._id,
            inventory: { ...stockInventory.toObject(), items: populatedStockInventory }
          });
        }

        // Emit third party stock update
        io.emit('third-party-stock-updated');
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

      // If third party item was desired, add it to site stock
      if (isThirdParty && desiredItem) {
        let itemDef = await Item.findOne({ itemId: desiredItem.itemId });
        if (!itemDef) {
          itemDef = new Item({
            itemId: desiredItem.itemId,
            name: desiredItem.name,
            image: desiredItem.img,
            value: desiredValue,
            rarity: 'godly',
            category: 'gun'
          });
          await itemDef.save();
        }

        const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        stockInventory.items.push({
          uniqueId: newUniqueId,
          itemId: desiredItem.itemId,
          acquiredAt: new Date()
        });
      }

      try {
        await userInventory.save();
      } catch (versionError) {
        if (versionError.name === 'VersionError') {
          userInventory = await Inventory.findOne({ userId });
          userInventory.items = userInventory.items.filter(
            item => !inputItemIds.includes(item.uniqueId)
          );
          await userInventory.save();
        } else {
          throw versionError;
        }
      }

      try {
        await stockInventory.save();
      } catch (versionError) {
        if (versionError.name === 'VersionError') {
          stockInventory = await Inventory.findOne({ userId: stockUser._id });
          for (const inputItem of inputItems) {
            const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            stockInventory.items.push({
              uniqueId: newUniqueId,
              itemId: inputItem.itemId,
              acquiredAt: new Date()
            });
          }
          if (isThirdParty && desiredItem) {
            const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            stockInventory.items.push({
              uniqueId: newUniqueId,
              itemId: desiredItem.itemId,
              acquiredAt: new Date()
            });
          }
          await stockInventory.save();
        } else {
          throw versionError;
        }
      }

      // Save to upgrader history
      const historyEntry = new UpgraderHistory({
        userId,
        username: (await User.findById(userId)).username,
        avatar: (await User.findById(userId)).avatar || '',
        inputItems: inputItems.map(item => ({
          uniqueId: item.uniqueId,
          itemId: item.itemId,
          name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || '',
          image: inputItemDefs.find(def => def?.itemId === item.itemId)?.image || '',
          value: inputItemDefs.find(def => def?.itemId === item.itemId)?.value || 0
        })),
        outputItem: null,
        inputValue,
        outputValue: 0,
        winChance,
        won: false,
        multiplier: 0,
        isThirdParty
      });
      await historyEntry.save();

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

        // Emit third party stock update
        io.emit('third-party-stock-updated');
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

// Get upgrader history (past games)
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await UpgraderHistory.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching upgrader history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
