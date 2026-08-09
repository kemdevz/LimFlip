const mongoose = require('mongoose');
const Item = require('./models/Item');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh';

// Function to convert item name to Supreme Values API format
function convertToSupremeValuesFormat(itemName) {
  // Replace spaces with underscores
  let formatted = itemName.replace(/\s+/g, '_');
  
  // Remove special characters (keep only alphanumeric and underscores)
  formatted = formatted.replace(/[^a-zA-Z0-9_]/g, '');
  
  return formatted;
}

async function updateItemImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all items
    const items = await Item.find({});
    console.log(`Found ${items.length} items to update`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      try {
        // Check if image already uses Supreme Values API
        if (item.image.includes('supremevalues.com')) {
          console.log(`Skipping ${item.name} - already using Supreme Values API`);
          skippedCount++;
          continue;
        }

        // Convert item name to Supreme Values format
        const svFormat = convertToSupremeValuesFormat(item.name);
        
        // Construct new image URL
        const newImageUrl = `https://supremevalues.com/media/mm2godlies/${svFormat}.webp`;
        
        // Update item
        item.image = newImageUrl;
        await item.save();
        
        updatedCount++;
        console.log(`✓ Updated ${item.name}: ${newImageUrl}`);
      } catch (error) {
        console.error(`✗ Failed to update ${item.name}:`, error.message);
      }
    }

    console.log(`\nUpdate complete: ${updatedCount} updated, ${skippedCount} skipped`);
  } catch (error) {
    console.error('Error updating item images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateItemImages();
