const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const nodemailer = require('nodemailer');

// configure nodemailer transporter if SMTP config provided
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Create a new request
router.post('/', async (req, res) => {
  try {
    const { skillTitle, skillCategory, tutor, requesterName, requesterEmail, message } = req.body;
    if (!skillTitle || !requesterName || !requesterEmail) {
      return res.status(400).json({ error: 'skillTitle, requesterName and requesterEmail are required' });
    }
    const request = new Request({ skillTitle, skillCategory, tutor, requesterName, requesterEmail, message });
    await request.save();

    // send email notification to tutor or admin if transporter available
    try {
      const to = req.body.tutorEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_TO;
      if (transporter && to) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to,
          subject: `New skill request: ${skillTitle}`,
          html: `<p>You have a new request for <strong>${skillTitle}</strong> from <strong>${requesterName}</strong> (${requesterEmail}).</p>
                <p>Message: ${message || '-'}<br/>Tutor: ${tutor || '-'}<br/>Category: ${skillCategory || '-'}</p>`,
        });
      }
    } catch (mailErr) {
      console.error('Failed to send notification email', mailErr);
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

    // optional: notify requester via email if transporter is configured
    try {
      if (transporter && reqDoc.requesterEmail) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.SMTP_USER,
          to: reqDoc.requesterEmail,
          subject: `Your request for ${reqDoc.skillTitle} is ${status}`,
          html: `<p>Your request for <strong>${reqDoc.skillTitle}</strong> has been <strong>${status}</strong>.</p>`,
        });
      }
    } catch (mailErr) {
      console.error('Failed sending status update email', mailErr);
    }

    return res.json({ success: true, request: reqDoc });
  } catch (err) {
    console.error('Error updating request', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
