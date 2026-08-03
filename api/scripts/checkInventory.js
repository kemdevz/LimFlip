const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const Item = require('../models/Item');
const User = require('../models/User');
require('dotenv').config();

async function checkInventory() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check Items collection
    console.log('\n=== Items Collection ===');
    const items = await Item.find({});
    console.log(`Total items in Items collection: ${items.length}`);
    items.forEach(item => {
      console.log(`- ${item.name} (${item.itemId}): ${item.value}, ${item.rarity}`);
    });

    // Check Inventory collection
    console.log('\n=== Inventory Collection ===');
    const inventories = await Inventory.find({});
    console.log(`Total inventories: ${inventories.length}`);
    
    for (const inventory of inventories) {
      const user = await User.findById(inventory.userId);
      console.log(`\nUser: ${user?.username || 'Unknown'}`);
      console.log(`Total items: ${inventory.items.length}`);
      console.log(`Total value: ${inventory.totalValue}`);
      
      if (inventory.items.length > 0) {
        console.log('First few inventory items:');
        for (let i = 0; i < Math.min(3, inventory.items.length); i++) {
          const invItem = inventory.items[i];
          console.log(`  ${i + 1}. uniqueId: ${invItem.uniqueId}, itemId: ${invItem.itemId}`);
          
          // Check if this itemId exists in Items collection
          const itemDef = await Item.findOne({ itemId: invItem.itemId });
          if (itemDef) {
            console.log(`     → Found in Items: ${itemDef.name}, value: ${itemDef.value}`);
          } else {
            console.log(`     → NOT FOUND in Items collection!`);
          }
        }
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking inventory:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

checkInventory();
