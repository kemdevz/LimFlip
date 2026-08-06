const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function addItemsToDave4Wild() {
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

    // Find or create Chroma Cookiecane item
    let chromaCookiecane = await Item.findOne({ name: 'Chroma Cookiecane' });
    if (!chromaCookiecane) {
      chromaCookiecane = new Item({
        itemId: 'chroma_cookiecane',
        name: 'Chroma Cookiecane',
        image: '/assets/images/mm2/chroma_cookiecane.png',
        rarity: 'mythic',
        value: 50000,
        category: 'weapon'
      });
      await chromaCookiecane.save();
      console.log('✅ Created Chroma Cookiecane item');
    } else {
      console.log('✅ Found Chroma Cookiecane item');
    }

    // Find or create Icebreaker item
    let icebreaker = await Item.findOne({ name: 'Icebreaker' });
    if (!icebreaker) {
      icebreaker = new Item({
        itemId: 'icebreaker',
        name: 'Icebreaker',
        image: '/assets/images/mm2/icebreaker.png',
        rarity: 'legendary',
        value: 25000,
        category: 'weapon'
      });
      await icebreaker.save();
      console.log('✅ Created Icebreaker item');
    } else {
      console.log('✅ Found Icebreaker item');
    }

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

    // Add 6x Chroma Cookiecane
    for (let i = 0; i < 6; i++) {
      inventory.items.push({
        uniqueId: generateUniqueId(),
        itemId: chromaCookiecane.itemId,
        acquiredAt: new Date()
      });
    }
    console.log('✅ Added 6x Chroma Cookiecane to inventory');

    // Add 1x Icebreaker
    inventory.items.push({
      uniqueId: generateUniqueId(),
      itemId: icebreaker.itemId,
      acquiredAt: new Date()
    });
    console.log('✅ Added 1x Icebreaker to inventory');

    // Save inventory
    await inventory.save();
    console.log('✅ Inventory saved successfully');

    // Display final inventory count
    const updatedInventory = await Inventory.findOne({ userId: user._id });
    console.log(`📊 Total items in inventory: ${updatedInventory.items.length}`);
    console.log(`💰 Total value: ${updatedInventory.totalValue}`);

    console.log('✅ Items added to Dave4Wild successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addItemsToDave4Wild();
