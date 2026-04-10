const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User'); // if we need to check existence
const auth = require('../middleware/auth'); // Ensure we have auth middleware

// Middleware placeholder if 'auth' file not found perfectly, assuming standard check
// But commonly we already use a token check in other files. 
// I will assume the user sends Authorization header.

// GET /api/reviews/user/:userId - Get reviews for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name profileImage') // Show who Reviewer was
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/reviews - Add a review
router.post('/', async (req, res) => {
    // Requires Auth header handling manually or via middleware. 
    // For consistency with other files I see (e.g. skills.js), I'll do manual token check or assume middleware usage.
    // Ideally, I should reuse the logic from `auth.js` or `skills.js`.

    // Let's implement a quick token extraction since I don't have a shared middleware file explicitly visible in previous contexts (though `skills.js` referenced it).
    // Actually, I saw `routes/skills.js` using `req.user.id` but `routes/auth.js` does manual verification.
    // I will do manual verification for safety as seen in `auth.js` /me route.

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];

    let userId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const { revieweeId, rating, comment } = req.body;

        if (!revieweeId || !rating) return res.status(400).json({ error: 'Missing fields' });
        if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
        if (revieweeId === userId) return res.status(400).json({ error: 'Cannot review yourself' });

        const review = new Review({
            reviewer: userId,
            reviewee: revieweeId,
            rating,
            comment
        });

        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
