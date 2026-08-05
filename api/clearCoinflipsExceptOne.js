const connectDB = require('./config/database');
const Coinflip = require('./models/Coinflip');

async function clearCoinflipsExceptOne() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Finding all coinflips...');
    const allCoinflips = await Coinflip.find({});
    console.log(`Found ${allCoinflips.length} total coinflips`);
    
    if (allCoinflips.length === 0) {
      console.log('No coinflips found');
      process.exit(0);
    }
    
    // Find one active coinflip to keep
    const activeCoinflip = await Coinflip.findOne({ status: 'active' });
    
    if (!activeCoinflip) {
      console.log('No active coinflip found, keeping the first one');
      const coinflipToKeep = allCoinflips[0];
      const idsToDelete = allCoinflips.slice(1).map(c => c._id);
      
      if (idsToDelete.length > 0) {
        const result = await Coinflip.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`Deleted ${result.deletedCount} coinflip(s)`);
        console.log(`Kept coinflip: ${coinflipToKeep._id} (status: ${coinflipToKeep.status})`);
      } else {
        console.log('Only one coinflip exists, nothing to delete');
      }
    } else {
      console.log(`Found active coinflip: ${activeCoinflip._id}`);
      const idsToDelete = allCoinflips
        .filter(c => c._id.toString() !== activeCoinflip._id.toString())
        .map(c => c._id);
      
      if (idsToDelete.length > 0) {
        const result = await Coinflip.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`Deleted ${result.deletedCount} coinflip(s)`);
        console.log(`Kept active coinflip: ${activeCoinflip._id}`);
      } else {
        console.log('Only one coinflip exists, nothing to delete');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearCoinflipsExceptOne();
