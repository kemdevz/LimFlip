require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function generateJWT(username) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User ${username} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${username} (ID: ${user._id})`);

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('\n=== JWT Token ===');
    console.log(token);
    console.log('\n=== Token Info ===');
    console.log(`User: ${user.username}`);
    console.log(`User ID: ${user._id}`);
    console.log(`Expires: 30 days`);
    console.log('\nUse this token in your Authorization header as:');
    console.log(`Bearer ${token}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

const username = process.argv[2] || 'bloxfruit_ihack';
generateJWT(username);
