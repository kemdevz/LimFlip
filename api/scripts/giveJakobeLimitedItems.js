require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function giveItemsToJakobe() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by username
    const user = await User.findOne({ username: 'JakobeHenry3900' });
    
    if (!user) {
      console.log('User JakobeHenry3900 not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.username} with ID: ${user._id}`);

    // Find 10 items with RAP between 20,000 and 1,000,000
    const items = await Item.find({
      value: { $gte: 20000, $lte: 1000000 }
    }).limit(10);

    if (items.length === 0) {
      console.log('No items found in the specified RAP range');
      process.exit(1);
    }

    console.log(`Found ${items.length} items to add:`);
    items.forEach(item => {
      console.log(`- ${item.name} (RAP: ${item.value}, Rarity: ${item.rarity})`);
    });

    // Find or create inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      inventory = new Inventory({
        userId: user._id,
        items: []
      });
    }

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
    console.log(`\nSuccessfully added ${addedCount} items to user ${user.username}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

giveItemsToJakobe();
