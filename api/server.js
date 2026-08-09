const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');
const robloxRoutes = require('./routes/roblox');
const { router: inventoryRoutes, setIo: setInventoryIo } = require('./routes/inventory');
const { router: coinflipRoutes, setIo: setCoinflipIo } = require('./routes/coinflip');
const { router: jackpotRoutes, setIo: setJackpotIo } = require('./routes/jackpot');
const { router: trackTimerRoutes, setIo: setTrackTimerIo } = require('./routes/trackTimer');
const userStatsRoutes = require('./routes/userStats');
const { router: marketplaceRoutes, setIo: setMarketplaceIo } = require('./routes/marketplace');
const { router: mm2Routes, setIo: setMm2Io } = require('./routes/mm2');
const { router: depositRoutes, setIo: setDepositIo } = require('./routes/deposit');
const { router: giveawayRoutes, setIo: setGiveawayIo, startGiveawayChecker } = require('./routes/giveaway');
const messagesRoutes = require('./routes/messages');
const cryptoRoutes = require('./routes/crypto');
const { router: upgraderRoutes, setIo: setUpgraderIo } = require('./routes/upgrader');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setInventoryIo(io);
setCoinflipIo(io);
setJackpotIo(io);
setTrackTimerIo(io);
setMm2Io(io);
setMarketplaceIo(io);
setDepositIo(io);
setGiveawayIo(io);
setUpgraderIo(io);

// Start giveaway checker
startGiveawayChecker();

let onlineUsers = 9; // Start with 9 fake online users

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('online-count', onlineUsers);
  console.log(`User connected. Online users: ${onlineUsers}`);

  socket.on('chat-message', async (data) => {
    console.log('Chat message received:', data);
    
    // Verify authentication token
    const token = data.token;
    if (!token) {
      console.log('Message rejected: no token provided');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.userId) {
        console.log('Message rejected: invalid token');
        return;
      }
    } catch (error) {
      console.log('Message rejected: token verification failed', error);
      return;
    }
    
    if (!data.message || data.message.length > 75) {
      console.log('Message rejected: exceeds 75 character limit');
      return;
    }

    try {
      // Save message to MongoDB
      const newMessage = new Message({
        username: data.username,
        message: data.message,
        avatarUrl: data.avatarUrl || '/assets/images/coinflip/item_1side.png',
        isWhale: data.isWhale || false
      });

      await newMessage.save();

      // Format message for frontend
      const formattedMessage = {
        username: newMessage.username,
        message: newMessage.message,
        time: new Date(newMessage.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
        avatarUrl: newMessage.avatarUrl,
        isWhale: newMessage.isWhale
      };

      // Broadcast to all clients
      io.emit('chat-message', formattedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      // Still emit the message even if save fails
      io.emit('chat-message', data);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('online-count', onlineUsers);
    console.log(`User disconnected. Online users: ${onlineUsers}`);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Bloxbashh API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/online-count', (req, res) => {
  res.json({ count: onlineUsers });
});

app.use('/auth', authRoutes);
app.use('/roblox', robloxRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/coinflip', coinflipRoutes);
app.use('/jackpot', jackpotRoutes);
app.use('/track-timer', trackTimerRoutes);
app.use('/user', userStatsRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/mm2', mm2Routes);
app.use('/deposit', depositRoutes);
app.use('/giveaway', giveawayRoutes);
app.use('/messages', messagesRoutes);
app.use('/crypto', cryptoRoutes);
app.use('/upgrader', upgraderRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
