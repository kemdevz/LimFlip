const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  inventoryItemUniqueId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled'],
    default: 'active'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  soldAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
marketplaceSchema.index({ status: 1, createdAt: -1 });
marketplaceSchema.index({ seller: 1 });
marketplaceSchema.index({ item: 1 });

module.exports = mongoose.model('Marketplace', marketplaceSchema);
