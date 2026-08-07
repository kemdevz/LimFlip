const mongoose = require('mongoose');

const cryptoTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  robloxUserId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['BTC', 'ETH', 'LTC', 'USDT', 'SOL'],
    required: true
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAW'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  txHash: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  network: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CryptoTransaction', cryptoTransactionSchema);
