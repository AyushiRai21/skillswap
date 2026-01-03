const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  skillTitle: { type: String, required: true },
  skillCategory: { type: String },
  tutor: { type: String },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
