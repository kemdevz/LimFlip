require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function checkImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check a few limited items
    const items = await Item.find({ category: 'limited' }).limit(10);
    
    console.log('Sample item images:');
    items.forEach(item => {
      console.log(`\n${item.name}:`);
      console.log(`  Image URL: ${item.image}`);
      console.log(`  Asset ID: ${item.assetId}`);
    });
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkImages();
