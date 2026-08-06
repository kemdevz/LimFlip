const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://radovanladygaga:radovan2005@bloxbashh.9qkq0.mongodb.net/bloxbashh?retryWrites=true&w=majority&appName=bloxbashh';

async function checkUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Search for user by username
    const userByUsername = await User.findOne({ username: 'ananyabiswas9999' });
    console.log('\n--- Search by username: ananyabiswas9999 ---');
    if (userByUsername) {
      console.log('✅ Found user:');
      console.log('Username:', userByUsername.username);
      console.log('Email:', userByUsername.email);
      console.log('Roblox User ID:', userByUsername.robloxUserId);
      console.log('Discord ID:', userByUsername.discordId);
      console.log('Balance:', userByUsername.balance);
    } else {
      console.log('❌ User not found by username');
    }

    // Search for user by robloxUserId (we need to get the Roblox ID first)
    console.log('\n--- All users with robloxUserId ---');
    const usersWithRoblox = await User.find({ robloxUserId: { $ne: '' } });
    console.log(`Found ${usersWithRoblox.length} users with robloxUserId`);
    usersWithRoblox.forEach(user => {
      console.log(`Username: ${user.username}, Roblox ID: ${user.robloxUserId}`);
    });

    // Search for user with Discord ID
    console.log('\n--- Search by Discord ID: 1505296387968077896 ---');
    const userByDiscord = await User.findOne({ discordId: '1505296387968077896' });
    if (userByDiscord) {
      console.log('✅ Found user:');
      console.log('Username:', userByDiscord.username);
      console.log('Roblox User ID:', userByDiscord.robloxUserId);
    } else {
      console.log('❌ User not found by Discord ID');
    }

    // List all users
    console.log('\n--- All users ---');
    const allUsers = await User.find({});
    console.log(`Total users: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`Username: ${user.username}, Roblox ID: ${user.robloxUserId}, Discord ID: ${user.discordId}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
