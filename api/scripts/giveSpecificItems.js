const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Item = require('../models/Item');
require('dotenv').config();

// Specific item definitions to populate Items collection
const itemDefinitions = [
  {
    itemId: 'harvester',
    name: 'Harvester',
    rarity: 'mythic',
    value: 49382,
    category: 'weapon'
  },
  {
    itemId: 'icepiercer',
    name: 'Icepiercer',
    rarity: 'mythic',
    value: 39282,
    category: 'weapon'
  },
  {
    itemId: 'alienbeam',
    name: 'Alienbeam',
    rarity: 'legendary',
    value: 42000,
    category: 'weapon'
  },
  {
    itemId: 'heartblade',
    name: 'Heartblade',
    rarity: 'legendary',
    value: 59028,
    category: 'weapon'
  }
];

// Function to map custom rarities to valid enum values
const mapRarity = (rarity) => {
  const rarityMap = {
    'Godly': 'legendary',
    'Halloween': 'mythic',
    'Ancient': 'mythic',
    'common': 'common',
    'uncommon': 'uncommon',
    'rare': 'rare',
    'legendary': 'legendary',
    'mythic': 'mythic'
  };
  return rarityMap[rarity] || 'common';
};

// Function to get item image using mm2.rocks API format
const getItemImage = (itemId) => {
  return `https://mm2.rocks/images/mm2-wiki/${itemId}.png`;
};

// Generate unique ID for inventory items
const generateUniqueId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

async function giveSpecificItems() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Populate Items collection with item definitions
    console.log('Populating Items collection...');
    for (const itemDef of itemDefinitions) {
      const existingItem = await Item.findOne({ itemId: itemDef.itemId });
      if (!existingItem) {
        const newItem = new Item({
          ...itemDef,
          image: getItemImage(itemDef.itemId)
        });
        await newItem.save();
        console.log(`Added item: ${itemDef.name}`);
      } else {
        console.log(`Item already exists: ${itemDef.name}`);
      }
    }

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

    // Add specific items to Radotron (30 items total) with unique IDs
    let itemCounter = 0;
    for (let i = 0; i < 8; i++) {
      itemDefinitions.forEach(itemDef => {
        if (itemCounter < 30) {
          radotronInventory.items.push({
            uniqueId: generateUniqueId(),
            itemId: itemDef.itemId,
            acquiredAt: new Date()
          });
          itemCounter++;
        }
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

    // Add specific items to Redbet (30 items total) with unique IDs
    itemCounter = 0;
    for (let i = 0; i < 8; i++) {
      itemDefinitions.forEach(itemDef => {
        if (itemCounter < 30) {
          redbetInventory.items.push({
            uniqueId: generateUniqueId(),
            itemId: itemDef.itemId,
            acquiredAt: new Date()
          });
          itemCounter++;
        }
      });
    }
    await redbetInventory.save();
    console.log(`Reset inventory for ${redbet.username}: ${redbetInventory.items.length} items`);

    console.log('Specific items added successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error giving specific items:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

giveSpecificItems();
