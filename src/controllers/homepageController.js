// controllers/homepageController.js
import HomepageContent from '../models/HomepageContent.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/homepage';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get homepage data
export const getHomepage = async (req, res) => {
  try {
    let homepage = await HomepageContent.findOne();
    
    if (!homepage) {
      // Create default homepage document if none exists
      homepage = new HomepageContent({
        heroSlides: [
          {
            image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1920&q=80",
            title: "Discover Amazing Destinations",
            subtitle: "Explore the world's most beautiful places with our curated travel packages",
            order: 0
          },
          {
            image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1920&q=80",
            title: "Adventure Awaits You",
            subtitle: "Experience breathtaking landscapes and unforgettable memories",
            order: 1
          },
          {
            image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80",
            title: "Paradise Found",
            subtitle: "Relax on pristine beaches and enjoy luxury accommodations",
            order: 2
          }
        ],
        reviews: [
          {
            name: "Google",
            href: "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0TE_Pzc0qsbAwYLRSNagwtjRITjVONbI0TDNJMU9JszKoMDVLMgYKpRkYGKWmJCUbeXGUJ-alpBbl5wEAV6UTSw&q=wanderon",
            rating: "4.9",
            count: "13080",
            icon: "https://ik.imagekit.io/workcations/gallery/landing-pages/social/google.png",
            order: 0
          },
          {
            name: "Tripadvisor",
            href: "https://www.tripadvisor.in/Attraction_Review-g304551-d15013133-Reviews-WanderOn-New_Delhi_National_Capital_Territory_of_Delhi.html",
            rating: "5.0",
            count: "3660",
            icon: "https://ik.imagekit.io/workcations/gallery/landing-pages/social/tripadvisor.png",
            order: 1
          },
          {
            name: "Facebook",
            href: "https://www.facebook.com/wander.on/reviews/",
            rating: "4.9",
            count: "1031",
            icon: "https://ik.imagekit.io/workcations/gallery/landing-pages/social/facebook.png",
            order: 2
          }
        ],
        sections: {
          internationalTrips: {
            title: "International Trips",
            subtitle: "Discover the world, one destination at a time",
            backgroundImage: "https://images.wanderon.in/new-homepage-data/cta%20homepage%20-%20desktop.png",
            buttonText: "Explore",
            backgroundColor: "#fffbe0"
          },
          exploreIndia: {
            title: "Explore India",
            subtitle: "Discover the beauty of India, one destination at a time",
            backgroundImage: "https://images.wanderon.in/new-homepage-data/cta%20homepage%20-%20desktop.png",
            buttonText: "Explore",
            backgroundColor: "#FFECE2"
          },
          romanticEscapes: {
            title: "Romantic Escapes",
            subtitle: "Where Forever Begins...Together!",
            backgroundImage: "https://images.wanderon.in/new-homepage-data/cta%20homepage%20-%20desktop.png",
            buttonText: "Explore",
            backgroundColor: "#E5F8FF"
          },
          upcomingTrips: {
            title: "Upcoming Community Trips",
            viewAllText: "View All",
            months: ["JUN '25", "JUL '25", "AUG '25", "SEP '25", "OCT '25", "NOV '25", "DEC '25"]
          },
          journeyFrames: {
            title: "JOURNEY IN FRAMES",
            subtitle: "Pictures Perfect Moments"
          },
          testimonials: {
            title: "What Our Travelers Say",
            subtitle: "Real experiences from real adventurers"
          }
        },
        journeyFrames: [
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/vietnam%202",
            label: "Vietnam",
            order: 0
          },
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/dubai%20re%2001?updatedAt=1711452484035/images/slide2.jpg",
            label: "Dubai",
            order: 1
          },
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/bhutan%204",
            label: "Bhutan",
            order: 2
          },
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/kerala-trips-1",
            label: "Kerala",
            order: 3
          },
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/meghalaya%201?updatedAt=1711451040355",
            label: "Meghalaya",
            order: 4
          },
          {
            src: "https://images.wanderon.in/new-homepage-data/Gallery/uttarakhand-re-2?updatedAt=1711452678546",
            label: "Uttarakhand",
            order: 5
          }
        ],
        testimonials: [
          {
            name: "Sarah Johnson",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            text: "Our Bali trip was absolutely incredible! Every detail was perfectly planned and the experiences were unforgettable.",
            order: 0
          },
          {
            name: "Michael Chen",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            text: "The Swiss Alps adventure exceeded all expectations. The views were breathtaking and the service was impeccable.",
            order: 1
          },
          {
            name: "Emma Williams",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            text: "Amazing safari experience! We saw all the Big 5 and the guides were incredibly knowledgeable.",
            order: 2
          },
          {
            name: "David Rodriguez",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            text: "Patagonia was a dream come true! The landscapes were stunning and our guide was fantastic.",
            order: 3
          },
          {
            name: "Lisa Park",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            text: "Perfect honeymoon destination! The beaches were pristine and the accommodations were luxurious.",
            order: 4
          }
        ],
        typingTexts: [
          "Create Your Own Journey, Your Own Story...",
          "Find Adventures That Match Your Soul...",
          "Travel With Purpose And People You Love..."
        ]
      });
      await homepage.save();
    }
    
    res.json(homepage);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    res.status(500).json({ 
      message: 'Error fetching homepage data', 
      error: error.message 
    });
  }
};

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/homepage/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Error uploading image', 
      error: error.message 
    });
  }
};

// Update homepage data
export const updateHomepage = async (req, res) => {
  try {
    const homepageData = req.body;
    
    let homepage = await HomepageContent.findOne();
    
    if (homepage) {
      // Update existing
      homepage = await HomepageContent.findByIdAndUpdate(
        homepage._id,
        { $set: homepageData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      homepage = new HomepageContent(homepageData);
      await homepage.save();
    }
    
    res.json({ 
      message: 'Homepage updated successfully', 
      homepage 
    });
  } catch (error) {
    console.error('Error updating homepage:', error);
    res.status(400).json({ 
      message: 'Error updating homepage', 
      error: error.message 
    });
  }
};

// Update specific section
export const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;
    
    const homepage = await HomepageContent.findOne();
    if (!homepage) {
      return res.status(404).json({ message: 'Homepage not found' });
    }
    
    homepage[section] = data;
    await homepage.save();
    
    res.json({ 
      message: `${section} updated successfully`, 
      homepage 
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(400).json({ 
      message: 'Error updating section', 
      error: error.message 
    });
  }
};