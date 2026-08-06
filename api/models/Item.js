const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  assetId: {
    type: String,
    default: ''
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'legendary', 'mythic'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'weapon'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
