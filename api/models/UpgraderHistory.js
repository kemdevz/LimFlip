const mongoose = require('mongoose');

const upgraderHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  inputItems: [{
    uniqueId: String,
    itemId: String,
    name: String,
    image: String,
    value: Number
  }],
  outputItem: {
    uniqueId: String,
    itemId: String,
    name: String,
    image: String,
    value: Number
  },
  inputValue: {
    type: Number,
    required: true
  },
  outputValue: {
    type: Number,
    required: true
  },
  winChance: {
    type: Number,
    required: true
  },
  won: {
    type: Boolean,
    required: true
  },
  multiplier: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UpgraderHistory', upgraderHistorySchema);
