const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');
require('dotenv').config();

async function deleteCoinflips() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloxbashh';
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete all coinflip games
    const result = await Coinflip.deleteMany({});
    console.log(`Deleted ${result.deletedCount} coinflip games`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error deleting coinflip games:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

deleteCoinflips();
