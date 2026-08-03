const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
require('dotenv').config();

async function checkInventories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find the two users
    const radotron = await User.findOne({ username: 'Radotron_0' });
    const redbet = await User.findOne({ username: 'Redbet_holder' });

    if (!radotron || !redbet) {
      console.log('Users not found');
      process.exit(1);
    }

    console.log('Found users:');
    console.log('Radotron_0 ID:', radotron._id);
    console.log('Redbet_holder ID:', redbet._id);

    // Check all inventories
    const allInventories = await Inventory.find({});
    console.log(`\nTotal inventories in database: ${allInventories.length}`);

    allInventories.forEach(inv => {
      console.log(`\nInventory for user: ${inv.userId}`);
      console.log(`  Total items: ${inv.items.length}`);
      console.log(`  Total value: ${inv.totalValue}`);
      if (inv.items.length > 0) {
        console.log('  Sample items:');
        inv.items.slice(0, 5).forEach(item => {
          console.log(`    - ${item.name} (${item.itemId}): ${item.value}`);
        });
      }
    });

    // Check specific user inventories
    console.log('\n--- Radotron_0 Inventory ---');
    const radotronInv = await Inventory.findOne({ userId: radotron._id });
    if (radotronInv) {
      console.log(`Items count: ${radotronInv.items.length}`);
      radotronInv.items.forEach(item => {
        console.log(`- ${item.name} (${item.itemId}): ${item.value}`);
      });
    } else {
      console.log('No inventory found');
    }

    console.log('\n--- Redbet_holder Inventory ---');
    const redbetInv = await Inventory.findOne({ userId: redbet._id });
    if (redbetInv) {
      console.log(`Items count: ${redbetInv.items.length}`);
      redbetInv.items.forEach(item => {
        console.log(`- ${item.name} (${item.itemId}): ${item.value}`);
      });
    } else {
      console.log('No inventory found');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking inventories:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

checkInventories();
