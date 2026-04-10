const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // minutes
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  meetLink: { type: String },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
