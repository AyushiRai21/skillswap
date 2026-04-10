const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  emailOtp: { type: String },
  emailOtpExpiry: { type: Date },
  profileImage: { type: String },
  bio: { type: String },
  completedSwaps: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  karma: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  badges: [{ type: String }],
  skillsInterestedIn: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  phone: { type: String, unique: true, sparse: true },
  phoneOtp: { type: String },
  phoneOtpExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
