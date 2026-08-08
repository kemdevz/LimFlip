const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: ''
  },
  robloxUserId: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 0
  },
  discordId: {
    type: String,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['User', 'Moderator', 'Owner'],
    default: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
