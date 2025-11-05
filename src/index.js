
require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const fs       = require("fs");
const http     = require("http");
const https    = require("https");
const path     = require("path");

const app = express();

/* ---------- Static files ---------- */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* ---------- CORS (allow your domains over HTTPS) ---------- */
const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:8081",
  "https://finwinn.com",
  "https://www.finwinn.com",
  // keep these if you still need them:
  "https://app.twgi.in",
  "http://app.twgi.in",
  "https://admin.twgi.in",
  "http://admin.twgi.in",
];

app.use(cors({
  origin(origin, cb) {
    // allow tools/curl/no-origin requests
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true, // keep if you use cookies/auth headers
}));

app.use(express.json({ limit: '10mb' }));

/* ---------- MongoDB connection ---------- */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("▶ MongoDB connected");
}).catch((err) => console.error("❌ MongoDB connection error:", err));

/* ---------- Routes ---------- */
const blogRoutes               = require('./routes/blogRoutes');
const categoryRoutes           = require('./routes/categoryRoutes');
const packageRoutes            = require('./routes/packageRoutes');
const packageCategoryRoutes    = require('./routes/packageCategoryRoutes');
const tripRoutes               = require("./routes/tripRoutes");
const tripCategoryRoutes       = require("./routes/tripCategoryRoutes");
const contactMessageRoutes     = require('./routes/contactMessages');
const authRoutes               = require("./routes/authRoutes");
const bookingRoutes            = require('./routes/bookingRoutes');
const commentRoutes            = require('./routes/commentRoutes');
const visitorRoutes            = require('./routes/visitorRoutes');
const packageSubcategoryRoutes = require('./routes/packageSubcategories');
const headerSettingsRoutes     = require('./routes/headerSettingsRoutes');
const searchRoutes = require('./routes/search');
const aboutRoutes = require('./routes/about');
const downloadEmailRoutes = require('./routes/downloadEmails');
const homepageRoutes = require('./routes/homepage');


app.use('/api/search', searchRoutes);
app.use('/api/categories',           categoryRoutes);
app.use('/api/blogs',                blogRoutes);
app.use('/api/packages',             packageRoutes);
app.use('/api/package-categories',   packageCategoryRoutes);
app.use('/api/trips',                tripRoutes);
app.use('/api/comments',             commentRoutes);
app.use('/api/trip-categories',      tripCategoryRoutes);
app.use('/api/contact-messages',     contactMessageRoutes);
app.use('/api/auth',                 authRoutes);
app.use('/api',                      bookingRoutes);
app.use('/api/visitors',             visitorRoutes);
app.use('/api/package-subcategories',packageSubcategoryRoutes);
app.use('/api/header-settings',      headerSettingsRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/download-emails', downloadEmailRoutes);
app.use('/api/homepage', homepageRoutes);

/* ---------- Health & root ---------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => {
  res.send("Express server is up & MongoDB is connected!");
});

/* ---------- HTTPS server (443) + HTTP redirect (80) ---------- */
/* Use your Let's Encrypt paths (already issued):              */
/*   /etc/letsencrypt/live/finwinn.com/fullchain.pem           */
/*   /etc/letsencrypt/live/finwinn.com/privkey.pem             */
const CERT_PATH   = process.env.CERT_FULLCHAIN || "/etc/letsencrypt/live/finwinn.com/fullchain.pem";
const KEY_PATH    = process.env.CERT_PRIVKEY  || "/etc/letsencrypt/live/finwinn.com/privkey.pem";
const HTTPS_PORT  = 443;
const HTTP_PORT   = 80;

// If you deploy behind a proxy in the future, uncomment:
// app.set('trust proxy', true);

const httpsOptions = {
  cert: fs.readFileSync(CERT_PATH),
  key:  fs.readFileSync(KEY_PATH),
};

https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`🔐 HTTPS listening on https://finwinn.com (:${HTTPS_PORT})`);
});

// Redirect all HTTP to HTTPS
http.createServer((req, res) => {
  const host = req.headers.host || "finwinn.com";
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`➡️  Redirecting HTTP (:${HTTP_PORT}) → HTTPS (:${HTTPS_PORT})`);
});
