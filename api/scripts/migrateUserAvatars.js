const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function getRobloxAvatar(robloxId) {
  try {
    const res = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=420x420&format=Png&isCircular=false`
    );
    const data = await res.json();
    return data?.data?.[0]?.imageUrl || null;
  } catch (error) {
    console.error(`Failed to fetch avatar for ${robloxId}:`, error.message);
    return null;
  }
}

async function migrateAvatars() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const user of users) {
      if (!user.robloxUserId) {
        console.log(`Skipping ${user.username}: no robloxUserId`);
        skipped++;
        continue;
      }

      console.log(`Fetching avatar for ${user.username} (Roblox ID: ${user.robloxUserId})...`);
      const avatarUrl = await getRobloxAvatar(user.robloxUserId);

      if (avatarUrl) {
        if (avatarUrl !== user.avatarUrl) {
          user.avatarUrl = avatarUrl;
          await user.save();
          console.log(`  Updated avatar for ${user.username}`);
          updated++;
        } else {
          console.log(`  Avatar already up to date for ${user.username}`);
          skipped++;
        }
      } else {
        console.log(`  Failed to fetch avatar for ${user.username}`);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\nMigration complete: ${updated} updated, ${skipped} skipped, ${failed} failed`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateAvatars();
