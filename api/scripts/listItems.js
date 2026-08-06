const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function listItems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const items = await Item.find({});
    console.log(`Found ${items.length} items in database:\n`);

    items.forEach(item => {
      console.log(`Name: ${item.name}`);
      console.log(`Item ID: ${item.itemId}`);
      console.log(`Rarity: ${item.rarity}`);
      console.log(`Value: ${item.value}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

listItems();
