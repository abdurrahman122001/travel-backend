const mongoose = require('mongoose');
const slugify = require('slugify');

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subtitle: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageCategory', required: true },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PackageSubcategory' }],
  locations: [{ type: String }],
  price: {
    original: { type: Number, required: true },
    current: { type: Number, required: true },
    label: { type: String, default: "onwards" }
  },
  isRecommended: { type: Boolean, default: false },
  image: { type: String, required: true },
  days: { type: Number, required: true },
  nights: { type: Number, required: true },
  durationLabel: { type: String },
  tripBreakdown: { type: String },
  startLocation: { type: String },
  departureDates: [{ type: String }],
  features: [{ type: String }],
  itinerary: { type: String },
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  terms: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Draft"], default: "Draft" }
});

// Auto-generate unique slug from title
PackageSchema.pre('validate', async function (next) {
  if (!this.slug && this.title) {
    let newSlug = slugify(this.title, { lower: true, strict: true });
    let pkg = await mongoose.models.Package.findOne({ slug: newSlug });
    let suffix = 1;
    let baseSlug = newSlug;
    while (pkg && (!this._id || pkg._id.toString() !== this._id.toString())) {
      newSlug = `${baseSlug}-${suffix++}`;
      pkg = await mongoose.models.Package.findOne({ slug: newSlug });
    }
    this.slug = newSlug;
  }
  next();
});

module.exports = mongoose.model('Package', PackageSchema);
