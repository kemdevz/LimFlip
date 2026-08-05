const connectDB = require('./config/database');
const Coinflip = require('./models/Coinflip');

async function clearCoinflips() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Deleting all coinflips...');
    const result = await Coinflip.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} coinflip(s)`);
    process.exit(0);
  } catch (error) {
    console.error('Error clearing coinflips:', error);
    process.exit(1);
  }
}

clearCoinflips();
