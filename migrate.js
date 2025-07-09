require("dotenv").config();
const mongoose = require("mongoose");
const Package = require("./src/models/Package"); // Adjust path if needed

const migratePackageIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("▶ MongoDB connected");

    // Migrate Package indexes
    await Package.syncIndexes();
    console.log("✅ Package indexes migrated (ensured).");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

migratePackageIndexes();
