const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /leaderboard - Get top users sorted by karma and completedSwaps
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find()
            .select('name email profileImage karma completedSwaps')
            .sort({ karma: -1, completedSwaps: -1 })
            .limit(10);

        res.json(topUsers);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
