const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Item = require('../models/Item');
require('dotenv').config();

const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

async function giveRandomItems() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'JakobeHenry3900' });
    if (!user) {
      console.log('User JakobeHenry3900 not found');
      const allUsers = await User.find({}, { username: 1 });
      allUsers.forEach(u => console.log('-', u.username));
      process.exit(1);
    }
    console.log('Found user:', user.username);

    // Get all items from database with value > 100
    const allItems = await Item.find({ value: { $gt: 100 } });
    console.log(`Found ${allItems.length} items in database with value > 100`);

    if (allItems.length === 0) {
      console.log('No items found with value > 100');
      process.exit(1);
    }

    // Get or create inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      inventory = new Inventory({ userId: user._id, items: [] });
    }

    // Clear existing items
    inventory.items = [];

    // Give 20 random items
    const itemCount = 20;
    for (let i = 0; i < itemCount; i++) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      inventory.items.push({
        uniqueId: generateUniqueId(),
        itemId: randomItem.itemId,
        acquiredAt: new Date()
      });
    }

    await inventory.save();
    console.log(`Added ${itemCount} random items to ${user.username}'s inventory`);
    console.log(`Total items in inventory: ${inventory.items.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

giveRandomItems();
