const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');
const UpgraderHistory = require('../models/UpgraderHistory');

// ==============================
// 1. TOKEN MODEL (persistent)
// ==============================
const TokenSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: String, required: true }
});
const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);

// In-memory cache
let MM2_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4MzZmOWU3ZTc1MTFiOWUzNGZjODYiLCJ0eXBlIjoiYWNjZXNzIiwianRpIjoiTFNZVEFjMDFiajJyMUlobCIsImlhdCI6MTc4NjM2OTQ0OSwiZXhwIjoxNzg2MzcwMzQ5LCJhdXRoX3RpbWUiOjE3ODYzMTI5NDQsImFtciI6WyJyb2Jsb3giLCJlbWFpbCJdLCJtZmFfYXQiOjE3ODYzMTI5NTR9.3QFic6hQy5CtlTCFPLnQKLXbL1GiCNTvpuIqETfCPAM";
let MM2_REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTc4MzZmOWU3ZTc1MTFiOWUzNGZjODYiLCJ0eXBlIjoicmVmcmVzaCIsImp0aSI6InFqWXhkeFh2a2EtakQ3NEtpYmxTUHJhNzFPUHNvQVdQIiwiaWF0IjoxNzg2MzY5NDQ5LCJleHAiOjE3ODg5NjE0NDksImF1dGhfdGltZSI6MTc4NjMxMjk0NCwiYW1yIjpbInJvYmxveCIsImVtYWlsIl0sIm1mYV9hdCI6MTc4NjMxMjk1NH0.jhxVInM_AolbjBVyKG_w7mVr2scFK7tIM9WT0LHpBNc";

// Load tokens from DB or env
const loadTokens = async () => {
  try {
    const accessDoc = await Token.findOne({ key: 'mm2AccessToken' });
    const refreshDoc = await Token.findOne({ key: 'mm2RefreshToken' });
    MM2_ACCESS_TOKEN = accessDoc ? accessDoc.value : process.env.MM2_ACCESS_TOKEN || null;
    MM2_REFRESH_TOKEN = refreshDoc ? refreshDoc.value : process.env.MM2_REFRESH_TOKEN || null;
    console.log('Tokens loaded from DB/env');
  } catch (err) {
    console.error('Failed to load tokens from DB, using env only', err);
    MM2_ACCESS_TOKEN = process.env.MM2_ACCESS_TOKEN || null;
    MM2_REFRESH_TOKEN = process.env.MM2_REFRESH_TOKEN || null;
  }
};
loadTokens();

// Save tokens to DB after refresh
const persistTokens = async (access, refresh) => {
  try {
    await Token.updateOne({ key: 'mm2AccessToken' }, { value: access }, { upsert: true });
    if (refresh) {
      await Token.updateOne({ key: 'mm2RefreshToken' }, { value: refresh }, { upsert: true });
    }
    console.log('Tokens persisted to DB');
  } catch (err) {
    console.error('Failed to persist tokens', err);
  }
};

