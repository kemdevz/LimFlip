const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function addChromaItemsToDave4Wild() {
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

    // Find chroma items
    const chromaItemIds = [
      'ChromaDarkbringer',
      'LaserChroma', 
      'WatergunChroma',
      'GingerbladeChroma',
      'CatChroma',
      'BatChroma'
    ];

    const chromaItems = await Item.find({ itemId: { $in: chromaItemIds } });
    console.log(`✅ Found ${chromaItems.length} chroma items`);

    // Find or create inventory for user
    let inventory = await Inventory.findOne({ userId: user._id });
    if (!inventory) {
      inventory = new Inventory({
        userId: user._id,
        items: []
      });
      await inventory.save();
      console.log('✅ Created inventory for user');
    } else {
      console.log('✅ Found existing inventory');
    }

    // Add each chroma item
    chromaItems.forEach(item => {
      inventory.items.push({
        uniqueId: generateUniqueId(),
        itemId: item.itemId,
        acquiredAt: new Date()
      });
      console.log(`✅ Added ${item.name} to inventory`);
    });

    // Save inventory
    await inventory.save();
    console.log('✅ Inventory saved successfully');

    // Display final inventory count
    const updatedInventory = await Inventory.findOne({ userId: user._id });
    console.log(`📊 Total items in inventory: ${updatedInventory.items.length}`);
    console.log(`💰 Total value: ${updatedInventory.totalValue}`);

    console.log('✅ Chroma items added to Dave4Wild successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addChromaItemsToDave4Wild();
