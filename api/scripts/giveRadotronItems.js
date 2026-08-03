require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function giveRadotronItems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Find Radotron_0 user
    const user = await User.findOne({ username: 'Radotron_0' });
    if (!user) {
      console.log('❌ User Radotron_0 not found');
      process.exit(1);
    }
    console.log(`✅ Found user: ${user.username} (ID: ${user._id})`);

    // Get some random MM2 items
    const items = await Item.find({}).limit(20);
    console.log(`✅ Found ${items.length} items to add`);

    // Get or create inventory
    let inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      inventory = new Inventory({
        userId: user._id,
        items: [],
        totalValue: 0
      });
      console.log('✅ Created new inventory');
    }

    // Add items to inventory
    let addedCount = 0;
    for (const item of items) {
      const uniqueId = `${item.itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      inventory.items.push({
        uniqueId,
        itemId: item.itemId,
        acquiredAt: new Date()
      });
      addedCount++;
    }

    // Calculate total value
    inventory.totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);

    await inventory.save();
    console.log(`✅ Added ${addedCount} items to Radotron_0's inventory`);
    console.log(`📊 Total inventory value: ${inventory.totalValue}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

giveRadotronItems();
