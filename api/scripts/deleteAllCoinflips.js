require('dotenv').config({ path: './api/.env' });
const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function deleteAllCoinflips() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Coinflip.deleteMany({});
    console.log(`Deleted ${result.deletedCount} coinflip games`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllCoinflips();
