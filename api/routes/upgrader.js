const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');
const UpgraderHistory = require('../models/UpgraderHistory');

// MM2 Empire API tokens
let MM2_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4MzZmOWU3ZTc1MTFiOWUzNGZjODYiLCJ0eXBlIjoiYWNjZXNzIiwianRpIjoidEJ6OWxXZmE2ZVVyN3ZOWiIsImlhdCI6MTc4NjMwMDQxOSwiZXhwIjoxNzg2MzAxMzE5LCJhdXRoX3RpbWUiOjE3ODYzMDA0MTEsImFtciI6WyJyb2Jsb3giLCJlbWFpbCJdLCJtZmFfYXQiOjE3ODYzMDA0MTl9.H2s4nBm-RVgn_-SnVuO_4yph2CukX81fAID3MmQOtUM';
let MM2_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4MzZmOWU3ZTc1MTFiOWUzNGZjODYiLCJ0eXBlIjoicmVmcmVzaCIsImp0aSI6IkdIU0FsSEkzWmNnZ0M1ZU1QaURvZTJkSzZ0RE90VktpIiwiaWF0IjoxNzg2MzAwNDE5LCJleHAiOjE3ODg4OTI0MTksImF1dGhfdGltZSI6MTc4NjMwMDQxMSwiYW1yIjpbInJvYmxveCIsImVtYWlsIl0sIm1mYV9hdCI6MTc4NjMwMDQxOX0.32DkBL-zzc9VXgsu3TlxEvWIuk8QAf74AJFK2eSfvzw';

// Discord webhook URL for upgrader notifications
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1536061298742132896/0_yl4FDrojAtnLSIMsXHhdQj4ZkWnkPpdrTk6OER4s2-l09TsqMKvdg31gk2thzOBfiX';

// Helper function to refresh MM2 Empire access token
const refreshMM2Token = async () => {
  try {
    console.log('Attempting to refresh MM2 Empire token...');
    const response = await fetch('https://api.mm2empire.com/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: MM2_REFRESH_TOKEN
      })
    });
    
    console.log('Refresh response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Refresh response data:', data);
      if (data.accessToken) {
        MM2_ACCESS_TOKEN = data.accessToken;
        if (data.refreshToken) {
          MM2_REFRESH_TOKEN = data.refreshToken;
        }
        console.log('MM2 Empire token refreshed successfully');
        return data.accessToken;
      } else {
        console.error('No accessToken in refresh response:', data);
      }
    } else {
      const errorText = await response.text();
      console.error('Refresh failed with status:', response.status, 'Error:', errorText);
    }
  } catch (error) {
    console.error('Error refreshing MM2 Empire token:', error);
  }
  return MM2_ACCESS_TOKEN;
};

// Helper function to get valid MM2 Empire token
const getMM2Token = async () => {
  try {
    // Check if token is expired by decoding it
    const decoded = jwt.decode(MM2_ACCESS_TOKEN);
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      console.log('Token expires in:', timeUntilExpiry, 'seconds');
      // Refresh if token expires within 5 minutes
      if (timeUntilExpiry < 300) {
        console.log('Token expiring soon, refreshing...');
        return await refreshMM2Token();
      }
    }
  } catch (error) {
    console.error('Error checking token expiration:', error);
  }
  return MM2_ACCESS_TOKEN;
};

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

