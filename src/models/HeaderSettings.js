// models/HeaderSettings.js
const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['facebook', 'instagram', 'youtube', 'whatsapp']
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
});

const headerSettingsSchema = new mongoose.Schema({
  logo: {
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      default: 'Company Logo'
    }
  },
  socialLinks: [socialLinkSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HeaderSettings', headerSettingsSchema);