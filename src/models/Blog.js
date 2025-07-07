const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Travel Tips', 'Destinations', 'Culture', 'Adventure', 'Food'],
    },
    tags: [{ type: String, trim: true }],
    author: { type: String, required: true, default: 'Admin' },
    image: { type: String },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    publishedAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', BlogSchema);
