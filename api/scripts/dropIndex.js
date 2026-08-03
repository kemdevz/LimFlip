require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function dropIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Drop the problematic id index
    try {
      await collection.dropIndex('id_1');
      console.log('Successfully dropped id_1 index');
    } catch (error) {
      if (error.code === 26) {
        console.log('Index id_1 does not exist, skipping');
      } else {
        console.error('Error dropping index:', error);
      }
    }

    // List all indexes to verify
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropIndex();
