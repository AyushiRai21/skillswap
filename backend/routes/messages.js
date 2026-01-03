const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/messages - Get my conversation with a specific user or all/recent
// For simplicity, let's just get all messages involving me
router.get('/', async (req, res) => {
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        })
            .populate('sender', 'name email')
            .populate('recipient', 'name email')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/messages - Send a message
router.post('/', async (req, res) => {
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    const { recipientId, content } = req.body;
    try {
        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content
        });
        const saved = await newMessage.save();
        // Populate simply for return
        const populated = await Message.findById(saved._id).populate('sender', 'name').populate('recipient', 'name');
        res.json(populated);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
