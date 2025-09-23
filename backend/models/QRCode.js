const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['url', 'email', 'phone'],
  },
  data: {
    type: String,
    required: true,
  },
  qrCodeData: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String,
    default: null,
  }
});

// Index for better query performance
qrCodeSchema.index({ createdAt: -1 });
qrCodeSchema.index({ type: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);