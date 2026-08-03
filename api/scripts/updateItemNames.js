require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI;
const USERNAME = 'Radotron_0';

async function updateItemNames() {
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

    // Find inventory
    const inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      console.log(`No inventory found for ${USERNAME}`);
      return;
    }

    console.log(`Found inventory with ${inventory.items.length} items`);

    // Update item names and images
    const newItems = [
      { name: 'Gingerscope', image: 'https://mm2.rocks/images/mm2-wiki/gingerscope.png' },
      { name: 'Icepiercer', image: 'https://mm2.rocks/images/mm2-wiki/icepiercer.png' },
      { name: 'Harvester', image: 'https://mm2.rocks/images/mm2-wiki/harvester.png' },
      { name: 'Treat', image: 'https://mm2.rocks/images/mm2-wiki/treat.png' },
      { name: 'Candy', image: 'https://mm2.rocks/images/mm2-wiki/candy.png' }
    ];
    
    inventory.items.forEach((item, index) => {
      if (index < newItems.length) {
        console.log(`Updating item ${index + 1}: ${item.name} -> ${newItems[index].name}`);
        item.name = newItems[index].name;
        item.image = newItems[index].image;
      }
    });

    await inventory.save();

    console.log(`✓ Item names updated for ${USERNAME}`);
    console.log(`Updated items:`, inventory.items.map(i => i.name));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateItemNames();
