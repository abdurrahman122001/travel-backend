const express = require("express");
const router = express.Router();
const tripCategoryController = require("../controllers/tripCategoryController");

router.post("/", tripCategoryController.createCategory);
router.get("/", tripCategoryController.getCategories);
router.get("/:id", tripCategoryController.getCategory);
router.put("/:id", tripCategoryController.updateCategory);
router.delete("/:id", tripCategoryController.deleteCategory);

module.exports = router;
