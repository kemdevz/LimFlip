const express = require('express');
const router = express.Router();
const CryptoTransaction = require('../models/CryptoTransaction');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Apirone API Configuration
const APIRONE_ACCOUNT = process.env.APIRONE_ACCOUNT || 'apr-c152d8021520acff10f96289c8e72206';
const APIRONE_ACCOUNT_KEY = process.env.APIRONE_ACCOUNT_KEY || 'Qkp54kMdK1UZR5lJdOLbWWq5w2zDq31V';
const APIRONE_BASE_URL = 'https://apirone.com/api/v2';

// Supported cryptocurrencies by Apirone
const SUPPORTED_CURRENCIES = {
  btc: 'bitcoin',
  eth: 'ethereum',
  ltc: 'litecoin',
  usdt: 'tether'
};

// Helper function to make Apirone API requests
const apironeRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Account': APIRONE_ACCOUNT,
        'X-Account-Key': APIRONE_ACCOUNT_KEY
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${APIRONE_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Apirone API error');
    }

    return data;
  } catch (error) {
    console.error('Apirone API request error:', error);
    throw error;
  }
};

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

// Get withdrawal address from Apirone
router.post('/withdraw/address', authenticateToken, async (req, res) => {
  try {
    const { currency } = req.body;

    if (!currency || !SUPPORTED_CURRENCIES[currency.toLowerCase()]) {
      return res.status(400).json({ 
        error: 'Invalid or unsupported currency',
        supported: Object.keys(SUPPORTED_CURRENCIES)
      });
    }

    const currencyCode = currency.toLowerCase();
    
    // Generate a unique address for withdrawal using Apirone
    try {
      const addressData = await apironeRequest(`/wallets/${currencyCode}/addresses`, 'POST', {
        label: `withdrawal_${req.userId}_${Date.now()}`
      });

      res.json({
        success: true,
        address: addressData.address,
        currency: currencyCode
      });
    } catch (error) {
      console.error('Error generating withdrawal address:', error);
      return res.status(500).json({ error: 'Failed to generate withdrawal address' });
    }
  } catch (error) {
    console.error('Get withdrawal address error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create withdrawal request using Apirone
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, address } = req.body;
    const userId = req.userId;

    if (!amount || !currency || !address) {
      return res.status(400).json({ error: 'Missing required fields: amount, currency, address' });
    }

    if (!SUPPORTED_CURRENCIES[currency.toLowerCase()]) {
      return res.status(400).json({ 
        error: 'Invalid or unsupported currency',
        supported: Object.keys(SUPPORTED_CURRENCIES)
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const currencyCode = currency.toLowerCase();

    // Create withdrawal transaction record
    const transaction = new CryptoTransaction({
      userId,
      robloxUserId: user.robloxUserId,
      username: user.username,
      amount,
      currency: currencyCode,
      type: 'withdrawal',
      status: 'Pending',
      address,
      network: SUPPORTED_CURRENCIES[currencyCode]
    });

    await transaction.save();

    // Deduct from user balance
    user.balance -= amount;
    await user.save();

    // Process withdrawal through Apirone
    try {
      const withdrawalData = await apironeRequest(`/wallets/${currencyCode}/withdrawals`, 'POST', {
        address,
        amount: amount.toString(),
        currency: currencyCode.toUpperCase(),
        label: `withdrawal_${user.username}_${Date.now()}`
      });

      // Update transaction with Apirone response
      transaction.txHash = withdrawalData.txid || withdrawalData.id || '';
      transaction.status = 'Processing';
      await transaction.save();

      res.json({
        success: true,
        message: 'Withdrawal initiated',
        transaction: {
          id: transaction._id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          txHash: transaction.txHash,
          address: transaction.address
        }
      });
    } catch (error) {
      console.error('Apirone withdrawal error:', error);
      
      // Revert balance if withdrawal failed
      user.balance += amount;
      await user.save();

      transaction.status = 'Failed';
      await transaction.save();

      return res.status(500).json({ error: 'Failed to process withdrawal through Apirone' });
    }
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check withdrawal status
router.get('/withdraw/status/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await CryptoTransaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check status with Apirone if transaction is still processing
    if (transaction.status === 'Processing' && transaction.txHash) {
      try {
        const currencyCode = transaction.currency.toLowerCase();
        const statusData = await apironeRequest(`/wallets/${currencyCode}/withdrawals/${transaction.txHash}`);
        
        if (statusData.status === 'completed' || statusData.status === 'confirmed') {
          transaction.status = 'Completed';
          await transaction.save();
        } else if (statusData.status === 'failed' || statusData.status === 'cancelled') {
          transaction.status = 'Failed';
          await transaction.save();
        }
      } catch (error) {
        console.error('Error checking withdrawal status:', error);
      }
    }

    res.json({
      id: transaction._id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      txHash: transaction.txHash,
      address: transaction.address,
      createdAt: transaction.createdAt
    });
  } catch (error) {
    console.error('Check withdrawal status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supported currencies
router.get('/currencies', (req, res) => {
  res.json({
    supported: Object.keys(SUPPORTED_CURRENCIES),
    details: SUPPORTED_CURRENCIES
  });
});

module.exports = router;
