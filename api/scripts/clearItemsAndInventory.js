require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');
const Marketplace = require('../models/Marketplace');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

console.log('Connecting to MongoDB:', MONGODB_URI.substring(0, 30) + '...');

async function clearItemsAndInventory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Starting cleanup...');

    // Delete all marketplace listings
    const marketplaceResult = await Marketplace.deleteMany({});
    console.log(`Deleted ${marketplaceResult.deletedCount} marketplace listings`);

    // Delete all inventories
    const inventoryResult = await Inventory.deleteMany({});
    console.log(`Deleted ${inventoryResult.deletedCount} inventories`);

    // Delete all items
    const itemResult = await Item.deleteMany({});
    console.log(`Deleted ${itemResult.deletedCount} items`);

    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

clearItemsAndInventory();
