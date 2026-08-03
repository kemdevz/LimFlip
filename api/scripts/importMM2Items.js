require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

// Load MM2 items data
const fs = require('fs');
const path = require('path');

const mm2DataPath = path.join(__dirname, '../../typescript/MM2ItemsData.json');
const mm2Data = JSON.parse(fs.readFileSync(mm2DataPath, 'utf8'));

// Map MM2 rarity to our enum
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

// Map ItemGroup to category
const categoryMap = {
  'Weapons': 'weapon',
  'Pets': 'pet',
  'Misc': 'misc',
  'Effects': 'effect'
};

async function importMM2Items() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log('Starting MM2 items import...');
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const [itemId, itemData] of Object.entries(mm2Data)) {
      try {
        const { Value, ImageId, Properties } = itemData;
        
        // Map rarity
        const rarity = rarityMap[Properties.Rarity] || 'common';
        
        // Map category
        const category = categoryMap[Properties.ItemGroup] || 'weapon';
        
        // Construct image URL using mm2.rocks format
        // Convert item name to lowercase and replace spaces with hyphens
        const itemNameSlug = Properties.DisplayName.toLowerCase().replace(/\s+/g, '-');
        const image = `https://mm2.rocks/images/mm2-wiki/${itemNameSlug}.png`;
        
        // Check if item already exists
        const existingItem = await Item.findOne({ itemId });
        if (existingItem) {
          console.log(`⏭️  Skipping existing item: ${Properties.DisplayName}`);
          skipped++;
          continue;
        }

        // Create new item
        const newItem = new Item({
          itemId,
          name: Properties.DisplayName,
          image,
          rarity,
          value: Value || 0,
          category
        });

        await newItem.save();
        console.log(`✅ Imported: ${Properties.DisplayName} (${rarity}, ${category})`);
        imported++;

      } catch (error) {
        console.error(`❌ Error importing item ${itemId}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Import Summary ===');
    console.log(`✅ Imported: ${imported}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total processed: ${imported + skipped + errors}`);

  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

importMM2Items();
