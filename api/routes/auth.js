const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { checkUsernameExists, searchRobloxUsers, getUserDescription } = require('../utils/roblox');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Fetch Roblox avatar directly from thumbnails API (same approach as bloxpvp)
async function getRobloxAvatar(robloxId) {
  try {
    const res = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=420x420&format=Png&isCircular=false`
    );
    const data = await res.json();
    return data?.data?.[0]?.imageUrl || `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxId}&width=420&height=420&format=png`;
  } catch (error) {
    console.error('Failed to fetch Roblox avatar:', error.message);
    return `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxId}&width=420&height=420&format=png`;
  }
}

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
      const verificationToken = jwt.sign({
        purpose: 'roblox-bio-verification',
        robloxUserId: String(result.userId),
        verificationCode
      }, JWT_SECRET, { expiresIn: '15m' });
      res.json({
        exists: true,
        message: 'Username found',
        userId: result.userId,
        verificationCode,
        verificationToken
      });
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

    // Always fetch fresh avatar URL from Roblox directly (no noblox)
    let avatarUrl;
    try {
      avatarUrl = await getRobloxAvatar(robloxUserId);
      console.log('Login using direct Roblox avatar URL:', avatarUrl);
    } catch (error) {
      console.error('Error fetching avatar:', error);
      avatarUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxUserId}&width=420&height=420&format=png`;
    }

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
    const { username, robloxUserId, verificationToken } = req.body;

    if (!username || !robloxUserId) {
      return res.status(400).json({ error: 'Username and Roblox ID are required' });
    }

    if (!/^\d+$/.test(String(robloxUserId))) {
      return res.status(400).json({ error: 'A valid Roblox ID is required' });
    }

    const profileUrl = `https://www.roblox.com/users/${robloxUserId}/profile`;

    console.log(`Verifying description for ${username} (Roblox ID: ${robloxUserId})`);

    let verificationCode = verificationCodes[robloxUserId];

    if (verificationToken) {
      try {
        const challenge = jwt.verify(verificationToken, JWT_SECRET);
        if (
          challenge.purpose !== 'roblox-bio-verification' ||
          challenge.robloxUserId !== String(robloxUserId) ||
          !challenge.verificationCode
        ) {
          throw new Error('Invalid verification challenge');
        }
        verificationCode = challenge.verificationCode;
      } catch (error) {
        return res.status(400).json({
          error: 'Your verification session expired. Please restart verification to get a new code.',
          profileUrl
        });
      }
    }

    if (!verificationCode) {
      return res.status(400).json({
        error: 'Your verification session expired. Please restart verification to get a new code.',
        profileUrl
      });
    }
    
    // Fetch actual user description from Roblox
    let userDescription = '';
    try {
      const { description } = await getUserDescription(robloxUserId);
      userDescription = description || '';
      console.log(`Fetched user description: "${userDescription}"`);
    } catch (error) {
      console.error('Error fetching user description:', error);
      return res.status(502).json({
        error: 'Failed to fetch Roblox profile description. Open your public profile and try again.',
        profileUrl
      });
    }
    
    // Check if verification code is in the description
    if (!userDescription.includes(verificationCode)) {
      return res.status(400).json({
        error: 'Verification failed. Please add this code to your Roblox profile description: ' + verificationCode,
        profileUrl
      });
    }

    delete verificationCodes[robloxUserId];
    
    let user = await User.findOne({ username });

    if (!user) {
      const avatarUrl = await getRobloxAvatar(robloxUserId);
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
        const avatarUrl = await getRobloxAvatar(robloxUserId);
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

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      username: user.username,
      balance: user.balance || 0
    });
  } catch (error) {
    console.error('Error fetching user:', error);
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

    // Fetch fresh avatar URL from Roblox
    let avatarUrl = user.avatarUrl;
    if (user.robloxUserId) {
      try {
        avatarUrl = await getRobloxAvatar(user.robloxUserId);
        // Update cached avatar if it changed
        if (avatarUrl !== user.avatarUrl) {
          user.avatarUrl = avatarUrl;
          await user.save();
        }
      } catch (e) {
        // Fall back to cached avatar
        avatarUrl = user.avatarUrl || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.robloxUserId}&width=420&height=420&format=png`;
      }
    }

    res.json({
      id: user._id.toString(),
      username: user.username,
      robloxUserId: user.robloxUserId,
      avatarUrl: avatarUrl,
      balance: user.balance || 0,
      role: user.role || 'User'
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Reward user for Discord invite
router.post('/reward-invite', async (req, res) => {
  try {
    const { discord_id, amount } = req.body;

    if (!discord_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user by Discord ID (you'll need to add discordId field to User schema)
    const user = await User.findOne({ discordId: discord_id });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this Discord ID' });
    }

    // Update user balance
    user.balance = (user.balance || 0) + amount;
    await user.save();

    console.log(`Rewarded user ${user.username} with $${amount} for Discord invite`);

    res.json({
      success: true,
      newBalance: user.balance,
      reward: amount
    });
  } catch (error) {
    console.error('Reward invite error:', error);
    res.status(500).json({ error: 'Failed to reward user' });
  }
});

// Link Discord account to user
router.post('/link-discord', async (req, res) => {
  try {
    const { discord_id, username } = req.body;

    if (!discord_id || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user with Discord ID
    user.discordId = discord_id;
    await user.save();

    console.log(`Linked Discord ID ${discord_id} to user ${username}`);

    res.json({
      success: true,
      message: 'Discord account linked successfully'
    });
  } catch (error) {
    console.error('Link Discord error:', error);
    res.status(500).json({ error: 'Failed to link Discord account' });
  }
});

// Change user role (admin only)
router.post('/change-role', async (req, res) => {
  try {
    const { targetUserId, newRole, adminUserId } = req.body;

    if (!targetUserId || !newRole || !adminUserId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate role
    const validRoles = ['User', 'Moderator', 'Owner'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if admin user is Owner
    const adminUser = await User.findById(adminUserId);
    if (!adminUser || adminUser.role !== 'Owner') {
      return res.status(403).json({ error: 'Only Owner can change roles' });
    }

    // Find target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Update user role
    targetUser.role = newRole;
    await targetUser.save();

    console.log(`Changed role of user ${targetUser.username} to ${newRole} by ${adminUser.username}`);

    res.json({
      success: true,
      message: `User role changed to ${newRole}`,
      username: targetUser.username,
      newRole: targetUser.role
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ error: 'Failed to change user role' });
  }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch fresh avatar URL from Roblox
    let avatarUrl = user.avatarUrl;
    if (user.robloxUserId) {
      try {
        avatarUrl = await getRobloxAvatar(user.robloxUserId);
        if (avatarUrl !== user.avatarUrl) {
          user.avatarUrl = avatarUrl;
          await user.save();
        }
      } catch (e) {
        avatarUrl = user.avatarUrl || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.robloxUserId}&width=420&height=420&format=png`;
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        robloxUserId: user.robloxUserId,
        avatarUrl: avatarUrl,
        balance: user.balance || 0,
        role: user.role || 'User',
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
