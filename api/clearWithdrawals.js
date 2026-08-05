const connectDB = require('./config/database');
const Withdrawal = require('./models/Withdrawal');

async function clearWithdrawals() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Finding all withdrawals...');
    const allWithdrawals = await Withdrawal.find({});
    console.log(`Found ${allWithdrawals.length} total withdrawals`);
    
    if (allWithdrawals.length === 0) {
      console.log('No withdrawals found');
      process.exit(0);
    }
    
    const result = await Withdrawal.deleteMany({});
    console.log(`Deleted ${result.deletedCount} withdrawal(s)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearWithdrawals();
