const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 75
  },
  avatarUrl: {
    type: String,
    default: '/assets/images/coinflip/item_1side.png'
  },
  isWhale: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for sorting by creation time
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
