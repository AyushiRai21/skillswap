const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // send welcome email
    try {
      if (mailer) {
        await mailer.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'Welcome to SkillSwap',
          html: `<p>Hi ${user.name || ''},</p><p>Your account was created successfully.</p>`,
        });
      }
    } catch (e) { console.error('Failed to send welcome email', e); }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // send login notification
    try {
      if (mailer) {
        await mailer.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'New login to SkillSwap',
          html: `<p>Hi ${user.name || ''},</p><p>Your account was just signed in. If this wasn't you, reset your password.</p>`,
        });
      }
    } catch (e) { console.error('Failed to send login email', e); }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profileImage: user.profileImage } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected: get current user
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
    const token = auth.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });

    let payload;
    try { payload = jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }

    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// update profile (requires Authorization header)
router.put('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
    const token = auth.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });
    let payload;
    try { payload = jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }

    const { name, bio, profileImage } = req.body;
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profileImage: user.profileImage } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
