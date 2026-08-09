const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh';

async function updateDave4winAvatar() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Dave4win user (case insensitive)
    const user = await User.findOne({ 
      username: { $regex: /^Dave4win$/i } 
    });

    if (!user) {
      console.log('User Dave4win not found. Searching for similar usernames...');
      
      // Search for users with "dave" in username
      const similarUsers = await User.find({ 
        username: { $regex: /dave/i } 
      });
      
      console.log('Found similar users:', similarUsers.map(u => u.username));
      
      if (similarUsers.length === 0) {
        console.log('No users found with "dave" in username');
        return;
      }
      
      // Use the first matching user
      const user = similarUsers[0];
      console.log(`Updating user: ${user.username}`);
      
      user.avatarUrl = 'https://i.pinimg.com/474x/17/1d/45/171d45840808f3bce8b4dba3efa1c819.jpg';
      await user.save();
      
      console.log(`✓ Updated ${user.username} avatar: ${user.avatarUrl}`);
    } else {
      // Update avatar
      user.avatarUrl = 'https://i.pinimg.com/474x/17/1d/45/171d45840808f3bce8b4dba3efa1c819.jpg';
      await user.save();

      console.log(`✓ Updated Dave4win avatar: ${user.avatarUrl}`);
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateDave4winAvatar();
