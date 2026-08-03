require('dotenv').config({ path: './api/.env' });
const mongoose = require('mongoose');
const Coinflip = require('../models/Coinflip');
const Inventory = require('../models/Inventory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll';

async function deleteRandomCoinflips() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all waiting games
    const games = await Coinflip.find({ status: 'waiting' });
    console.log(`Found ${games.length} waiting games`);

    if (games.length === 0) {
      console.log('No waiting games to delete');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Select 3 random games
    const numToDelete = Math.min(3, games.length);
    const shuffled = games.sort(() => 0.5 - Math.random());
    const gamesToDelete = shuffled.slice(0, numToDelete);

    console.log(`Deleting ${numToDelete} random games...`);

    for (const game of gamesToDelete) {
      console.log(`Processing game ${game._id} by creator ${game.creator}`);

      // Get creator ID (handle both string and object cases)
      const creatorId = typeof game.creator === 'object' ? game.creator._id : game.creator;

      // Return items to creator's inventory
      let inventory = await Inventory.findOne({ userId: creatorId });
      
      if (!inventory) {
        inventory = new Inventory({
          userId: creatorId,
          items: []
        });
      }

      // Add items back to inventory
      game.items.forEach(item => {
        inventory.items.push({
          itemId: item.itemId,
          name: item.name,
          image: item.image,
          value: item.value
        });
      });

      await inventory.save();
      console.log(`Returned ${game.items.length} items to inventory of ${creatorId}`);

      // Delete the game
      await Coinflip.findByIdAndDelete(game._id);
      console.log(`Deleted game ${game._id}`);
    }

    console.log('Successfully deleted random games and refunded items');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

deleteRandomCoinflips();
