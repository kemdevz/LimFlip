const connectDB = require('./config/database');
const Inventory = require('./models/Inventory');

async function resetAllInventories() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Finding all inventories...');
    const allInventories = await Inventory.find({});
    console.log(`Found ${allInventories.length} inventories`);
    
    if (allInventories.length === 0) {
      console.log('No inventories found');
      process.exit(0);
    }
    
    console.log('WARNING: This will clear all items from all inventories!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Delete all inventories to avoid unique index issues
    const deleteResult = await Inventory.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} inventory/ies`);
    console.log('All inventories have been reset (deleted)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAllInventories();
