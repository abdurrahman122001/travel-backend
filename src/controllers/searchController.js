// controllers/packageSearchController.js
const Package = require('../models/Package');
const Trip = require('../models/Trip');

exports.searchAll = async (req, res) => {
  try {
    const query = (req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Clean punctuation & split into words
    const cleanQuery = query.replace(/[^\w\s]/g, '').trim();
    const words = cleanQuery.split(/\s+/).filter(Boolean);

    // Phrase regex
    const phraseRegex = new RegExp(cleanQuery, 'i');

    // Each word regex
    const wordRegexConditions = words.map(word => ({
      $or: [
        { title: { $regex: word, $options: 'i' } },
        { description: { $regex: word, $options: 'i' } },
        { destination: { $regex: word, $options: 'i' } },
      ],
    }));

    // Package search
    const packages = await Package.find({
      status: 'Active',
      $or: [
        { title: phraseRegex },
        { description: phraseRegex },
        { destination: phraseRegex },
        { $and: wordRegexConditions },
      ],
    })
      .populate('categories')
      .populate('subcategories')
      .lean();

    // Trip search
    const trips = await Trip.find({
      status: 'Active',
      $or: [
        { title: phraseRegex },
        { description: phraseRegex },
        { destination: phraseRegex },
        { $and: wordRegexConditions },
      ],
    })
      .populate('categories')
      .populate('subcategories')
      .lean();

    const defaultImage =
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80';

    // Normalize output
    const normalizedPackages = packages.map(pkg => ({
      ...pkg,
      images: [pkg.image || defaultImage], // single image wrapped in array
      price: pkg.price || { current: 0, label: 'onwards' },
    }));

    const normalizedTrips = trips.map(trip => ({
      ...trip,
      images: [trip.image || defaultImage], // single image wrapped in array
      price: trip.price || { current: 0, label: 'onwards' },
      slug: trip.slug || trip._id,
    }));

    res.json({
      totalPackages: packages.length,
      totalTrips: trips.length,
      packages: normalizedPackages,
      trips: normalizedTrips,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
};
