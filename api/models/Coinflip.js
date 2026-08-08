const mongoose = require('mongoose');

const coinflipSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joiner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  creatorItems: [{
    itemId: String,
    name: String,
    image: String,
    rarity: String,
    value: Number,
    category: String
  }],
  joinerItems: [{
    itemId: String,
    name: String,
    image: String,
    rarity: String,
    value: Number,
    category: String
  }],
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
  isBalanceBased: {
    type: Boolean,
    default: false
  },
  creatorBetAmount: {
    type: Number,
    default: 0
  },
  joinerBetAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'cancelled'],
    default: 'waiting'
  },
  selectedCoin: {
    type: String,
    enum: ['heads', 'tails'],
    default: 'heads'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  result: {
    type: String,
    enum: ['heads', 'tails'],
    default: null
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

module.exports = mongoose.model('Coinflip', coinflipSchema);