// Helper function to send Discord webhook
const sendDiscordWebhook = async (username, won, inputValue, outputValue, inputItems, outputItem) => {
  try {
    const color = won ? 0x00ff00 : 0xff0000;
    const title = won ? '🎉 Upgrade Won!' : '❌ Upgrade Lost';
    const description = won 
      ? `**${username}** won an upgrade!\n**Input Value:** R${inputValue}\n**Output Value:** R${outputValue}\n**Multiplier:** ${(outputValue / inputValue).toFixed(2)}x`
      : `**${username}** lost an upgrade.\n**Input Value:** R${inputValue}\n**Output Value:** R${outputValue}`;

    const inputItemNames = inputItems.map(item => item.name).join(', ');
    const outputItemName = outputItem ? outputItem.name : 'None';

    const embed = {
      title: title,
      description: description,
      color: color,
      fields: [
        {
          name: 'Input Items',
          value: inputItemNames || 'None',
          inline: false
        },
        {
          name: 'Output Item',
          value: outputItemName,
          inline: false
        }
      ],
      timestamp: new Date().toISOString()
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
  }
};

// Get third party stock from MM2 Empire
router.get('/third-party-stock', async (req, res) => {
  try {
    // Get valid token (auto-refresh if needed)
    const token = await getMM2Token();
    
    // Fetch wallet balance from MM2 Empire
    const walletResponse = await fetch('https://api.mm2empire.com/wallet', {
      headers: {
        'authorization': `Bearer ${token}`,
        'Referer': 'https://mm2empire.com/'
      }
    });
    const walletData = await walletResponse.json();
    const walletBalance = walletData?.balances?.usd?.availableUsdCents || 0;

    // Fetch marketplace items (paginate to get all items)
    let allItems = [];
    let offset = 0;
    const limit = 200;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://api.mm2empire.com/marketplace?group_by_item=true&limit=${limit}&offset=${offset}&sort=price_desc&v=204`);
      const data = await response.json();
      
      if (data && data.items && data.items.length > 0) {
        allItems = allItems.concat(data.items);
        offset += limit;
        
        // If we got fewer items than the limit, we've reached the end
        if (data.items.length < limit) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }
    
    if (allItems && allItems.length > 0) {
      const items = [];
      
      // Get all item names to look up in MongoDB
      const itemNames = allItems.map(item => item.itemDetails?.itemName || item.itemDetails?.name).filter(name => name);
      console.log('Looking up MongoDB items for names:', itemNames.slice(0, 5), '...');
      const mongoItems = await Item.find({ name: { $in: itemNames } });
      console.log('Found MongoDB items:', mongoItems.length);
      const mongoItemMap = new Map(mongoItems.map(item => [item.name, item.value]));
      
      allItems.forEach((item) => {
        const availableCount = item.availableCount || 1;
        const mm2Price = item.priceCoins || item.itemDetails?.itemValue || 0;
        const itemId = item.id || item.itemValueId;
        const itemName = item.itemDetails?.itemName || item.itemDetails?.name;
        
        // Use MongoDB value if available by name, otherwise use MM2 Empire price
        const value = mongoItemMap.get(itemName) || mm2Price;
        
        // Show 1.5x the value in third-party stock
        const displayPrice = value * 1.5;
        
        console.log(`Item ${itemName} (${itemId}): MM2 price=${mm2Price}, MongoDB value=${mongoItemMap.get(itemName)}, Using=${value}, Display=${displayPrice}`);
        
        // Only include items we can afford with MM2 Empire wallet balance
        if (mm2Price <= walletBalance && itemId) {
          for (let i = 0; i < availableCount; i++) {
            items.push({
              name: itemName || 'Unknown',
              price: displayPrice, // Show 1.5x value
              img: item.itemDetails?.itemImage || item.itemDetails?.image || '/assets/wallet/mm2.png',
              uniqueId: `${itemId}_${i}`,
              itemId: itemId,
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, stockRobloxUserId, inputItemIds, desiredItemId } = req.body;

    if (!userId || !stockRobloxUserId || !inputItemIds || !desiredItemId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find stock user by robloxUserId
    const stockUser = await User.findOne({ robloxUserId: stockRobloxUserId }).session(session);
    if (!stockUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Stock account user not found' });
    }

    // Get user inventory
    const userInventory = await Inventory.findOne({ userId }).session(session);
    if (!userInventory) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User inventory not found' });
    }

    // Get stock inventory
    const stockInventory = await Inventory.findOne({ userId: stockUser._id }).session(session);
    if (!stockInventory) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Stock inventory not found' });
    }
    
    // Verify input items exist in user inventory
    const inputItems = [];
    for (const uniqueId of inputItemIds) {
      const itemIndex = userInventory.items.findIndex(item => item.uniqueId === uniqueId);
      if (itemIndex === -1) {
        await session.abortTransaction();
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
      desiredItemDef = await Item.findOne({ itemId: desiredItem.itemId }).session(session);
      desiredValue = desiredItemDef?.value || 0;
    } else {
      // Third party item - fetch from MM2 Empire API
      isThirdParty = true;
      // Extract actual MM2 Empire item ID from uniqueId (format: itemId_index)
      const actualItemId = desiredItemId.split('_')[0];
      console.log('Looking for third-party item with ID:', actualItemId);
      
      // Fetch all marketplace items (same logic as third-party stock endpoint)
      let allItems = [];
      let offset = 0;
      const limit = 200;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`https://api.mm2empire.com/marketplace?group_by_item=true&limit=${limit}&offset=${offset}&sort=price_desc&v=204`);
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          allItems = allItems.concat(data.items);
          offset += limit;
          
          if (data.items.length < limit) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }
      
      if (allItems && allItems.length > 0) {
        const thirdPartyItem = allItems.find(item => (item.id === actualItemId || item.itemValueId === actualItemId));
        if (thirdPartyItem) {
          // Check if item exists in MongoDB by name to get our value
          const itemName = thirdPartyItem.itemDetails?.itemName || thirdPartyItem.itemDetails?.name;
          const mongoItem = await Item.findOne({ name: itemName }).session(session);
          const mm2Price = thirdPartyItem.priceCoins || thirdPartyItem.itemDetails?.itemValue || 0;
          
          console.log(`Upgrade item ${itemName} (${actualItemId}): MM2 price=${mm2Price}, MongoDB item found=${!!mongoItem}, MongoDB value=${mongoItem?.value}`);
          
          desiredItem = {
            itemId: thirdPartyItem.id || thirdPartyItem.itemValueId,
            itemValueId: thirdPartyItem.itemValueId,
            name: itemName || 'Unknown',
            price: mongoItem?.value || mm2Price, // Use MongoDB value if available
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
          console.log('Item not found. Looking for:', actualItemId, 'Available items:', allItems.map(i => i.id || i.itemValueId));
          await session.abortTransaction();
          return res.status(404).json({ error: 'Third party item not found' });
        }
      } else {
        await session.abortTransaction();
        return res.status(500).json({ error: 'Failed to fetch third party stock' });
      }
    }
    
    // Get item values for input items
    const inputItemDefs = await Promise.all(
      inputItems.map(async (invItem) => {
        const itemDef = await Item.findOne({ itemId: invItem.itemId }).session(session);
        return itemDef;
      })
    );
    
    const inputValue = inputItemDefs.reduce((sum, item) => sum + (item?.value || 0), 0);
    
    // Calculate win chance (input value / desired value * 100)
    const winChance = (inputValue / desiredValue) * 100;
    
    // Determine win/lose based on chance
    const randomRoll = Math.random() * 100;
    const won = randomRoll < winChance;
    
    const newUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (won) {
      // User wins - transfer desired item to user, remove input items from user
      // Remove input items from user inventory
      userInventory.items = userInventory.items.filter(
        item => !inputItemIds.includes(item.uniqueId)
      );

      if (isThirdParty) {
        // For third party items, we need to purchase from MM2 Empire
        // First, create the item in our database if it doesn't exist
        let itemDef = await Item.findOne({ itemId: desiredItem.itemId }).session(session);
        if (!itemDef) {
          itemDef = new Item({
            itemId: desiredItem.itemId,
            name: desiredItem.name,
            image: desiredItem.img,
            value: desiredValue,
            rarity: 'godly',
            category: 'gun'
          });
          await itemDef.save({ session });
        }

        // Add purchased item to user inventory
        userInventory.items.push({
          uniqueId: newUniqueId,
          itemId: desiredItem.itemId,
          acquiredAt: new Date()
        });

        // Purchase from MM2 Empire using checkout API
        try {
          const token = await getMM2Token();
          const idempotencyKey = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const checkoutResponse = await fetch('https://api.mm2empire.com/marketplace/checkout', {
            method: 'POST',
            headers: {
              'authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Idempotency-Key': idempotencyKey,
              'Referer': 'https://mm2empire.com/'
            },
            body: JSON.stringify({
              listingIds: [],
              stacks: [{
                itemValueId: desiredItem.itemValueId,
                priceCoins: desiredValue,
                quantity: 1
              }]
            })
          });
          
          if (!checkoutResponse.ok) {
            const errorText = await checkoutResponse.text();
            console.error('MM2 Empire checkout failed:', checkoutResponse.status, errorText);
          } else {
            console.log('MM2 Empire checkout successful');
          }
        } catch (purchaseError) {
          console.error('Error purchasing from MM2 Empire:', purchaseError);
          // Continue anyway - item is already added to user inventory
        }
      } else {
        // Site stock item
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

      await userInventory.save({ session });

      if (!isThirdParty) {
        await stockInventory.save({ session });
      }

      // Save to upgrader history
      const historyEntry = new UpgraderHistory({
        userId,
        username: (await User.findById(userId).session(session)).username,
        avatar: (await User.findById(userId).session(session)).avatar || '',
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
      await historyEntry.save({ session });

      await session.commitTransaction();

      // Send Discord webhook (outside transaction)
      const user = await User.findById(userId);
      if (user) {
        sendDiscordWebhook(
          user.username,
          true,
          inputValue,
          desiredValue,
          inputItems.map(item => ({
            name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || item.itemId
          })),
          desiredItemDef
        );
      }

      // Emit socket events (outside transaction)
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
      console.log('User lost upgrade. Removing input items from user inventory...');
      console.log('User inventory before:', userInventory.items.length);
      console.log('Input item IDs to remove:', inputItemIds);
      
      // Remove input items from user inventory
      userInventory.items = userInventory.items.filter(
        item => !inputItemIds.includes(item.uniqueId)
      );
      
      console.log('User inventory after:', userInventory.items.length);

      // Add input items to stock inventory
      for (const inputItem of inputItems) {
        const newStockUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        stockInventory.items.push({
          uniqueId: newStockUniqueId,
          itemId: inputItem.itemId,
          acquiredAt: new Date()
        });
      }
      
      console.log('Stock inventory after adding items:', stockInventory.items.length);

      await userInventory.save({ session });
      await stockInventory.save({ session });

      // Save to upgrader history
      const historyEntry = new UpgraderHistory({
        userId,
        username: (await User.findById(userId).session(session)).username,
        avatar: (await User.findById(userId).session(session)).avatar || '',
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
      await historyEntry.save({ session });

      await session.commitTransaction();

      // Send Discord webhook (outside transaction)
      const user = await User.findById(userId);
      if (user) {
        sendDiscordWebhook(
          user.username,
          false,
          inputValue,
          0,
          inputItems.map(item => ({
            name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || item.itemId
          })),
          null
        );
      }

      // Emit socket events (outside transaction)
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
        message: 'Upgrade failed. You lost your items.'
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    session.endSession();
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
