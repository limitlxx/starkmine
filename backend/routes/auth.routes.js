const express = require('express');
const router = express.Router();
const tokenService = require('../middleware/auth'); // Import your token service

router.post('/', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const token = await tokenService.generateToken(walletAddress); 

    res.status(200).json({ token }); 
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' }); 
  }
});

module.exports = router;