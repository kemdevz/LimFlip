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

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
