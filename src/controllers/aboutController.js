// controllers/aboutController.js
import About from '../models/About.js';

// Get about page data
export const getAbout = async (req, res) => {
  try {
    const about = await About.getAbout();
    if (!about) {
      // Create default about document if none exists
      const defaultAbout = new About();
      await defaultAbout.save();
      return res.json(defaultAbout);
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching about data', error: error.message });
  }
};

// Create or update about page data
export const updateAbout = async (req, res) => {
  try {
    const aboutData = req.body;
    
    let about = await About.getAbout();
    
    if (about) {
      // Update existing
      about = await About.findByIdAndUpdate(
        about._id,
        { $set: aboutData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      about = new About(aboutData);
      await about.save();
    }
    
    res.json({ message: 'About page updated successfully', about });
  } catch (error) {
    res.status(400).json({ message: 'Error updating about page', error: error.message });
  }
};

// Update specific sections
export const updateSection = async (req, res) => {
  try {
    const { section } = req.params;
    const data = req.body;
    
    const about = await About.getAbout();
    if (!about) {
      return res.status(404).json({ message: 'About page not found' });
    }
    
    about[section] = data;
    await about.save();
    
    res.json({ message: `${section} updated successfully`, about });
  } catch (error) {
    res.status(400).json({ message: 'Error updating section', error: error.message });
  }
};