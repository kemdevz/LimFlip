require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function clearAndGiveItems(username, count) {
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User ${username} not found`);
      return { success: false, message: 'User not found' };
    }

    console.log(`Found user: ${username} (ID: ${user._id})`);

    // Clear inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    
    if (inventory) {
      inventory.items = [];
      await inventory.save();
      console.log(`Cleared inventory for ${username}`);
    } else {
      inventory = new Inventory({
        userId: user._id,
        items: []
      });
    }

    // Find items with valid CDN images (tr.rbxcdn.com)
    const items = await Item.find({
      category: 'limited',
      image: { $regex: 'tr.rbxcdn.com' },
      value: { $gte: 20000, $lte: 1000000 }
    }).limit(count);

    if (items.length === 0) {
      console.log(`No items with valid images found for ${username}`);
      return { success: false, message: 'No items found' };
    }

    console.log(`Found ${items.length} items to add to ${username}:`);
    items.forEach(item => {
      console.log(`- ${item.name} (RAP: ${item.value}, Rarity: ${item.rarity})`);
      console.log(`  Image: ${item.image}`);
    });

    // Add items to inventory
    let addedCount = 0;
    for (const item of items) {
      const uniqueId = `${item.itemId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      inventory.items.push({
        uniqueId,
        itemId: item.itemId,
        acquiredAt: new Date(),
        source: 'other',
        wagered: false,
        listedInMarketplace: false
      });
      
      addedCount++;
      console.log(`Added: ${item.name}`);
    }

    await inventory.save();
    console.log(`Successfully added ${addedCount} items to user ${username}`);
    
    return { success: true, count: addedCount };
  } catch (error) {
    console.error(`Error for ${username}:`, error);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear and give items to bloxfruit_ihack
    const result = await clearAndGiveItems('bloxfruit_ihack', 10);
    console.log(`\nbloxfruit_ihack result:`, result);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
