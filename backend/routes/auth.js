const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const { mailer, sendMailWithFallback } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, otp } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Name, email, and password required' });
    if (!otp) return res.status(400).json({ message: 'OTP is required to register' });

    let user = await User.findOne({ email });
    
    // Check if user already exists and is fully registered
    if (user && user.name) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Verify OTP
    if (!user || user.emailOtp !== otp || user.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Update existing shell user or create new (though send-otp currently creates a shell)
    user.name = name;
    // user.username = username; // User schema might not have username
    user.password = hashed;
    user.verificationToken = verificationToken;
    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // send welcome / verification email
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    await sendMailWithFallback({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: 'Verify your SkillSwap Account',
      html: `<h3>Welcome to SkillSwap!</h3>
            <p>Please click the link below to verify your email and unlock your full profile:</p>
            <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, level: user.level, points: user.points, streak: user.streak, badges: user.badges } });
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

    // Streak logic
    const now = new Date();
    const last = user.lastLogin ? new Date(user.lastLogin) : null;
    if (last) {
      const diffTime = Math.abs(now - last);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastLogin = now;
    await user.save();

    // send login notification
    await sendMailWithFallback({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: 'New login to SkillSwap',
      html: `<p>Hi ${user.name || ''},</p><p>Your account was just signed in. If this wasn't you, reset your password.</p>`,
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profileImage: user.profileImage, streak: user.streak, level: user.level, points: user.points, badges: user.badges } });
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

    const { name, bio, profileImage, skillsInterestedIn } = req.body;
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (skillsInterestedIn !== undefined) user.skillsInterestedIn = skillsInterestedIn;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, bio: user.bio, profileImage: user.profileImage, skillsInterestedIn: user.skillsInterestedIn } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, level: 1, points: 0, streak: 0 });
    }

    user.emailOtp = otp;
    user.emailOtpExpiry = expiry;
    await user.save();

    if (mailer) {
      await sendMailWithFallback({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Your SkillSwap OTP',
        html: `<h3>Your OTP for SkillSwap is: ${otp}</h3><p>It will expire in 10 minutes.</p>`,
      });
      res.json({ success: true, message: 'OTP sent to your email' });
    } else {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      // In dev mode, return OTP in response so it can be shown on screen
      res.json({ success: true, message: 'OTP sent (dev mode)', devOtp: otp });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email, emailOtp: otp, emailOtpExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, level: user.level, points: user.points, streak: user.streak, badges: user.badges } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/test-mail', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address required for test' });
    
    const result = await sendMailWithFallback({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SkillSwap Email Test 🚀',
      html: '<h3>Test Successful!</h3><p>Your email configuration is working perfectly on SkillSwap.</p>'
    });
    
    if (result.success) {
      res.json({ message: 'Test email sent successfully!', details: result });
    } else {
      res.status(500).json({ message: 'Failed to send test email', error: result.error.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during test' });
  }
});

router.post('/google-login', async (req, res) => {
  try {
    const { email, name, profileImage, googleId } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, profileImage, isVerified: true });
    }
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, level: user.level, points: user.points, streak: user.streak, badges: user.badges } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send-phone-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit for mobile usually
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ phone });
    if (!user) {
      // Create user if they don't exist by phone
      user = new User({ phone, email: `${phone}@skillswap.local`, isVerified: true });
    }

    user.phoneOtp = otp;
    user.phoneOtpExpiry = expiry;
    await user.save();

    console.log(`[DEV MODE] Mobile OTP for ${phone}: ${otp}`);
    res.json({ success: true, message: 'OTP sent to mobile (check console)', devOtp: otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-phone-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

    const user = await User.findOne({ phone, phoneOtp: otp, phoneOtpExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.phoneOtp = undefined;
    user.phoneOtpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, level: user.level, points: user.points, streak: user.streak, badges: user.badges } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

