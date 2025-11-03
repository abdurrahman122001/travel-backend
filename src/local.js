require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ---------- Static files ---------- */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* ---------- CORS (allow localhost during development) ---------- */
const ALLOWED_ORIGINS = [
  "http://localhost:8081",
  "http://localhost:8080", // Vite
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",

];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

/* ---------- MongoDB connection ---------- */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => console.error("❌ MongoDB connection error:", err));

/* ---------- Routes ---------- */
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
const headerSettingsRoutes = require('./routes/headerSettingsRoutes');
const searchRoutes = require('./routes/search');
const aboutRoutes = require('./routes/about');
const downloadEmailRoutes = require('./routes/downloadEmails');
const homepageRoutes = require('./routes/homepage');

app.use('/api/search', searchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/package-categories', packageCategoryRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/trip-categories', tripCategoryRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/package-subcategories', packageSubcategoryRoutes);
app.use('/api/header-settings', headerSettingsRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/download-emails', downloadEmailRoutes);
app.use('/api/homepage', homepageRoutes);

/* ---------- Health & root ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => {
  res.send("✅ Express server is running locally & MongoDB is connected!");
});

/* ---------- Start server ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
