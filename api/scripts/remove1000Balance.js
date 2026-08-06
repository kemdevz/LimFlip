const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function remove1000Balance() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with balance >= 1000
    const users = await User.find({ balance: { $gte: 1000 } });
    console.log(`Found ${users.length} users with balance >= 1000`);

    let totalRemoved = 0;
    for (const user of users) {
      const oldBalance = user.balance;
      user.balance = Math.max(0, user.balance - 1000);
      await user.save();
      const removed = oldBalance - user.balance;
      totalRemoved += removed;
      console.log(`✅ Removed ${removed} from ${user.username} (was ${oldBalance}, now ${user.balance})`);
    }

    console.log(`\n📊 Total balance removed: ${totalRemoved}`);
    console.log(`📊 Total users updated: ${users.length}`);
  } catch (error) {
    console.error('Error removing 1000 balance:', error);
  } finally {
    await mongoose.disconnect();
  }
}

remove1000Balance();
