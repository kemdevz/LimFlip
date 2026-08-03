const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
require('dotenv').config();

// Sample items to add to inventories (completely different from before)
const sampleItems = [
  {
    itemId: 'sword_1',
    name: 'Dragon Sword',
    image: '/assets/images/items/sword.png',
    rarity: 'legendary',
    value: 60000,
    category: 'weapon'
  },
  {
    itemId: 'shield_1',
    name: 'Iron Shield',
    image: '/assets/images/items/shield.png',
    rarity: 'rare',
    value: 45000,
    category: 'weapon'
  },
  {
    itemId: 'potion_1',
    name: 'Health Potion',
    image: '/assets/images/items/potion.png',
    rarity: 'common',
    value: 25000,
    category: 'consumable'
  }
];

async function fullReset() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear all coinflip games
    const coinflipResult = await Coinflip.deleteMany({});
    console.log(`Deleted ${coinflipResult.deletedCount} coinflip games`);

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

    // Clear and reset Radotron's inventory
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

    // Clear and reset Redbet's inventory
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

    console.log('Full reset completed successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during full reset:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fullReset();
