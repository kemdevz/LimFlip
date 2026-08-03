const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
require('dotenv').config();

// Sample items to add to inventories
const sampleItems = [
  {
    itemId: 'icepiercer_1',
    name: 'Icepiercer',
    image: '/assets/images/items/icepiercer.png',
    rarity: 'rare',
    value: 50000,
    category: 'weapon'
  },
  {
    itemId: 'harvester_1',
    name: 'Harvester',
    image: '/assets/images/items/harvester.png',
    rarity: 'legendary',
    value: 75000,
    category: 'weapon'
  },
  {
    itemId: 'candy_1',
    name: 'Candy',
    image: '/assets/images/items/candy.png',
    rarity: 'common',
    value: 35000,
    category: 'weapon'
  }
];

async function resetInventories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the two users
    const radotron = await User.findOne({ username: 'Radotron_0' });
    const redbet = await User.findOne({ username: 'Redbet_holder' });

    if (!radotron || !redbet) {
      console.log('Users not found');
      console.log('Available users:');
      const allUsers = await User.find({}, { username: 1 });
      allUsers.forEach(u => console.log('-', u.username));
      process.exit(1);
    }

    console.log('Found users:', radotron.username, redbet.username);

    // Reset Radotron's inventory
    let radotronInventory = await Inventory.findOne({ userId: radotron._id });
    if (radotronInventory) {
      radotronInventory.items = [];
    } else {
      radotronInventory = new Inventory({ userId: radotron._id, items: [] });
    }

    // Add multiple copies of each item with unique IDs
    let itemCounter = 0;
    for (let i = 0; i < 5; i++) {
      sampleItems.forEach(item => {
        radotronInventory.items.push({
          ...item,
          itemId: `${item.itemId}_${Date.now()}_${itemCounter++}`
        });
      });
    }
    await radotronInventory.save();
    console.log(`Reset inventory for ${radotron.username}: ${radotronInventory.items.length} items`);

    // Reset Redbet's inventory
    let redbetInventory = await Inventory.findOne({ userId: redbet._id });
    if (redbetInventory) {
      redbetInventory.items = [];
    } else {
      redbetInventory = new Inventory({ userId: redbet._id, items: [] });
    }

    // Add multiple copies of each item with unique IDs
    for (let i = 0; i < 5; i++) {
      sampleItems.forEach(item => {
        redbetInventory.items.push({
          ...item,
          itemId: `${item.itemId}_${Date.now()}_${itemCounter++}`
        });
      });
    }
    await redbetInventory.save();
    console.log(`Reset inventory for ${redbet.username}: ${redbetInventory.items.length} items`);

    console.log('Inventories reset successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting inventories:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

resetInventories();
