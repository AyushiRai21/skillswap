const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { addPoints } = require('../utils/gamification');
const { sendMailWithFallback } = require('../utils/mailer');

// Create a new request
router.post('/', auth, async (req, res) => {
  try {
    const { skillTitle, skillCategory, tutor, message } = req.body;
    const requesterName = req.user && req.user.name ? req.user.name : req.body.requesterName;
    const requesterEmail = req.user && req.user.email ? req.user.email : req.body.requesterEmail;

    if (!skillTitle || !requesterName || !requesterEmail) {
      return res.status(400).json({ error: 'skillTitle, requesterName and requesterEmail are required' });
    }
    const request = new Request({ skillTitle, skillCategory, tutor, requesterName, requesterEmail, message });
    await request.save();

    // Award points for engagement
    if (req.user && req.user.id) {
      const userDoc = await User.findById(req.user.id);
      if (userDoc) {
        await addPoints(userDoc, 10); // 10 points per request
      }
    }

    // Find tutor by name and notify them
    if (tutor) {
      const tutorUser = await User.findOne({ name: tutor });
      if (tutorUser) {
        const notif = await Notification.create({
          recipient: tutorUser._id,
          type: 'request',
          message: `New request from ${requesterName} for skill: ${skillTitle}`,
          relatedId: request._id
        });
        
        // Real-time Emit
        if (req.io) {
            req.io.to(`user_${tutorUser._id.toString()}`).emit('new_notification', notif);
        }
      }
    }

    // Send email notification to tutor or admin if transporter is available
    const to = req.body.tutorEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_TO;
    if (to) {
      await sendMailWithFallback({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject: `New skill request: ${skillTitle}`,
        html: `<p>You have a new request for <strong>${skillTitle}</strong> from <strong>${requesterName}</strong> (${requesterEmail}).</p>
              <p>Message: ${message || '-'}<br/>Tutor: ${tutor || '-'}<br/>Category: ${skillCategory || '-'}</p>`,
      });
    }

    return res.status(201).json({ success: true, request });
  } catch (err) {
    console.error('Error creating request', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all requests (admin/tutor view) - simple list
router.get('/', async (req, res) => {
  try {
    const list = await Request.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ requests: list });
  } catch (err) {
    console.error('Error fetching requests', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update a request (e.g., change status)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const reqDoc = await Request.findById(id);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
    reqDoc.status = status;
    await reqDoc.save();

    // Find requester by email and notify them
    const requesterUser = await User.findOne({ email: reqDoc.requesterEmail });
    if (requesterUser) {
      const notif = await Notification.create({
        recipient: requesterUser._id,
        type: 'request',
        message: `Your request for ${reqDoc.skillTitle} has been ${status}`,
        relatedId: reqDoc._id
      });
      
      // Real-time Emit
      if (req.io) {
          req.io.to(`user_${requesterUser._id.toString()}`).emit('new_notification', notif);
      }
    }

    // Award Karma to tutor if accepted
    if (status === 'accepted' && reqDoc.tutor) {
        const tutorUser = await User.findOne({ name: reqDoc.tutor });
        if (tutorUser) {
            tutorUser.karma = (tutorUser.karma || 0) + 50;
            // Auto-award "Generous Mentor" badge at 100 karma
            if (tutorUser.karma >= 100 && !tutorUser.badges.includes('Generous Mentor')) {
                tutorUser.badges.push('Generous Mentor');
            }
            await tutorUser.save();
        }
    }

    // Optionally notify requester via email
    if (reqDoc.requesterEmail) {
      await sendMailWithFallback({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: reqDoc.requesterEmail,
        subject: `Your request for ${reqDoc.skillTitle} is ${status}`,
        html: `<p>Your request for <strong>${reqDoc.skillTitle}</strong> has been <strong>${status}</strong>.</p>`,
      });
    }

    return res.json({ success: true, request: reqDoc });
  } catch (err) {
    console.error('Error updating request', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