// ==============================
// 2. TOKEN REFRESH & GETTER
// ==============================
const refreshMM2Token = async () => {
  try {
    console.log('Refreshing MM2 token...');
    if (!MM2_REFRESH_TOKEN) {
      console.error('No refresh token available – cannot refresh');
      return;
    }

    const response = await fetch('https://api.mm2empire.com/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: MM2_REFRESH_TOKEN })
    });

    if (!response.ok) {
      console.error(`Refresh failed: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    if (data.accessToken) {
      MM2_ACCESS_TOKEN = data.accessToken;
      if (data.refreshToken) {
        MM2_REFRESH_TOKEN = data.refreshToken;
      }
      await persistTokens(MM2_ACCESS_TOKEN, MM2_REFRESH_TOKEN);
      console.log('MM2 token refreshed and persisted successfully');
    } else {
      console.error('Refresh response missing accessToken');
    }
  } catch (error) {
    console.error('Error refreshing MM2 token:', error);
  }
};

// Proactive refresh every 10 minutes (token expires in ~15 min)
setInterval(refreshMM2Token, 10 * 60 * 1000);

const getMM2Token = async () => {
  try {
    if (!MM2_ACCESS_TOKEN) {
      console.warn('No access token set, attempting refresh...');
      await refreshMM2Token();
      return MM2_ACCESS_TOKEN;
    }

    const decoded = jwt.decode(MM2_ACCESS_TOKEN);
    const now = Math.floor(Date.now() / 1000);
    if (decoded && decoded.exp && decoded.exp < now + 30) {
      console.log('Access token expiring soon, refreshing...');
      await refreshMM2Token();
    }
    return MM2_ACCESS_TOKEN;
  } catch (error) {
    console.error('Error in getMM2Token:', error);
    await refreshMM2Token();
    return MM2_ACCESS_TOKEN;
  }
};

// ==============================
// 3. DISCORD WEBHOOK
// ==============================
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1536061298742132896/0_yl4FDrojAtnLSIMsXHhdQj4ZkWnkPpdrTk6OER4s2-l09TsqMKvdg31gk2thzOBfiX';

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
      title,
      description,
      color,
      fields: [
        { name: 'Input Items', value: inputItemNames || 'None', inline: false },
        { name: 'Output Item', value: outputItemName, inline: false }
      ],
      timestamp: new Date().toISOString()
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
  }
};

// ==============================
// 4. SOCKET.IO SETUP
// ==============================
let io;
const setIo = (socketIo) => { io = socketIo; };
module.exports = { router, setIo };

// Helper to populate item details (unchanged)
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

// ==============================
// 5. ROUTES
// ==============================

// ---------- GET /third-party-stock ----------
router.get('/third-party-stock', async (req, res) => {
  try {
    const token = await getMM2Token();

    // Fetch wallet balance (in USD cents)
    const walletResponse = await fetch('https://api.mm2empire.com/wallet', {
      headers: {
        'authorization': `Bearer ${token}`,
        'Referer': 'https://mm2empire.com/'
      }
    });
    const walletData = await walletResponse.json();
    const rawWalletCents = walletData?.balances?.usd?.availableUsdCents || 0;
    // Default to $100 (10000 cents) if wallet balance is 0
    const walletBalanceCents = rawWalletCents > 0 ? rawWalletCents : 10000;
    console.log(`Wallet balance: $${(walletBalanceCents / 100).toFixed(2)}${rawWalletCents === 0 ? ' (default)' : ''}`);

    // Fetch marketplace items (paginated)
    let allItems = [];
    let offset = 0;
    const limit = 200;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `https://api.mm2empire.com/marketplace?group_by_item=true&limit=${limit}&offset=${offset}&sort=price_desc&v=204`,
        {
          headers: {
            'authorization': `Bearer ${token}`,
            'Referer': 'https://mm2empire.com/'
          }
        }
      );
      if (!response.ok) break;
      const data = await response.json();
      if (data?.items?.length) {
        allItems = allItems.concat(data.items);
        offset += limit;
        if (data.items.length < limit) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    // Get MongoDB item values (for display)
    const itemNames = allItems.map(item => item.itemDetails?.itemName || item.itemDetails?.name).filter(Boolean);
    const mongoItems = await Item.find({ name: { $in: itemNames } });
    const mongoItemMap = new Map(mongoItems.map(item => [item.name, item.value]));

    // Build response – only include items you can afford
    const items = [];
    for (const item of allItems) {
      const availableCount = item.availableCount || 1;
      const itemId = item.id || item.itemValueId;
      const itemName = item.itemDetails?.itemName || item.itemDetails?.name;

      // USD price in cents
      const priceUsdCents = item.priceUsdCents || 0;
      // Coin price (used for checkout)
      const priceCoins = item.priceCoins || item.itemDetails?.itemValue || 0;

      // Affordability check: USD price <= wallet balance (both in cents)
      const canAfford = priceUsdCents <= walletBalanceCents;

      // Only push if we can afford AND we have a valid itemId
      if (itemId && canAfford) {
        const mm2Value = mongoItemMap.get(itemName) || item.itemDetails?.itemValue || 0;
        const usdPrice = priceUsdCents / 100;

        for (let i = 0; i < availableCount; i++) {
          items.push({
            name: itemName || 'Unknown',
            price: usdPrice,               // USD price in dollars
            mm2Value: mm2Value,            // MM2 value from our DB
            img: item.itemDetails?.itemImage || item.itemDetails?.image || '/assets/wallet/mm2.png',
            uniqueId: `${itemId}_${i}`,
            itemId: itemId,
            itemValueId: item.itemValueId, // needed for checkout
            priceCoins: priceCoins,        // coin price for checkout
            isThirdParty: true
          });
        }
      }
    }

    console.log(`Total affordable items: ${items.length} out of ${allItems.length}`);
    res.json({ items, walletBalance: walletBalanceCents / 100 });
  } catch (error) {
    console.error('Error fetching third party stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- GET /stock/:robloxUserId ----------
router.get('/stock/:robloxUserId', async (req, res) => {
  try {
    const { robloxUserId } = req.params;
    const user = await User.findOne({ robloxUserId });
    if (!user) return res.status(404).json({ error: 'Stock account not found' });

    let inventory = await Inventory.findOne({ userId: user._id }).populate('userId', 'username');
    if (!inventory) {
      inventory = new Inventory({ userId: user._id, items: [] });
      await inventory.save();
    }

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
            mm2Value: itemDef.value,
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

// ---------- POST /upgrade ----------
router.post('/upgrade', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, stockRobloxUserId, inputItemIds, desiredItemIds, useBalance, balanceAmount } = req.body;

    if (!userId || !stockRobloxUserId || !desiredItemIds || desiredItemIds.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (useBalance && (!balanceAmount || balanceAmount <= 0)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid balance amount' });
    }
    if (!useBalance && (!inputItemIds || inputItemIds.length === 0)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'No input items provided' });
    }

    const stockUser = await User.findOne({ robloxUserId: stockRobloxUserId }).session(session);
    if (!stockUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Stock account user not found' });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User not found' });
    }

    let userInventory;
    if (!useBalance) {
      userInventory = await Inventory.findOne({ userId }).session(session);
      if (!userInventory) {
        await session.abortTransaction();
        return res.status(404).json({ error: 'User inventory not found' });
      }
    } else {
      userInventory = await Inventory.findOne({ userId }).session(session);
      if (!userInventory) {
        userInventory = new Inventory({ userId, items: [] });
      }
    }

    const stockInventory = await Inventory.findOne({ userId: stockUser._id }).session(session);
    if (!stockInventory) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Stock inventory not found' });
    }

    let inputItems = [];
    let inputItemDefs = [];
    let inputValue = 0;

    if (useBalance) {
      if (user.balance < balanceAmount) {
        await session.abortTransaction();
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      inputValue = balanceAmount;
    } else {
      for (const uniqueId of inputItemIds) {
        const itemIndex = userInventory.items.findIndex(item => item.uniqueId === uniqueId);
        if (itemIndex === -1) {
          await session.abortTransaction();
          return res.status(400).json({ error: 'Input item not found in user inventory' });
        }
        inputItems.push(userInventory.items[itemIndex]);
      }
      inputItemDefs = await Promise.all(
        inputItems.map(async (invItem) => {
          const itemDef = await Item.findOne({ itemId: invItem.itemId }).session(session);
          return itemDef;
        })
      );
      inputValue = inputItemDefs.reduce((sum, item) => sum + (item?.value || 0), 0);
    }

    let desiredItems = [];
    let desiredValue = 0;
    let isThirdParty = false;

    // Process each desired item
    for (const desiredItemId of desiredItemIds) {
      const desiredItemIndex = stockInventory.items.findIndex(item => item.uniqueId === desiredItemId);
      if (desiredItemIndex !== -1) {
        // Site stock item
        const stockItem = stockInventory.items[desiredItemIndex];
        const itemDef = await Item.findOne({ itemId: stockItem.itemId }).session(session);
        const itemValue = itemDef?.value || 0;
        desiredItems.push({
          uniqueId: desiredItemId,
          itemId: stockItem.itemId,
          name: itemDef?.name || stockItem.itemId,
          image: itemDef?.image || '',
          value: itemValue,
          isThirdParty: false
        });
        desiredValue += itemValue;
      } else {
        // Third party item – fetch from MM2 Empire
        isThirdParty = true;
        const actualItemId = desiredItemId.split('_')[0];
        console.log('Looking for third-party item with ID:', actualItemId);

        let allItems = [];
        let offset = 0;
        const limit = 200;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `https://api.mm2empire.com/marketplace?group_by_item=true&limit=${limit}&offset=${offset}&sort=price_desc&v=204`
          );
          const data = await response.json();
          if (data?.items?.length) {
            allItems = allItems.concat(data.items);
            offset += limit;
            if (data.items.length < limit) hasMore = false;
          } else {
            hasMore = false;
          }
        }

        if (allItems.length) {
          const thirdPartyItem = allItems.find(item => (item.id === actualItemId || item.itemValueId === actualItemId));
          if (thirdPartyItem) {
            const itemName = thirdPartyItem.itemDetails?.itemName || thirdPartyItem.itemDetails?.name;
            const mongoItem = await Item.findOne({ name: itemName }).session(session);
            const mm2Price = thirdPartyItem.priceCoins || thirdPartyItem.itemDetails?.itemValue || 0;
            const usdPrice = (thirdPartyItem.priceUsdCents || 0) / 100;
            const itemValue = useBalance ? usdPrice : (mongoItem?.value || mm2Price);

            desiredItems.push({
              uniqueId: desiredItemId,
              itemId: thirdPartyItem.id || thirdPartyItem.itemValueId,
              itemValueId: thirdPartyItem.itemValueId,
              name: itemName || 'Unknown',
              image: thirdPartyItem.itemDetails?.itemImage || thirdPartyItem.itemDetails?.image || '/assets/wallet/mm2.png',
              value: itemValue,
              mm2Value: mongoItem?.value || mm2Price,
              usdPrice,
              priceCoins: mm2Price,
              isThirdParty: true
            });
            desiredValue += itemValue;
          } else {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Third party item not found' });
          }
        } else {
          await session.abortTransaction();
          return res.status(500).json({ error: 'Failed to fetch third party stock' });
        }
      }
    }

    let winChance = (inputValue / desiredValue) * 100;
    if (inputValue > desiredValue) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Input value cannot exceed desired value' });
    }
    if (winChance > 80) winChance = 80;

    const randomRoll = Math.random() * 100;
    const won = randomRoll < winChance;

    if (won) {
      // ---- WIN ----
      if (useBalance) {
        user.balance -= balanceAmount;
        await user.save({ session });
      } else {
        userInventory.items = userInventory.items.filter(item => !inputItemIds.includes(item.uniqueId));
      }

      for (const desiredItem of desiredItems) {
        const itemUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        if (desiredItem.isThirdParty) {
          // Ensure item exists in our DB
          let itemDef = await Item.findOne({ name: desiredItem.name }).session(session);
          if (!itemDef) {
            itemDef = new Item({
              itemId: desiredItem.itemId,
              name: desiredItem.name,
              image: desiredItem.image,
              value: desiredItem.value,
              rarity: 'godly',
              category: 'gun'
            });
            await itemDef.save({ session });
          }

          userInventory.items.push({
            uniqueId: itemUniqueId,
            itemId: itemDef.itemId,
            acquiredAt: new Date()
          });

          // Purchase from MM2 Empire using fresh token
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
                  priceCoins: desiredItem.priceCoins,
                  quantity: 1
                }]
              })
            });
            if (!checkoutResponse.ok) {
              console.error('MM2 Empire checkout failed:', checkoutResponse.status, await checkoutResponse.text());
            } else {
              console.log('MM2 Empire checkout successful for item:', desiredItem.name);
            }
          } catch (purchaseError) {
            console.error('Error purchasing from MM2 Empire:', purchaseError);
          }
        } else {
          // Site stock item
          if (!useBalance) {
            userInventory.items.push({
              uniqueId: itemUniqueId,
              itemId: desiredItem.itemId,
              acquiredAt: new Date()
            });
          }
          // Remove from stock inventory
          const idx = stockInventory.items.findIndex(item => item.uniqueId === desiredItem.uniqueId);
          if (idx !== -1) stockInventory.items.splice(idx, 1);
        }
      }

      // Save changes
      await userInventory.save({ session });
      if (!isThirdParty || useBalance) {
        await stockInventory.save({ session });
      }

      // History entry
      const historyEntry = new UpgraderHistory({
        userId,
        username: user.username,
        avatar: user.avatar || '',
        inputItems: useBalance ? [] : inputItems.map(item => ({
          uniqueId: item.uniqueId,
          itemId: item.itemId,
          name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || '',
          image: inputItemDefs.find(def => def?.itemId === item.itemId)?.image || '',
          value: inputItemDefs.find(def => def?.itemId === item.itemId)?.value || 0
        })),
        outputItem: desiredItems.length > 0 ? {
          uniqueId: desiredItems[0].uniqueId,
          itemId: desiredItems[0].itemId,
          name: desiredItems[0].name,
          image: desiredItems[0].image,
          value: desiredValue
        } : null,
        inputValue,
        outputValue: desiredValue,
        winChance,
        won: true,
        multiplier: desiredValue / inputValue,
        isThirdParty,
        useBalance,
        balanceAmount: useBalance ? balanceAmount : undefined
      });
      await historyEntry.save({ session });

      await session.commitTransaction();

      // Webhook & Socket (outside transaction)
      if (user) {
        const inputItemsForWebhook = useBalance ? [] : inputItems.map(item => ({
          name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || item.itemId
        }));
        sendDiscordWebhook(
          user.username,
          true,
          inputValue,
          desiredValue,
          inputItemsForWebhook,
          desiredItems.length > 0 ? {
            name: desiredItems[0].name,
            image: desiredItems[0].image,
            value: desiredValue
          } : null
        );
      }
      if (io) {
        if (useBalance) {
          io.emit('balance-updated', { userId, balance: user.balance });
        } else {
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
        }
        io.emit('third-party-stock-updated');
      }

      res.json({
        success: true,
        won: true,
        winChance: winChance.toFixed(2),
        inputValue,
        desiredValue,
        newBalance: useBalance ? user.balance : undefined,
        itemsWon: desiredItems.length,
        message: useBalance
          ? `Upgrade successful! You won R${desiredValue.toFixed(2)} (MM2 value)`
          : `Upgrade successful! You won ${desiredItems.length} item(s).`
      });
    } else {
      // ---- LOSE ----
      if (useBalance) {
        user.balance -= balanceAmount;
        await user.save({ session });
      } else {
        // Remove input items from user
        userInventory.items = userInventory.items.filter(item => !inputItemIds.includes(item.uniqueId));
        // Add them to stock inventory
        for (const inputItem of inputItems) {
          const newStockUniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          stockInventory.items.push({
            uniqueId: newStockUniqueId,
            itemId: inputItem.itemId,
            acquiredAt: new Date()
          });
        }
        await userInventory.save({ session });
        await stockInventory.save({ session });
      }

      const historyEntry = new UpgraderHistory({
        userId,
        username: user.username,
        avatar: user.avatar || '',
        inputItems: useBalance ? [] : inputItems.map(item => ({
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
        isThirdParty,
        useBalance,
        balanceAmount: useBalance ? balanceAmount : undefined
      });
      await historyEntry.save({ session });

      await session.commitTransaction();

      if (user) {
        const inputItemsForWebhook = useBalance ? [] : inputItems.map(item => ({
          name: inputItemDefs.find(def => def?.itemId === item.itemId)?.name || item.itemId
        }));
        sendDiscordWebhook(
          user.username,
          false,
          inputValue,
          0,
          inputItemsForWebhook,
          null
        );
      }
      if (io) {
        if (useBalance) {
          io.emit('balance-updated', { userId, balance: user.balance });
        } else {
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
        io.emit('third-party-stock-updated');
      }

      res.json({
        success: true,
        won: false,
        winChance: winChance.toFixed(2),
        inputValue,
        desiredValue,
        newBalance: useBalance ? user.balance : undefined,
        message: useBalance
          ? `Upgrade failed. You lost R${balanceAmount.toFixed(2)}`
          : 'Upgrade failed. You lost your items.'
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

// ---------- GET /history ----------
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

module.exports = { router, setIo };