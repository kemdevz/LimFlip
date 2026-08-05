const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  robloxUserId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  items: [{
    uniqueId: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
