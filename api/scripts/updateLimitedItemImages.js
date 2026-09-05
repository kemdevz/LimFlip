require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function getRobloxThumbnail(assetId) {
  try {
    const response = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`);
    const data = await response.json();
    if (data.data && data.data[0] && data.data[0].imageUrl) {
      return data.data[0].imageUrl;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching thumbnail for ${assetId}:`, error.message);
    return null;
  }
}

async function updateLimitedItemImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all limited items
    const dbItems = await Item.find({ category: 'limited' });
    
    console.log(`Found ${dbItems.length} limited items in database`);

    let updated = 0;
    let errors = 0;

    for (const item of dbItems) {
      try {
        // Fetch the actual image URL from Roblox thumbnails API
        const imageUrl = await getRobloxThumbnail(item.assetId);
        
        if (imageUrl) {
          item.image = imageUrl;
          await item.save();
          console.log(`✅ Updated: ${item.name}`);
          updated++;
        } else {
          console.log(`⚠️  No image found for: ${item.name}`);
          errors++;
        }
        
        // Small delay to avoid rate limiting
        if (updated % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`❌ Error updating ${item.name}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Update Summary ===');
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total processed: ${updated + errors}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateLimitedItemImages();
