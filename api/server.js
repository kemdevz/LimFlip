const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const USERS_FILE = path.join(__dirname, 'users.json');

// Random word generator for verification codes
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

function generateRandomWords(count = 10) {
  const selectedWords = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex]);
  }
  return selectedWords.join(' ');
}

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Online users tracking
let onlineUsers = 0;

// Verification codes storage (in-memory for development)
const verificationCodes = {};

// Mock Roblox users database
const mockRobloxUsers = [
  { username: 'RobloxDev', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'Builderman', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'NoobMaster', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'ProGamer123', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'CoolKid99', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'SpeedRunner', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'GameMaster', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'BlockBuilder', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'AdventureSeeker', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'PixelArtist', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'AmazingPlayer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'AwesomeGamer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'CoolBuilder', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'SuperDev', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
  { username: 'MegaPlayer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png' },
];

// Socket.io connection handling
io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('online-count', onlineUsers);
  console.log(`User connected. Online users: ${onlineUsers}`);

  // Handle chat messages
  socket.on('chat-message', (data) => {
    console.log('Chat message received:', data);
    // Broadcast the message to all connected clients
    io.emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('online-count', onlineUsers);
    console.log(`User disconnected. Online users: ${onlineUsers}`);
  });
});

// Helper functions for JSON storage
const readUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// Initialize with a test user if no users exist
const initializeTestUser = () => {
  const users = readUsers();
  if (users.length === 0) {
    console.log('No users found, creating test user...');
    const testUser = {
      id: '1',
      username: 'test',
      email: 'test@test.com',
      password: bcrypt.hashSync('test123', 10),
      createdAt: new Date().toISOString()
    };
    users.push(testUser);
    writeUsers(users);
    console.log('Test user created: username=test, password=test123');
  }
};

initializeTestUser();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bloxbashh API is running' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get online count endpoint
app.get('/online-count', (req, res) => {
  res.json({ count: onlineUsers });
});

