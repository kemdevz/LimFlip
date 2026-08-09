const mongoose = require('mongoose');
const User = require('../api/models/User');
const noblox = require('noblox.js');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh';

async function updateAvatars() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      if (!user.robloxUserId) {
        console.log(`Skipping ${user.username} - no robloxUserId`);
        continue;
      }

      try {
        // Fetch fresh avatar using noblox
        const userThumbnail = await noblox.getPlayerThumbnail(
          user.robloxUserId,
          420,
          'png',
          false,
          'Headshot'
        );
        
        const avatarUrl = userThumbnail[0].imageUrl;
        
        // Update user with fresh avatar
        user.avatarUrl = avatarUrl;
        await user.save();
        
        updatedCount++;
        console.log(`✓ Updated ${user.username} (${user.robloxUserId}): ${avatarUrl}`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to update ${user.username}:`, error.message);
        
        // Fallback to default avatar URL
        const fallbackAvatar = `https://www.roblox.com/headshot-thumbnail/image?userId=${user.robloxUserId}&width=420&height=420&format=png`;
        user.avatarUrl = fallbackAvatar;
        await user.save();
        console.log(`✓ Set fallback avatar for ${user.username}: ${fallbackAvatar}`);
      }
    }

    console.log(`\nUpdate complete: ${updatedCount} updated, ${errorCount} errors`);
  } catch (error) {
    console.error('Error updating avatars:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateAvatars();
