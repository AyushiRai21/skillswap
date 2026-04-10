const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * GET /api/match
 * Finds "Perfect Matches" (Users who teach what I want AND want what I teach)
 */
router.get('/', auth, async (req, res) => {
    try {
        const me = await User.findById(req.user.id);
        if (!me) {
            console.error("Match Engine: User not found for ID", req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("Match Engine: User found", me.name, "Interests:", me.skillsInterestedIn);

        const myInterests = me.skillsInterestedIn || [];
        const myOffers = me.skillsOffered || [];

        if (myInterests.length === 0) {
            return res.json({ perfect: [], partial: [], message: 'Add interests to your profile to find matches!' });
        }

        // Find users who offer what I am interested in
        // AND want what I offer
        const perfectMatches = await User.find({
            _id: { $ne: me._id },
            skillsOffered: { $in: myInterests },
            skillsInterestedIn: { $in: myOffers }
        }).select('name email profileImage bio skillsOffered skillsInterestedIn level');

        // Find "I want" matches (one-way)
        const partialMatches = await User.find({
            _id: { $ne: me._id },
            skillsOffered: { $in: myInterests },
            skillsInterestedIn: { $nin: myOffers }
        }).select('name email profileImage bio skillsOffered skillsInterestedIn level');

        res.json({
            perfect: perfectMatches,
            partial: partialMatches
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
