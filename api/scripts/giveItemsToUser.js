require('dotenv').config({ path: './api/.env' });
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function giveItemsToUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // User ID for Redbet_holder (you may need to find this from the User collection)
    const userId = 'REDBET_HOLDER_USER_ID'; // Replace with actual user ID

    // Items to give
    const itemsToAdd = [
      {
        itemId: 'item_1',
        name: 'Item 1',
        image: '/assets/images/items/item_1.png',
        value: 43.8
      },
      {
        itemId: 'item_2', 
        name: 'Item 2',
        image: '/assets/images/items/item_2.png',
        value: 43.8
      },
      // Add more items as needed
    ];

    // Find or create inventory
    let inventory = await Inventory.findOne({ userId });
    
    if (!inventory) {
      inventory = new Inventory({
        userId,
        items: []
      });
    }

    // Add items to inventory
    itemsToAdd.forEach(item => {
      inventory.items.push(item);
    });

    await inventory.save();
    console.log(`Successfully added ${itemsToAdd.length} items to user ${userId}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// First, let's find the user ID by username
async function findUserIdByUsername() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('../models/User');
    const user = await User.findOne({ username: 'Redbet_holder' });
    
    if (user) {
      console.log(`Found user: ${user.username} with ID: ${user._id}`);
      
      // Now give items to this user
      const userId = user._id;
      
      const itemsToAdd = [
        {
          itemId: 'item_1',
          name: 'Item 1',
          image: '/assets/images/items/item_1.png',
          value: 43.8
        },
        {
          itemId: 'item_2',
          name: 'Item 2', 
          image: '/assets/images/items/item_2.png',
          value: 43.8
        },
      ];

      let inventory = await Inventory.findOne({ userId });
      
      if (!inventory) {
        inventory = new Inventory({
          userId,
          items: []
        });
      }

      itemsToAdd.forEach(item => {
        inventory.items.push(item);
      });

      await inventory.save();
      console.log(`Successfully added ${itemsToAdd.length} items to user ${user.username}`);
    } else {
      console.log('User Redbet_holder not found');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

findUserIdByUsername();
