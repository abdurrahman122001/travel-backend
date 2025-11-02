// models/About.js
import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const valueSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const aboutSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: true,
    default: "About Breakout Wanderers"
  },
  heroSubtitle: {
    type: String,
    required: true,
    default: "Creating extraordinary travel experiences since 2000"
  },
  heroBackgroundColor: {
    type: String,
    default: "#38bdf8"
  },
  storyTitle: {
    type: String,
    default: "Our Story"
  },
  storyContent: {
    type: [String],
    default: [
      "Breakout Wanderers was born out of a passion for travel that began more than 25 years ago with our founder...",
      "Today, his daughter carries forward this legacy...",
      "For us, travel is not just about destinations — it's about heritage, learning, and creating lasting bonds..."
    ]
  },
  stats: [statSchema],
  missionTitle: {
    type: String,
    default: "Our Mission"
  },
  missionStatement: {
    type: String,
    default: "To create safe, enriching, and memorable travel experiences that inspire learning, strengthen connections, and leave lasting impressions for every traveler."
  },
  valuesTitle: {
    type: String,
    default: "Our Values"
  },
  valuesSubtitle: {
    type: String,
    default: "The principles that guide everything we do"
  },
  values: [valueSchema],
  teamTitle: {
    type: String,
    default: "Meet Our Team"
  },
  teamSubtitle: {
    type: String,
    default: "At Breakout Wanderers, our strength lies in the passion and expertise of our people."
  },
  team: [teamSchema],
  ctaTitle: {
    type: String,
    default: "Ready to Start Your Journey?"
  },
  ctaSubtitle: {
    type: String,
    default: "Let us help you create memories that will last a lifetime"
  },
  ctaBackgroundColor: {
    type: String,
    default: "#38bdf8"
  },
  status: {
    type: String,
    enum: ['active', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Only one about document should exist
aboutSchema.statics.getAbout = function() {
  return this.findOne().sort({ createdAt: -1 });
};

export default mongoose.model('About', aboutSchema);