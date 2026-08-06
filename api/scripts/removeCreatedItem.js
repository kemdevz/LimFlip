const mongoose = require('mongoose');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function removeCreatedItem() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove the created Chroma Cookiecane item
    const deletedItem = await Item.deleteOne({ itemId: 'chroma_cookiecane' });
    console.log(`✅ Deleted ${deletedItem.deletedCount} Chroma Cookiecane item(s)`);

    // Find Dave4Wild user and remove the items from inventory
    const user = await User.findOne({ username: 'Dave4Wild' });
    if (user) {
      const inventory = await Inventory.findOne({ userId: user._id });
      if (inventory) {
        // Remove all chroma_cookiecane items from inventory
        const initialCount = inventory.items.length;
        inventory.items = inventory.items.filter(item => item.itemId !== 'chroma_cookiecane');
        await inventory.save();
        console.log(`✅ Removed ${initialCount - inventory.items.length} Chroma Cookiecane items from Dave4Wild's inventory`);
        console.log(`📊 Current inventory count: ${inventory.items.length}`);
      }
    }

    console.log('✅ Cleanup completed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

removeCreatedItem();
