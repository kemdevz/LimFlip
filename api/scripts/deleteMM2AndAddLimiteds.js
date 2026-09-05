require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Inventory = require('../models/Inventory');
const Marketplace = require('../models/Marketplace');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

// Rolimons API endpoints
const ROLIMONS_ITEM_DETAILS_URL = 'https://www.rolimons.com/itemapi/itemdetails';
const ROLIMONS_PLAYER_DETAILS_URL = 'https://www.rolimons.com/playerapi/playerdetails';

// Helper function to extract JavaScript variable from HTML
function extractJSVariable(html, varName) {
  const regex = new RegExp(`${varName}\\s*=\\s*(\\{[^}]*\\}|\\[[^\\]]*\\])`, 's');
  const match = html.match(regex);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error(`Failed to parse ${varName}:`, e);
      return null;
    }
  }
  return null;
}

// Helper function to normalize item name
function normalizeItemName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
}

// Map Rolimons rarity to our enum
const rarityMap = {
  'Common': 'common',
  'Uncommon': 'uncommon',
  'Rare': 'rare',
  'Legendary': 'legendary',
  'Godly': 'mythic',
  'Ancient': 'mythic',
  'Vintage': 'legendary',
  'Unique': 'legendary',
  'Chroma': 'mythic',
  'Evo': 'legendary'
};

// Fetch all limited items from Rolimons
async function fetchRolimonsItems() {
  try {
    console.log('Fetching items from Rolimons...');
    const response = await fetch(ROLIMONS_ITEM_DETAILS_URL);
    
    if (!response.ok) {
      throw new Error(`Rolimons API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debug: Log the actual response structure
    console.log('Response keys:', Object.keys(data));
    console.log('Sample data:', JSON.stringify(data).substring(0, 500));
    
    // The response format is: { "items": { "assetId": [name, rap, ...], ... } }
    const items = data.items || {};
    
    console.log(`Found ${Object.keys(items).length} items on Rolimons`);
    
    const limitedItems = [];
    
    for (const [assetId, itemData] of Object.entries(items)) {
      // itemData format: [name, acronym, rap, value, best_price, ...]
      // Check if itemData is an array
      if (!Array.isArray(itemData)) {
        console.log(`Skipping ${assetId}: not an array`);
        continue;
      }
      
      const name = itemData[0];
      const rap = itemData[2]; // RAP is at index 2
      
      // Only include items with valid RAP (> 0)
      if (name && rap > 0) {
        limitedItems.push({
          itemId: assetId,
          name: name,
          assetId: assetId,
          image: `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId}&width=420&height=420&format=png`,
          rarity: determineRarity(rap),
          value: rap,
          category: 'limited'
        });
      }
    }
    
    console.log(`Processed ${limitedItems.length} limited items`);
    return limitedItems;
    
  } catch (error) {
    console.error('Error fetching from Rolimons:', error);
    throw error;
  }
}

// Determine rarity based on RAP value
function determineRarity(rap) {
  if (rap >= 1000000) return 'mythic';
  if (rap >= 100000) return 'legendary';
  if (rap >= 10000) return 'rare';
  if (rap >= 1000) return 'uncommon';
  return 'common';
}

// Delete all MM2 items
async function deleteMM2Items() {
  try {
    console.log('Deleting MM2 items...');
    
    // Delete items that have mm2Value set
    const result = await Item.deleteMany({ mm2Value: { $ne: null } });
    console.log(`Deleted ${result.deletedCount} MM2 items`);
    
    // Also clear inventories and marketplace since items are changing
    const inventoryResult = await Inventory.deleteMany({});
    console.log(`Cleared ${inventoryResult.deletedCount} inventories`);
    
    const marketplaceResult = await Marketplace.deleteMany({});
    console.log(`Cleared ${marketplaceResult.deletedCount} marketplace listings`);
    
    return result.deletedCount;
    
  } catch (error) {
    console.error('Error deleting MM2 items:', error);
    throw error;
  }
}

// Add limited items to database
async function addLimitedItems(limitedItems) {
  try {
    console.log('Adding limited items to database...');
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const item of limitedItems) {
      try {
        // Check if item already exists
        const existingItem = await Item.findOne({ itemId: item.itemId });
        if (existingItem) {
          console.log(`⏭️  Skipping existing item: ${item.name}`);
          skipped++;
          continue;
        }
        
        // Create new item
        const newItem = new Item(item);
        await newItem.save();
        
        console.log(`✅ Imported: ${item.name} (RAP: ${item.value}, ${item.rarity})`);
        imported++;
        
        // Add delay to avoid rate limiting
        if (imported % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Error importing item ${item.name}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n=== Import Summary ===');
    console.log(`✅ Imported: ${imported}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total processed: ${imported + skipped + errors}`);
    
    return { imported, skipped, errors };
    
  } catch (error) {
    console.error('Error adding limited items:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Step 1: Delete MM2 items
    const deletedCount = await deleteMM2Items();
    
    // Step 2: Fetch limited items from Rolimons
    const limitedItems = await fetchRolimonsItems();
    
    // Step 3: Add limited items to database
    const importResult = await addLimitedItems(limitedItems);
    
    console.log('\n=== Migration Complete ===');
    console.log(`Deleted ${deletedCount} MM2 items`);
    console.log(`Imported ${importResult.imported} limited items`);
    
  } catch (error) {
    console.error('Fatal error during migration:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

main();
