const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");

// POST /api/contact-messages
router.post("/", contactMessageController.createContactMessage);

// GET /api/contact-messages
router.get("/", contactMessageController.getAllContactMessages);

// GET /api/contact-messages/:id
router.get("/:id", contactMessageController.getContactMessageById);

// DELETE /api/contact-messages/:id
router.delete("/:id", contactMessageController.deleteContactMessage);

module.exports = router;
