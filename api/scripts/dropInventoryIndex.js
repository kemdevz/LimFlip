const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function dropInventoryIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const inventories = db.collection('inventories');

    // Drop the problematic index
    try {
      await inventories.dropIndex('items.uniqueId_1');
      console.log('Successfully dropped items.uniqueId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index items.uniqueId_1 does not exist');
      } else {
        console.error('Error dropping index:', error);
      }
    }

    // List remaining indexes
    const indexes = await inventories.indexes();
    console.log('Remaining indexes:', indexes.map(i => i.name));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

dropInventoryIndex();
