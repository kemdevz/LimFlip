require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { searchRobloxUsers } = require('../utils/roblox');

const MONGODB_URI = process.env.MONGODB_URI;

async function updateUserAvatars() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      console.log(`Processing user: ${user.username} (Roblox ID: ${user.robloxUserId})`);
      
      try {
        const users = await searchRobloxUsers(user.username);
        const foundUser = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
        const avatarUrl = foundUser?.avatar || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.robloxUserId}&width=150&height=150&format=png`;
        
        user.avatarUrl = avatarUrl;
        await user.save();
        
        console.log(`✓ Updated ${user.username} with avatar: ${avatarUrl}`);
      } catch (error) {
        console.error(`✗ Error updating ${user.username}:`, error.message);
      }
    }

    console.log('All users updated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateUserAvatars();
