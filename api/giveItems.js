const connectDB = require('./config/database');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Item = require('./models/Item');

async function giveItemsToUser() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    const username = 'landostinks15';
    const itemNames = ['Harvester', 'Icepiercer', 'Candy', 'Gingerscope', 'Evergreen', '2X'];
    
    console.log(`Finding user: ${username}...`);
    const user = await User.findOne({ username });
    
    if (!user) {
      console.error(`User ${username} not found`);
      process.exit(1);
    }
    
    console.log(`User found: ${user.username} (ID: ${user._id})`);
    
    console.log('Finding items...');
    const items = await Item.find({ name: { $in: itemNames } });
    
    if (items.length === 0) {
      console.error('No items found');
      process.exit(1);
    }
    
    console.log(`Found ${items.length} items:`);
    items.forEach(item => {
      console.log(`  - ${item.name} (${item.itemId})`);
    });
    
    // Check for missing items
    const foundNames = items.map(i => i.name);
    const missingNames = itemNames.filter(name => !foundNames.includes(name));
    if (missingNames.length > 0) {
      console.warn('Warning: The following items were not found:', missingNames.join(', '));
    }
    
    console.log('Finding or creating inventory...');
    let inventory = await Inventory.findOne({ userId: user._id });
    
    if (!inventory) {
      console.log('Creating new inventory...');
      inventory = new Inventory({
        userId: user._id,
        items: []
      });
    }
    
    console.log('Adding items to inventory...');
    items.forEach(item => {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      inventory.items.push({
        uniqueId: uniqueId,
        itemId: item.itemId,
        acquiredAt: new Date()
      });
      console.log(`  Added: ${item.name} (uniqueId: ${uniqueId})`);
    });
    
    console.log('Saving inventory...');
    await inventory.save();
    
    console.log(`Successfully added ${items.length} items to ${username}'s inventory`);
    console.log(`Total inventory value: ${inventory.totalValue}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

giveItemsToUser();
