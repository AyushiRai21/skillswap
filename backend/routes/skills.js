const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { addPoints } = require('../utils/gamification');

// GET /api/skills - List all skills
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().populate('user', 'name email profileImage').sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// POST /api/skills - Create a new skill
router.post('/', auth, async (req, res) => {
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

        // Award points for offering a skill
        const user = await User.findById(req.user.id);
        if (user) {
            await addPoints(user, 20); // 20 points per skill listed
            if (!user.skillsOffered.includes(title)) {
                user.skillsOffered.push(title);
                await user.save();
            }
        }

        res.json(skill);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET /api/skills/me - List my skills
router.get('/me', auth, async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(skills);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
