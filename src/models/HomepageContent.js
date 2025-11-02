// models/HomepageContent.js
import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  count: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const journeyFrameSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  backgroundImage: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: "Explore"
  },
  backgroundColor: {
    type: String,
    default: "#fffbe0"
  },
  order: {
    type: Number,
    default: 0
  }
});

const homepageContentSchema = new mongoose.Schema({
  // Hero Section
  heroSlides: [heroSlideSchema],
  
  // Reviews Section
  reviews: [reviewSchema],
  
  // Static Images
  staticImages: {
    abc: {
      type: String,
      default: "/abc.png"
    },
    uct: {
      type: String,
      default: "/ucl.jpg"
    }
  },
  
  // Sections
  sections: {
    internationalTrips: sectionSchema,
    exploreIndia: sectionSchema,
    romanticEscapes: sectionSchema,
    upcomingTrips: {
      title: {
        type: String,
        default: "Upcoming Community Trips"
      },
      viewAllText: {
        type: String,
        default: "View All"
      },
      months: [String]
    },
    journeyFrames: {
      title: {
        type: String,
        default: "JOURNEY IN FRAMES"
      },
      subtitle: {
        type: String,
        default: "Pictures Perfect Moments"
      }
    },
    testimonials: {
      title: {
        type: String,
        default: "What Our Travelers Say"
      },
      subtitle: {
        type: String,
        default: "Real experiences from real adventurers"
      }
    }
  },
  
  // Journey Frames
  journeyFrames: [journeyFrameSchema],
  
  // Testimonials
  testimonials: [testimonialSchema],
  
  // Typing Texts
  typingTexts: [String],
  
  // Status
  status: {
    type: String,
    enum: ['active', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Only one homepage document should exist
homepageContentSchema.statics.getHomepage = function() {
  return this.findOne().sort({ createdAt: -1 });
};

export default mongoose.model('HomepageContent', homepageContentSchema);