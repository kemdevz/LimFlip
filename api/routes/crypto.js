const express = require('express');
const router = express.Router();
const CryptoTransaction = require('../models/CryptoTransaction');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get crypto transactions for a user
router.get('/transactions/:currency?', authenticateToken, async (req, res) => {
  try {
    const { currency } = req.params;
    const userId = req.userId;

    const query = { userId };
    if (currency) {
      query.currency = currency;
    }

    const transactions = await CryptoTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedTransactions = transactions.map(tx => ({
      amount: tx.amount.toLocaleString(),
      date: new Date(tx.createdAt).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', ''),
      currency: tx.currency,
      type: tx.type,
      status: tx.status
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error('Get crypto transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a crypto transaction (for admin/internal use)
router.post('/transaction', async (req, res) => {
  try {
    const { userId, robloxUserId, username, amount, currency, type, status, txHash, address, network } = req.body;

    const transaction = new CryptoTransaction({
      userId,
      robloxUserId,
      username,
      amount,
      currency,
      type,
      status: status || 'Pending',
      txHash: txHash || '',
      address,
      network: network || ''
    });

    await transaction.save();

    res.json({
      message: 'Crypto transaction created',
      transaction
    });
  } catch (error) {
    console.error('Create crypto transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction status (for admin/internal use)
router.put('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, txHash } = req.body;

    const transaction = await CryptoTransaction.findByIdAndUpdate(
      id,
      { status, txHash },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      message: 'Transaction updated',
      transaction
    });
  } catch (error) {
    console.error('Update crypto transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