// Roblox user search endpoint
app.get('/roblox/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 3) {
      return res.json([]);
    }

    console.log('Searching for:', q);

    // Call Roblox API to search for users
    const robloxApiUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(q)}&limit=10`;

    https.get(robloxApiUrl, (robloxRes) => {
      let data = '';

      robloxRes.on('data', (chunk) => {
        data += chunk;
      });

      robloxRes.on('end', () => {
        try {
          const robloxData = JSON.parse(data);
          console.log('Roblox API response:', JSON.stringify(robloxData, null, 2));
          
          // Check if API returned errors
          if (robloxData.errors && robloxData.errors.length > 0) {
            console.log('Roblox API returned errors, using fallback');
            const results = mockRobloxUsers.filter(user =>
              user.username.toLowerCase().includes(q.toLowerCase())
            );
            console.log('Using fallback mock data:', results);
            res.json(results);
            return;
          }
          
          // Get user IDs for thumbnail fetching
          const userIds = robloxData.data?.map(user => user.id) || [];
          
          if (userIds.length === 0) {
            res.json([]);
            return;
          }

          // Fetch thumbnails for all users
          const thumbnailUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=420x420&format=Png&isCircular=false`;
          
          https.get(thumbnailUrl, (thumbRes) => {
            let thumbData = '';
            
            thumbRes.on('data', (chunk) => {
              thumbData += chunk;
            });
            
            thumbRes.on('end', () => {
              try {
                const thumbJson = JSON.parse(thumbData);
                console.log('Thumbnail response:', JSON.stringify(thumbJson, null, 2));
                
                // Create a map of userId to imageUrl
                const thumbnailMap = {};
                thumbJson.data?.forEach(thumb => {
                  thumbnailMap[thumb.targetId] = thumb.imageUrl;
                });
                
                // Transform Roblox API response with actual thumbnail URLs
                const results = robloxData.data?.map(user => ({
                  username: user.name,
                  avatar: thumbnailMap[user.id] || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
                  id: user.id
                })) || [];

                console.log('Transformed results:', results);
                res.json(results);
              } catch (thumbError) {
                console.error('Error parsing thumbnail response:', thumbError);
                // Fallback to direct URLs if thumbnail parsing fails
                const results = robloxData.data?.map(user => ({
                  username: user.name,
                  avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
                  id: user.id
                })) || [];
                res.json(results);
              }
            });
          }).on('error', (thumbErr) => {
            console.error('Error fetching thumbnails:', thumbErr);
            // Fallback to direct URLs if thumbnail fetch fails
            const results = robloxData.data?.map(user => ({
              username: user.name,
              avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
              id: user.id
            })) || [];
            res.json(results);
          });

        } catch (parseError) {
          console.error('Error parsing Roblox API response:', parseError);
          res.json([]);
        }
      });
    }).on('error', (err) => {
      console.error('Error calling Roblox API:', err);
      // Fallback to mock data if API fails
      const results = mockRobloxUsers.filter(user =>
        user.username.toLowerCase().includes(q.toLowerCase())
      );
      console.log('Using fallback mock data:', results);
      res.json(results);
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Signup request received:', { username, email, password: '***' });

    if (!username || !email || !password) {
      console.log('Missing fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = readUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Generate token
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check username endpoint - uses Roblox API to verify username exists
app.post('/auth/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Use Roblox API to check if username exists
    const robloxApiUrl = 'https://users.roblox.com/v1/usernames/users';
    const postData = JSON.stringify({
      usernames: [username],
      excludeBannedUsers: false
    });

    const robloxReq = https.request(robloxApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (robloxRes) => {
      let data = '';

      robloxRes.on('data', (chunk) => {
        data += chunk;
      });

      robloxRes.on('end', () => {
        try {
          const robloxData = JSON.parse(data);
          
          // Check if user was found
          if (robloxData.data && robloxData.data.length > 0) {
            const foundUser = robloxData.data.find(u => u.name.toLowerCase() === username.toLowerCase());
            if (foundUser) {
              // Generate random verification words
              const verificationCode = generateRandomWords(10);
              verificationCodes[foundUser.id] = verificationCode;
              res.json({ exists: true, message: 'Username found', userId: foundUser.id, verificationCode });
            } else {
              res.status(404).json({ exists: false, message: 'Username not found' });
            }
          } else {
            res.status(404).json({ exists: false, message: 'Username not found' });
          }
        } catch (parseError) {
          console.error('Error parsing Roblox API response:', parseError);
          res.status(500).json({ error: 'Error checking username' });
        }
      });
    });

    robloxReq.on('error', (err) => {
      console.error('Error calling Roblox API:', err);
      res.status(500).json({ error: 'Error checking username' });
    });

    robloxReq.write(postData);
    robloxReq.end();
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { username, robloxUserId } = req.body;

    if (!username || !robloxUserId) {
      return res.status(400).json({ error: 'Username and Roblox ID are required' });
    }

    // Check if user exists in local database
    const users = readUsers();
    let user = users.find(u => u.username === username);

    // If user doesn't exist, create them
    if (!user) {
      user = {
        id: robloxUserId.toString(),
        username: username,
        email: `${username}@roblox.com`,
        password: '', // No password for Roblox auth
        robloxUserId: robloxUserId,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
      console.log(`Created new user: ${username} (Roblox ID: ${robloxUserId})`);
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username, robloxUserId: user.robloxUserId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        robloxUserId: user.robloxUserId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify description endpoint - verifies user updated their Roblox description
app.post('/auth/verify-description', async (req, res) => {
  try {
    const { username, robloxUserId } = req.body;

    if (!username || !robloxUserId) {
      return res.status(400).json({ error: 'Username and Roblox ID are required' });
    }

    console.log(`Verifying description for ${username} (Roblox ID: ${robloxUserId})`);

    // In production, this would verify the user's Roblox profile description
    // contains the verification code. The Roblox API doesn't provide access to
    // user descriptions, so this would need to be done through:
    // 1. A third-party scraping service (unreliable, may violate TOS)
    // 2. Manual verification by admin
    // 3. Alternative verification (e.g., joining a specific Roblox group)
    
    // For development, we simulate verification with a delay and random failure
    // to demonstrate the error handling flow
    const verificationCode = verificationCodes[robloxUserId] || generateRandomWords(10);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For development: 70% success rate to simulate real verification
    // In production, this would be an actual check
    const verificationSuccess = Math.random() > 0.3;
    
    if (!verificationSuccess) {
      console.log(`Verification failed for ${username} - description not updated or incorrect`);
      return res.status(400).json({
        error: 'Verification failed. Please make sure you updated your Roblox profile description with: ' + verificationCode
      });
    }
    
    console.log(`Verification successful for ${username}`);
    
    // Check if user exists in local database
    const users = readUsers();
    let user = users.find(u => u.username === username);

    // If user doesn't exist, create them
    if (!user) {
      user = {
        id: robloxUserId.toString(),
        username: username,
        email: `${username}@roblox.com`,
        password: '', // No password for Roblox auth
        robloxUserId: robloxUserId,
        verifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeUsers(users);
      console.log(`Created new user: ${username} (Roblox ID: ${robloxUserId})`);
    } else {
      // Update verification timestamp
      user.verifiedAt = new Date().toISOString();
      writeUsers(users);
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username, robloxUserId: user.robloxUserId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Verification successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        robloxUserId: user.robloxUserId
      }
    });
  } catch (error) {
    console.error('Verify description error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
