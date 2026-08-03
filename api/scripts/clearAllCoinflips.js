require('dotenv').config();
const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';

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
