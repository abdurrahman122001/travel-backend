// controllers/headerSettingsController.js
const HeaderSettings = require('../models/HeaderSettings');

// Get header settings
exports.getHeaderSettings = async (req, res) => {
  try {
    const settings = await HeaderSettings.findOne().sort({ updatedAt: -1 });
    
    // Default settings if none exist
    const defaultSettings = {
      logo: {
        url: '/logo.png',
        altText: 'Company Logo'
      },
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
        { platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
        { platform: 'youtube', url: 'https://youtube.com', icon: 'youtube' },
        { platform: 'whatsapp', url: 'https://wa.me/1234567890', icon: 'phone' }
      ]
    };

    res.json(settings || defaultSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update header settings
exports.updateHeaderSettings = async (req, res) => {
  try {
    const { logo, socialLinks } = req.body;
    
    // Validate input
    if (!logo || !logo.url || !socialLinks) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Create new settings document
    const newSettings = new HeaderSettings({
      logo,
      socialLinks
    });

    await newSettings.save();
    res.json(newSettings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};