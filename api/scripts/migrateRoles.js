const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh';

async function migrateRoles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users without a role field
    const usersWithoutRole = await User.find({ role: { $exists: false } });
    
    console.log(`Found ${usersWithoutRole.length} users without role field`);

    if (usersWithoutRole.length === 0) {
      console.log('All users already have role field. No migration needed.');
      process.exit(0);
    }

    // Update all users to have 'User' role by default
    const updateResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'User' } }
    );

    console.log(`Updated ${updateResult.modifiedCount} users to have 'User' role`);
    
    // Verify the update
    const usersWithoutRoleAfter = await User.find({ role: { $exists: false } });
    if (usersWithoutRoleAfter.length === 0) {
      console.log('Migration successful! All users now have role field.');
    } else {
      console.log(`Warning: ${usersWithoutRoleAfter.length} users still without role field`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateRoles();
