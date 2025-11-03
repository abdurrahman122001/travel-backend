require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const app = express();

/* ---------- Static files ---------- */
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

/* ---------- CORS (allow your domains over HTTPS) ---------- */
const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://finwinn.com",
  "https://www.finwinn.com",
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

// Register all routes
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
  res.send("✅ Express server is running & MongoDB is connected!");
});

/* ---------- Error handling middleware ---------- */
app.use((error, req, res, next) => {
  if (error.message.includes('CORS blocked')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: error.message
    });
  }
  next(error);
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

/* ---------- HTTPS server (443) + HTTP redirect (80) ---------- */
const CERT_PATH = process.env.CERT_FULLCHAIN || "/etc/letsencrypt/live/finwinn.com/fullchain.pem";
const KEY_PATH = process.env.CERT_PRIVKEY || "/etc/letsencrypt/live/finwinn.com/privkey.pem";
const HTTPS_PORT = 443;
const HTTP_PORT = 80;

// If you deploy behind a proxy in the future, uncomment:
// app.set('trust proxy', true);

// Check if certificate files exist before creating HTTPS server
let httpsServer;
try {
  if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
    const httpsOptions = {
      cert: fs.readFileSync(CERT_PATH),
      key: fs.readFileSync(KEY_PATH),
    };

    httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`🔐 HTTPS server listening on port ${HTTPS_PORT}`);
      console.log(`🌐 Server available at: https://finwinn.com`);
    });

    // Redirect all HTTP to HTTPS
    http.createServer((req, res) => {
      const host = req.headers.host || "finwinn.com";
      res.writeHead(301, { 
        Location: `https://${host}${req.url}` 
      });
      res.end();
    }).listen(HTTP_PORT, () => {
      console.log(`➡️  HTTP redirect server listening on port ${HTTP_PORT}`);
      console.log(`🔄 Redirecting all HTTP traffic to HTTPS`);
    });

  } else {
    console.warn('⚠️  SSL certificate files not found. Starting HTTP server only.');
    throw new Error('SSL certificates not found');
  }
} catch (error) {
  // Fallback to HTTP only if HTTPS fails
  console.log('🔄 Falling back to HTTP server');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 HTTP server running on port ${process.env.PORT || 5000}`);
    console.log(`📝 Note: Running without HTTPS. For production, ensure SSL certificates are properly configured.`);
  });
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (httpsServer) {
    httpsServer.close(() => {
      console.log('HTTPS server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (httpsServer) {
    httpsServer.close(() => {
      console.log('HTTPS server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
