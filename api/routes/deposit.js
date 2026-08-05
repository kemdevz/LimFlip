const express = require('express');
const router = express.Router();

// Get io instance from server (will be set by server.js)
let io;

const setIo = (socketIo) => {
  io = socketIo;
};

module.exports = { router, setIo };

// Generate deposit address using Apirone API
router.post('/generate-address', async (req, res) => {
  try {
    const { userId, currency } = req.body;
    
    if (!userId || !currency) {
      return res.status(400).json({ error: 'Missing required fields: userId and currency' });
    }

    // Get Apirone account ID from environment
    const apironeAccountId = process.env.APIRONE_ACCOUNT_ID;
    
    if (!apironeAccountId) {
      return res.status(500).json({ error: 'Apirone account ID not configured' });
    }

    // Supported currencies
    const supportedCurrencies = ['btc', 'ltc', 'bch', 'doge', 'trx', 'usdt@trx', 'usdc@trx', 'eth', 'usdt@eth', 'usdc@eth', 'bnb', 'usdt@bnb', 'usdc@bnb'];
    
    if (!supportedCurrencies.includes(currency.toLowerCase())) {
      return res.status(400).json({ error: `Unsupported currency. Supported: ${supportedCurrencies.join(', ')}` });
    }

    // Callback URL for payment notifications
    const callbackUrl = process.env.APIRONE_CALLBACK_URL || `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/deposit/callback`;

    // Call Apirone API to generate address
    const response = await fetch(`https://apirone.com/api/v2/accounts/${apironeAccountId}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: currency.toLowerCase(),
        callback: {
          method: 'POST',
          url: callbackUrl,
          data: {
            userId: userId,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate address');
    }

    console.log('Deposit address generated:', data);
    
    res.json({ 
      message: 'Deposit address generated successfully',
      address: data.address,
      currency: data.currency,
      account: data.account,
      created: data.created,
    });
  } catch (error) {
    console.error('Error generating deposit address:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Callback endpoint for Apirone payment notifications
router.post('/callback', async (req, res) => {
  try {
    const { address, currency, amount, confirmations, txid, userId } = req.body;
    
    console.log('Deposit callback received:', req.body);

    // Here you would:
    // 1. Verify the payment
    // 2. Update user balance in your database
    // 3. Emit socket event to notify frontend
    // 4. Send confirmation response to Apirone

    // Example: Update user balance (you'll need to implement this based on your user model)
    // const User = require('../models/User');
    // await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });

    // Emit socket event for real-time notification
    if (io) {
      io.emit('deposit-received', { 
        userId, 
        address, 
        currency, 
        amount, 
        confirmations, 
        txid 
      });
    }

    // Always respond with 'ok' to acknowledge the callback
    res.send('ok');
  } catch (error) {
    console.error('Error processing deposit callback:', error);
    // Still send 'ok' to prevent Apirone from retrying
    res.send('ok');
  }
});

// Get supported currencies
router.get('/currencies', (req, res) => {
  const supportedCurrencies = [
    { code: 'btc', name: 'Bitcoin' },
    { code: 'ltc', name: 'Litecoin' },
    { code: 'bch', name: 'Bitcoin Cash' },
    { code: 'doge', name: 'Dogecoin' },
    { code: 'trx', name: 'Tron' },
    { code: 'usdt@trx', name: 'USDT (Tron)' },
    { code: 'usdc@trx', name: 'USDC (Tron)' },
    { code: 'eth', name: 'Ethereum' },
    { code: 'usdt@eth', name: 'USDT (Ethereum)' },
    { code: 'usdc@eth', name: 'USDC (Ethereum)' },
    { code: 'bnb', name: 'BNB' },
    { code: 'usdt@bnb', name: 'USDT (BNB)' },
    { code: 'usdc@bnb', name: 'USDC (BNB)' },
  ];
  
  res.json({ currencies: supportedCurrencies });
});
