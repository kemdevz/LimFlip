require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

// Load DEV.itemValues.json
const fs = require('fs');
const path = require('path');

const itemValuesPath = path.join(__dirname, '../../typescript/DEV.itemValues.json');
const itemValuesData = JSON.parse(fs.readFileSync(itemValuesPath, 'utf8'));

async function updateItemValues() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Starting item value update...');

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    // Create a map of itemName to itemValue for quick lookup
    const valueMap = new Map();
    for (const item of itemValuesData) {
      // Normalize the name: remove special chars, spaces, parentheses content
      const normalizedName = item.itemName
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/\s+/g, '');
      valueMap.set(normalizedName, item.itemValue);
    }

    // Get all items from database
    const items = await Item.find({});
    console.log(`Found ${items.length} items in database`);

    for (const dbItem of items) {
      try {
        // Normalize database item name the same way
        const normalizedName = dbItem.name
          .toLowerCase()
          .replace(/'/g, '')
          .replace(/\s*\([^)]*\)/g, '')
          .replace(/\s+/g, '');
        
        // Try to match by normalized name
        const value = valueMap.get(normalizedName);
        
        if (value !== undefined) {
          // Update the item value
          dbItem.value = value;
          await dbItem.save();
          console.log(`✅ Updated ${dbItem.name}: ${dbItem.value}`);
          updated++;
        } else {
          console.log(`⚠️  No value found for: ${dbItem.name} (normalized: ${normalizedName})`);
          notFound++;
        }
      } catch (error) {
        console.error(`❌ Error updating ${dbItem.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Update Summary ===');
    console.log(`✅ Updated: ${updated}`);
    console.log(`⚠️  Not found: ${notFound}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total processed: ${updated + notFound + errors}`);

  } catch (error) {
    console.error('Fatal error during update:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

updateItemValues();
