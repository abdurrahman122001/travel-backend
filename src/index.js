require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); // <--- ADDED

const app = express();

app.use(cors({
  origin: [
    "http://app.innand.com",
    "http://admins.innand.com"
  ],  credentials: true, // remove if you do not need cookies
}));
app.use(express.json({ limit: '10mb' }));

// === MongoDB connection ===
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("▶ MongoDB connected");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Plug in blog routes ===
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const packageRoutes = require('./routes/packageRoutes');
const packageCategoryRoutes = require('./routes/packageCategoryRoutes');
const tripRoutes = require("./routes/tripRoutes");
const tripCategoryRoutes = require("./routes/tripCategoryRoutes");
const contactMessageRoutes = require('./routes/contactMessages');
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const packageSubcategoryRoutes = require('./routes/packageSubcategories');

app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/package-categories', packageCategoryRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/trip-categories", tripCategoryRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/auth", authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/package-subcategories', packageSubcategoryRoutes);

app.get("/", (req, res) => {
  res.send("Express server is up & MongoDB is connected!");
});

// === Start the server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`▶ Server listening on port ${PORT}`);
});
