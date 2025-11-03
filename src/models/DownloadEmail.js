import mongoose from 'mongoose';

const downloadEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  packageTitle: {
    type: String,
    required: true
  },
  packageSlug: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  downloadCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound index to track unique email-package downloads
downloadEmailSchema.index({ email: 1, packageId: 1 }, { unique: true });

// Index for admin queries
downloadEmailSchema.index({ createdAt: -1 });
downloadEmailSchema.index({ packageTitle: 1 });
downloadEmailSchema.index({ phone: 1 });

export default mongoose.model('DownloadEmail', downloadEmailSchema);