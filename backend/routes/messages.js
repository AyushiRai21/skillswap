const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User'); // Required to find the sender doc
const auth = require('../middleware/auth');
const { addPoints } = require('../utils/gamification');

// ... (GET route remains same)

// POST /api/messages - Send a message
router.post('/', auth, async (req, res) => {
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    const { recipientId, content } = req.body;
    try {
        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content
        });
        const saved = await newMessage.save();

        // Award points for engagement
        const sender = await User.findById(req.user.id);
        if (sender) {
            await addPoints(sender, 5); // 5 points per message
        }

        // Populate simply for return
        const populated = await Message.findById(saved._id).populate('sender', 'name').populate('recipient', 'name');
        res.json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
