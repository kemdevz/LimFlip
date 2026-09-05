require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

const wrongItemNames = [
  'Jester\'s Cap',
  'JJ5x5\'s White Top Hat',
  'Blue Snipers Visor',
  'Vegetable Hat',
  'Geography Textbook'
];

async function removeWrongItemsAndReplace(username) {
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User ${username} not found`);
      return { success: false, message: 'User not found' };
    }

    console.log(`Found user: ${username} (ID: ${user._id})`);

    const inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      console.log(`No inventory found for ${username}`);
      return { success: false, message: 'No inventory found' };
    }

    // Find item IDs for the wrong items
    const wrongItems = await Item.find({ name: { $in: wrongItemNames } });
    const wrongItemIds = wrongItems.map(item => item.itemId);
    
    console.log(`Wrong item IDs to remove:`, wrongItemIds);

    // Remove wrong items from inventory
    const initialCount = inventory.items.length;
    inventory.items = inventory.items.filter(invItem => !wrongItemIds.includes(invItem.itemId));
    const removedCount = initialCount - inventory.items.length;
    
    console.log(`Removed ${removedCount} wrong items from ${username}`);

    // Find replacement items with valid images (excluding the wrong ones)
    const replacementItems = await Item.find({
      category: 'limited',
      image: { $regex: 'tr.rbxcdn.com' },
      value: { $gte: 20000, $lte: 1000000 },
      name: { $nin: wrongItemNames }
    }).limit(removedCount || 5);

    console.log(`Found ${replacementItems.length} replacement items for ${username}:`);
    replacementItems.forEach(item => {
      console.log(`- ${item.name} (RAP: ${item.value}, Rarity: ${item.rarity})`);
      console.log(`  Image: ${item.image}`);
    });

    // Add replacement items
    let addedCount = 0;
    for (const item of replacementItems) {
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
    console.log(`Successfully updated inventory for ${username}: removed ${removedCount}, added ${addedCount}`);
    
    return { success: true, removed: removedCount, added: addedCount };
  } catch (error) {
    console.error(`Error for ${username}:`, error);
    return { success: false, error: error.message };
  }
}

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove wrong items from callz2smart
    const result1 = await removeWrongItemsAndReplace('callz2smart');
    console.log(`\ncallz2smart result:`, result1);

    // Remove wrong items from JakobeHenry3900
    const result2 = await removeWrongItemsAndReplace('JakobeHenry3900');
    console.log(`\nJakobeHenry3900 result:`, result2);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
