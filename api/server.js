const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const robloxRoutes = require('./routes/roblox');
const { router: inventoryRoutes, setIo: setInventoryIo } = require('./routes/inventory');
const { router: coinflipRoutes, setIo: setCoinflipIo } = require('./routes/coinflip');
const { router: jackpotRoutes, setIo: setJackpotIo } = require('./routes/jackpot');
const { router: trackTimerRoutes, setIo } = require('./routes/trackTimer');
const userStatsRoutes = require('./routes/userStats');

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
setIo(io);

let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('online-count', onlineUsers);
  console.log(`User connected. Online users: ${onlineUsers}`);

  socket.on('chat-message', (data) => {
    console.log('Chat message received:', data);
    
    if (!data.message || data.message.length > 75) {
      console.log('Message rejected: exceeds 75 character limit');
      return;
    }
    
    io.emit('chat-message', data);
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
