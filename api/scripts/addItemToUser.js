require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI;
const USERNAME = 'Radotron_0';

async function addItemsToUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user
    const user = await User.findOne({ username: USERNAME });
    
    if (!user) {
      console.log(`User ${USERNAME} not found`);
      return;
    }

    console.log(`Found user: ${user.username} (ID: ${user._id})`);

    // Find or create inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      inventory = new Inventory({ userId: user._id, items: [] });
      console.log('Created new inventory for user');
    }

    // Create multiple items
    const itemTypes = [
      { name: 'Gingerscope', image: 'https://mm2.rocks/images/mm2-wiki/gingerscope.png', rarity: 'legendary', value: 100000, category: 'weapon' },
      { name: 'Icepiercer', image: 'https://mm2.rocks/images/mm2-wiki/icepiercer.png', rarity: 'rare', value: 50000, category: 'knife' },
      { name: 'Harvester', image: 'https://mm2.rocks/images/mm2-wiki/harvester.png', rarity: 'legendary', value: 75000, category: 'weapon' },
      { name: 'Treat', image: 'https://mm2.rocks/images/mm2-wiki/treat.png', rarity: 'common', value: 25000, category: 'misc' },
      { name: 'Candy', image: 'https://mm2.rocks/images/mm2-wiki/candy.png', rarity: 'uncommon', value: 35000, category: 'weapon' }
    ];

    const items = [];
    for (let i = 0; i < 100; i++) {
      const itemType = itemTypes[i % itemTypes.length];
      items.push({
        itemId: Date.now().toString() + i,
        name: itemType.name,
        image: itemType.image,
        rarity: itemType.rarity,
        value: itemType.value,
        category: itemType.category
      });
    }

    console.log(`Adding ${items.length} items to ${USERNAME}'s inventory`);

    inventory.items.push(...items);
    await inventory.save();

    console.log(`✓ Items added to ${USERNAME}'s inventory`);
    console.log(`Inventory total value: ${inventory.totalValue}`);
    console.log(`Total items: ${inventory.items.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addItemsToUser();
