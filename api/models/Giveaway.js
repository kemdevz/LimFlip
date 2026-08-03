const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    itemId: String,
    name: String,
    image: String,
    rarity: String,
    value: Number,
    category: String
  }],
  totalValue: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  endsAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Giveaway', giveawaySchema);
