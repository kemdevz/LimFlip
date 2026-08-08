const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh';

async function makeOwner() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = 'Dave4Wild';

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log(`User ${username} not found`);
      process.exit(1);
    }

    // Update user role to Owner
    user.role = 'Owner';
    await user.save();

    console.log(`Successfully updated ${username} to Owner role`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeOwner();
