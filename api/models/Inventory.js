const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true,
    ref: 'Item'
  },
  acquiredAt: {
    type: Date,
    default: Date.now
  }
});

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [inventoryItemSchema],
  totalValue: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update totalValue before saving
inventorySchema.pre('save', async function(next) {
  const Item = mongoose.model('Item');
  let totalValue = 0;
  
  for (const item of this.items) {
    const itemDef = await Item.findOne({ itemId: item.itemId });
    if (itemDef) {
      totalValue += itemDef.value;
    }
  }
  
  this.totalValue = totalValue;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
