const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User'); // Assuming User model exists
const auth = require('../middleware/auth'); // We need to check/create this middleware

// Middleware to check auth (if not already existing, I'll assume simple token check or similar)
// For now, let's assume standard simple JWT verification needed. 
// I'll check auth.js middleware in a moment, but writing standard route structure first.

// GET /api/skills - Public feed of all skills (with user details)
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().populate('user', 'name email profileImage').sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/skills/me - My skills
router.get('/me', async (req, res) => {
    // Assuming req.user is set by auth middleware
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    try {
        const skills = await Skill.find({ user: req.user.id });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/skills - Add a skill
router.post('/', async (req, res) => {
    if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
    const { title, category, level, desc } = req.body;
    try {
        const newSkill = new Skill({
            user: req.user.id,
            title,
            category,
            level,
            desc
        });
        const skill = await newSkill.save();
        res.json(skill);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
