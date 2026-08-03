require('dotenv').config({ path: './api/.env' });
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';

async function copyItemsFromRado() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find rado user (using Radotron_0 since rado doesn't exist)
    const radoUser = await User.findOne({ username: 'Radotron_0' });
    if (!radoUser) {
      console.log('User Radotron_0 not found');
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`Found Radotron_0 with ID: ${radoUser._id}`);

    // Find Redbet_holder user
    const redbetUser = await User.findOne({ username: 'Redbet_holder' });
    if (!redbetUser) {
      console.log('User Redbet_holder not found');
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`Found Redbet_holder with ID: ${redbetUser._id}`);

    // Get rado's inventory
    const radoInventory = await Inventory.findOne({ userId: radoUser._id });
    if (!radoInventory || radoInventory.items.length === 0) {
      console.log('Rado has no items in inventory');
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`Rado has ${radoInventory.items.length} items`);

    // Get Redbet_holder's inventory
    let redbetInventory = await Inventory.findOne({ userId: redbetUser._id });
    
    if (!redbetInventory) {
      redbetInventory = new Inventory({
        userId: redbetUser._id,
        items: []
      });
    }

    // Clear Redbet_holder's existing items
    redbetInventory.items = [];

    // Copy rado's items to Redbet_holder
    radoInventory.items.forEach(item => {
      redbetInventory.items.push({
        itemId: item.itemId,
        name: item.name,
        image: item.image,
        value: item.value
      });
    });

    await redbetInventory.save();
    console.log(`Successfully copied ${radoInventory.items.length} items from rado to Redbet_holder`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

copyItemsFromRado();
