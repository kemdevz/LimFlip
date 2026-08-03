const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');
require('dotenv').config();

async function testInventoryAPI() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get a user
    const user = await User.findOne({ username: 'Radotron_0' });
    console.log(`Testing inventory for user: ${user.username} (${user._id})`);

    // Get inventory
    let inventory = await Inventory.findOne({ userId: user._id }).populate('userId', 'username');
    
    if (!inventory) {
      inventory = new Inventory({ userId: user._id, items: [] });
      await inventory.save();
    }

    console.log(`\nRaw inventory items: ${inventory.items.length}`);
    console.log('First raw item:', JSON.stringify(inventory.items[0], null, 2));

    // Populate item details (same logic as API)
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
            category: itemDef.category
          };
        }
        return invItem;
      })
    );

    console.log(`\nPopulated items: ${populatedItems.length}`);
    console.log('First populated item:', JSON.stringify(populatedItems[0], null, 2));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error testing inventory API:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

testInventoryAPI();
