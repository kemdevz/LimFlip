const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function fixInventoryDuplicateKeys() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const inventories = db.collection('inventories');

    // First, drop the problematic index
    try {
      await inventories.dropIndex('items.uniqueId_1');
      console.log('✅ Successfully dropped items.uniqueId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Index items.uniqueId_1 does not exist (already dropped)');
      } else {
        console.error('⚠️ Error dropping index:', error.message);
      }
    }

    // Find and fix inventories with null uniqueId items
    const result = await inventories.updateMany(
      { 'items.uniqueId': null },
      { $pull: { items: { uniqueId: null } } }
    );

    console.log(`✅ Fixed ${result.modifiedCount} inventories with null uniqueId items`);

    // List remaining indexes
    const indexes = await inventories.indexes();
    console.log('📋 Current indexes:', indexes.map(i => i.name));

    // Verify no more null uniqueId items exist
    const nullCount = await inventories.countDocuments({ 'items.uniqueId': null });
    if (nullCount > 0) {
      console.log(`⚠️ Warning: ${nullCount} items still have null uniqueId`);
    } else {
      console.log('✅ No items with null uniqueId found');
    }

    console.log('✅ Fix completed successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixInventoryDuplicateKeys();
