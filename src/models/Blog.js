const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true }, // stores HTML from Quill
    category: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    author: { type: String, required: true, default: 'Admin' },
    image: { type: String },
    status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
    publishedAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pre-validate: set or ensure unique slug
BlogSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  // Ensure slug is unique (append -1, -2 etc. if necessary)
  let slug = this.slug;
  let count = 0;
  while (
    await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })
  ) {
    count++;
    slug = `${this.slug}-${count}`;
  }
  this.slug = slug;
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
