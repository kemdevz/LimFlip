const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { checkUsernameExists, searchRobloxUsers, getUserDescription } = require('../utils/roblox');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const words = [
  'crew', 'omit', 'gadget', 'win', 'pond', 'jealous', 'warfare', 'eight',
  'similar', 'label', 'young', 'negative', 'brave', 'crisp', 'dawn', 'eagle',
  'flame', 'grace', 'honor', 'ivory', 'jolly', 'knack', 'lemon', 'merry',
  'noble', 'orbit', 'pride', 'quartz', 'rapid', 'solar', 'tower', 'unity',
  'vivid', 'whale', 'xenon', 'youth', 'zebra', 'amber', 'bloom', 'civic',
  'delta', 'eagle', 'frost', 'globe', 'hazel', 'index', 'jolly', 'karma',
  'lunar', 'magic', 'naval', 'ocean', 'piano', 'quiet', 'radio', 'satin',
  'tiger', 'ultra', 'vapor', 'waltz', 'xenon', 'yacht', 'zinc'
];

const verificationCodes = {};

function generateRandomWords(count = 10) {
  const selectedWords = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex]);
  }
  return selectedWords.join(' ');
}

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Signup request received:', { username, email, password: '***' });

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await checkUsernameExists(username);
    
    if (result.exists) {
      const verificationCode = generateRandomWords(10);
      verificationCodes[result.userId] = verificationCode;
      res.json({ exists: true, message: 'Username found', userId: result.userId, verificationCode });
    } else {
      res.status(404).json({ exists: false, message: 'Username not found' });
    }
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Error checking username' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, robloxUserId } = req.body;

    if (!username || !robloxUserId) {
      return res.status(400).json({ error: 'Username and Roblox ID are required' });
    }

    let user = await User.findOne({ username });

    // Always fetch fresh avatar URL from Roblox
    const users = await searchRobloxUsers(username);
    console.log('Login search results:', users);
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    const avatarUrl = foundUser?.avatar || `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=420x420&format=Png&isCircular=false`;
    console.log('Login using avatar URL:', avatarUrl);

    if (!user) {
      user = new User({
        username: username,
        email: `${username}@roblox.com`,
        robloxUserId: robloxUserId.toString(),
        avatarUrl: avatarUrl
      });
      await user.save();
      console.log(`Created new user: ${username} (Roblox ID: ${robloxUserId}) with avatar: ${avatarUrl}`);
    } else {
      // Always update avatar URL on login to ensure it's fresh
      user.avatarUrl = avatarUrl;
      await user.save();
      console.log(`Updated user: ${username} with fresh avatar: ${avatarUrl}`);
    }

    const token = jwt.sign({ userId: user._id.toString(), username: user.username, robloxUserId: user.robloxUserId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        robloxUserId: user.robloxUserId,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-description', async (req, res) => {
  try {
    const { username, robloxUserId } = req.body;

    if (!username || !robloxUserId) {
      return res.status(400).json({ error: 'Username and Roblox ID are required' });
    }

    console.log(`Verifying description for ${username} (Roblox ID: ${robloxUserId})`);

    const verificationCode = verificationCodes[robloxUserId] || generateRandomWords(10);
    verificationCodes[robloxUserId] = verificationCode;
    
    // Fetch actual user description from Roblox
    let userDescription = '';
    try {
      const { description } = await getUserDescription(robloxUserId);
      userDescription = description || '';
      console.log(`Fetched user description: "${userDescription}"`);
    } catch (error) {
      console.error('Error fetching user description:', error);
      return res.status(500).json({ error: 'Failed to fetch Roblox profile description' });
    }
    
    // Check if verification code is in the description
    if (!userDescription.includes(verificationCode)) {
      return res.status(400).json({
        error: 'Verification failed. Please add this code to your Roblox profile description: ' + verificationCode
      });
    }
    
    let user = await User.findOne({ username });

    if (!user) {
      const users = await searchRobloxUsers(username);
      console.log('Search results:', users);
      const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      const avatarUrl = foundUser?.avatar || `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=420x420&format=Png&isCircular=false`;
      console.log('Using avatar URL:', avatarUrl);
      console.log('Roblox userId from request:', robloxUserId);

      user = new User({
        username: username,
        email: `${username}@roblox.com`,
        robloxUserId: robloxUserId.toString(),
        avatarUrl: avatarUrl,
        verifiedAt: new Date()
      });
      await user.save();
      console.log(`Created new user: ${username} (Roblox ID: ${robloxUserId}) with avatar: ${avatarUrl}`);
    } else {
      user.verifiedAt = new Date();
      if (!user.avatarUrl) {
        const users = await searchRobloxUsers(username);
        console.log('Search results for existing user:', users);
        const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        const avatarUrl = foundUser?.avatar || `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=420x420&format=Png&isCircular=false`;
        console.log('Verify using avatar URL:', avatarUrl);
        console.log('Roblox userId from request:', robloxUserId);
        user.avatarUrl = avatarUrl;
      }
      await user.save();
    }

    const token = jwt.sign({ userId: user._id.toString(), username: user.username, robloxUserId: user.robloxUserId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Verification successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        robloxUserId: user.robloxUserId,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Verify description error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Always fetch fresh avatar URL from Roblox API (same as login modal)
    let avatarUrl = user.avatarUrl;
    try {
      const users = await searchRobloxUsers(user.username);
      const foundUser = users.find(u => u.username.toLowerCase() === user.username.toLowerCase());
      avatarUrl = foundUser?.avatar || `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.robloxUserId}&size=420x420&format=Png&isCircular=false`;
      console.log('/me using fresh avatar URL:', avatarUrl);
      
      // Update user with fresh avatar
      user.avatarUrl = avatarUrl;
      await user.save();
    } catch (error) {
      console.error('Error fetching avatar for /me:', error);
      avatarUrl = user.avatarUrl || `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.robloxUserId}&size=420x420&format=Png&isCircular=false`;
    }

    res.json({
      id: user._id.toString(),
      username: user.username,
      robloxUserId: user.robloxUserId,
      avatarUrl: avatarUrl
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
