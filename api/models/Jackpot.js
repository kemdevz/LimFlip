const mongoose = require('mongoose');

const jackpotEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  items: [{
    uniqueId: {
      type: String,
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    rarity: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }],
  totalValue: {
    type: Number,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const jackpotSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'refunded'],
    default: 'waiting'
  },
  entries: [jackpotEntrySchema],
  totalValue: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  winningPercentage: {
    type: Number
  },
  timerEndsAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total value before saving
jackpotSchema.pre('save', function(next) {
  if (this.entries) {
    this.totalValue = this.entries.reduce((sum, entry) => sum + entry.totalValue, 0);
  }
  next();
});

jackpotSchema.index({ status: 1, createdAt: -1 });
jackpotSchema.index({ completedAt: -1 });

module.exports = mongoose.model('Jackpot', jackpotSchema);
