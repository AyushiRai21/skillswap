const nodemailer = require('nodemailer');

let mailer = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: process.env.SMTP_PASS.trim(),
    },
  });
}

const sendMailWithFallback = async (mailOptions) => {
  if (mailer) {
    try {
      const info = await mailer.sendMail(mailOptions);
      return { success: true, info };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  } else {
    console.warn(`[DEV MODE] Email would normally be sent to: ${mailOptions.to}`);
    console.warn(`[DEV MODE] Email Subject: ${mailOptions.subject}`);
    return { success: true, info: 'Dev mode - email printed to console', devMode: true };
  }
};

module.exports = {
  mailer,
  sendMailWithFallback
};
