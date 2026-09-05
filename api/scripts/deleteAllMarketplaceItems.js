require('dotenv').config();
const mongoose = require('mongoose');
const Marketplace = require('../models/Marketplace');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function deleteAllMarketplaceItems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all marketplace listings
    const listings = await Marketplace.find({});
    console.log(`Found ${listings.length} marketplace listings`);

    // Update inventory items to remove marketplace listing flag
    let updatedInventories = 0;
    for (const listing of listings) {
      const inventory = await Inventory.findOne({ userId: listing.seller });
      if (inventory) {
        const invItem = inventory.items.find(item => item.uniqueId === listing.inventoryItemUniqueId);
        if (invItem) {
          invItem.listedInMarketplace = false;
          await inventory.save();
          updatedInventories++;
        }
      }
    }
    console.log(`Updated ${updatedInventories} inventory items`);

    // Delete all marketplace listings
    const result = await Marketplace.deleteMany({});
    console.log(`Deleted ${result.deletedCount} marketplace listings`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

deleteAllMarketplaceItems();
