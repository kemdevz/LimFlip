const mongoose = require('mongoose');
const Marketplace = require('../models/Marketplace');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function clearMarketplace() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Count items before deletion
    const count = await Marketplace.countDocuments();
    console.log(`Found ${count} marketplace items`);

    if (count === 0) {
      console.log('No marketplace items to clear');
      return;
    }

    // Delete all marketplace items
    const result = await Marketplace.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} marketplace items`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearMarketplace();
