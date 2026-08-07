const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function clearDave4WildInventory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Dave4Wild user
    const user = await User.findOne({ username: 'Dave4Wild' });
    
    if (!user) {
      console.log('❌ User Dave4Wild not found');
      return;
    }

    console.log(`✅ Found user: ${user.username} (ID: ${user._id})`);

    // Find inventory for user
    let inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      console.log('❌ No inventory found for Dave4Wild');
      return;
    }

    console.log(`📊 Current inventory has ${inventory.items.length} items`);

    // Clear all items from inventory
    inventory.items = [];
    await inventory.save();
    
    console.log('✅ All items removed from Dave4Wild inventory');
    console.log(`📊 New inventory count: ${inventory.items.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearDave4WildInventory();
