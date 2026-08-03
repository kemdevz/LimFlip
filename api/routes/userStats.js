const express = require('express');
const router = express.Router();
const Coinflip = require('../models/Coinflip');
const User = require('../models/User');

// Get user game history and profit data
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find completed games where user participated
    const completedGames = await Coinflip.find({
      status: 'completed',
      $or: [
        { creator: userId },
        { joiner: userId }
      ]
    }).sort({ createdAt: -1 }).limit(100);
    
    // Calculate statistics
    let totalProfit = 0;
    let totalBet = 0;
    let totalWon = 0;
    let gamesWon = 0;
    let gamesLost = 0;
    
    const profitHistory = [];
    let cumulativeProfit = 0;
    
    completedGames.forEach(game => {
      const isCreator = game.creator.toString() === userId;
      const isWinner = game.winner.toString() === userId;
      
      // Calculate bet amount based on user's items
      const userItems = isCreator ? game.creatorItems : game.joinerItems;
      const betAmount = userItems.reduce((sum, item) => sum + item.value, 0);
      
      totalBet += betAmount;
      
      if (isWinner) {
        const profit = game.totalValue - betAmount;
        totalWon += game.totalValue;
        totalProfit += profit;
        gamesWon++;
        cumulativeProfit += profit;
      } else {
        const profit = -betAmount;
        totalProfit += profit;
        gamesLost++;
        cumulativeProfit += profit;
      }
      
      // Add to profit history (reverse order for chronological display)
      profitHistory.unshift({
        date: new Date(game.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        profit: cumulativeProfit,
        gameId: game._id.toString(),
        gameType: 'coinflip',
        betAmount,
        isWinner,
        totalValue: game.totalValue
      });
    });
    
    // Get user join date
    const user = await User.findById(userId);
    const joinDate = user ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
    
    res.json({
      totalProfit,
      totalBet,
      totalWon,
      gamesWon,
      gamesLost,
      totalGames: completedGames.length,
      joinDate,
      profitHistory
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

module.exports = router;
