# Bloxbashh API

A modular Express.js API for Bloxbashh with MongoDB integration and Roblox API support.

## Project Structure

```
api/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   └── User.js              # User mongoose model
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── roblox.js            # Roblox API integration
│   └── trackTimer.js        # Track timer game endpoints
├── utils/
│   └── roblox.js            # Roblox API utilities
├── server.js                # Main server entry point
├── package.json            # Dependencies
└── .env.example            # Environment variables template
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=3001
MONGODB_URI=mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

3. Start MongoDB (if using local instance):
```bash
mongod
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login with Roblox credentials
- `POST /auth/check-username` - Check if Roblox username exists
- `POST /auth/verify-description` - Verify Roblox profile description

### Roblox Integration
- `GET /roblox/search?q={query}` - Search for Roblox users

### Track Timer Game
- `POST /track-timer/start` - Start reaction timer
- `POST /track-timer/finish` - Finish reaction timer
- `POST /track-timer/reset` - Reset timer
- `GET /track-timer/status` - Get timer status

### General
- `GET /` - API health check
- `GET /health` - Health status
- `GET /online-count` - Get current online user count

## Socket.io Events

### Client to Server
- `chat-message` - Send chat message

### Server to Client
- `online-count` - Broadcast online user count
- `chat-message` - Broadcast chat messages
- `track-timer` - Track timer game events

## Features

- **MongoDB Integration**: Persistent user data storage
- **Roblox API**: Real username verification and user search
- **Socket.io**: Real-time chat and game events
- **JWT Authentication**: Secure token-based auth
- **Modular Structure**: Organized, maintainable codebase
- **Environment Configuration**: Flexible deployment options

## Development Notes

- The Roblox API has rate limits, so the implementation includes fallback mock data
- User verification currently simulates description checking (70% success rate)
- In production, implement proper Roblox profile verification through alternative methods
