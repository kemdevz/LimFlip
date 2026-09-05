require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function debugUserId() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'JakobeHenry3900' });
    
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log(`User ID (ObjectId): ${user._id}`);
    console.log(`User ID (string): ${user._id.toString()}`);
    console.log(`User ID (hex): ${user._id.toHexString()}`);

    const inventory = await Inventory.findOne({ userId: user._id });
    console.log(`\nInventory found with ObjectId: ${inventory ? 'YES' : 'NO'}`);
    console.log(`Inventory items count: ${inventory ? inventory.items.length : 0}`);

    const inventoryWithString = await Inventory.findOne({ userId: user._id.toString() });
    console.log(`\nInventory found with string ID: ${inventoryWithString ? 'YES' : 'NO'}`);

    const allInventories = await Inventory.find({});
    console.log(`\nTotal inventories in DB: ${allInventories.length}`);
    allInventories.forEach(inv => {
      console.log(`- userId: ${inv.userId} (type: ${typeof inv.userId})`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

debugUserId();
