// models/ContactMessage.js

const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, required: false }, // Set required: true if you want it to be mandatory
  message:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
