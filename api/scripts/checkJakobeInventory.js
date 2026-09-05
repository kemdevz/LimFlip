require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function checkInventory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'JakobeHenry3900' });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log(`User: ${user.username} (ID: ${user._id})`);

    const inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      console.log('No inventory found for user');
      process.exit(1);
    }

    console.log(`\nInventory has ${inventory.items.length} items:`);
    
    for (const invItem of inventory.items) {
      const itemDef = await Item.findOne({ itemId: invItem.itemId });
      if (itemDef) {
        console.log(`- ${itemDef.name} (itemId: ${invItem.itemId}, value: ${itemDef.value})`);
      } else {
        console.log(`- UNKNOWN ITEM (itemId: ${invItem.itemId})`);
      }
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkInventory();
