const express = require('express');
const { searchRobloxUsers } = require('../utils/roblox');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 3) {
      return res.json([]);
    }

    console.log('Searching for:', q);
    const results = await searchRobloxUsers(q);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
