require("dotenv").config(); // to read .env
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/Users"); // Adjust the path as necessary
const Blog = require("./src/models/Blog");  // <<-- Add this line

const seedUserAndMigrateBlogIndexes = async () => {
  const plainPassword = "admin123"; // 👈 your actual password
  console.log("Actual Password:", plainPassword);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log("▶ MongoDB connected");

    // 1. Migrate Blog indexes
    await Blog.syncIndexes();
    console.log("✅ Blog indexes migrated (ensured).");

    // 2. Seed admin user if not present
    const existingUser = await User.findOne({ email: "admin@example.com" });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = new User({
      name:     "Admin User",
      email:    "admin@example.com",
      password: hashedPassword,
      role:     "admin",
    });

    await user.save();
    console.log("✅ Admin user created.");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

seedUserAndMigrateBlogIndexes();
