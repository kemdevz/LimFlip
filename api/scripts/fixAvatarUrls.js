const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function fixAvatarUrls() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with old avatar URL format
    const users = await User.find({
      avatarUrl: { $regex: 'thumbnails.roblox.com' }
    });
    console.log(`Found ${users.length} users with old avatar URL format`);

    let updatedCount = 0;
    for (const user of users) {
      const oldUrl = user.avatarUrl;
      // Extract userId from old URL format
      const match = oldUrl.match(/userIds=(\d+)/);
      if (match && match[1]) {
        const userId = match[1];
        user.avatarUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
        await user.save();
        console.log(`✅ Updated ${user.username}: ${oldUrl} -> ${user.avatarUrl}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Total users updated: ${updatedCount}`);
  } catch (error) {
    console.error('Error fixing avatar URLs:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixAvatarUrls();
