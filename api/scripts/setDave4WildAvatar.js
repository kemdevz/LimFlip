const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function setDave4WildAvatar() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: 'Dave4Wild' });
    
    if (!user) {
      console.log('User Dave4Wild not found');
      return;
    }

    const customAvatarUrl = 'https://i.pinimg.com/474x/17/1d/45/171d45840808f3bce8b4dba3efa1c819.jpg';
    
    user.avatarUrl = customAvatarUrl;
    await user.save();

    console.log('Successfully set custom avatar for Dave4Wild:', customAvatarUrl);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setDave4WildAvatar();
