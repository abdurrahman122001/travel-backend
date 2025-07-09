const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/packageCategoryController');

router.post('/', ctrl.createCategory);
router.get('/', ctrl.getCategories);
router.put('/:id', ctrl.updateCategory);  // <-- Add this line
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;
