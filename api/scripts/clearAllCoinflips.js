require('dotenv').config();
const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function clearAllCoinflips() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Coinflip.deleteMany({});
    console.log(`Deleted ${result.deletedCount} coinflip games`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

clearAllCoinflips();
