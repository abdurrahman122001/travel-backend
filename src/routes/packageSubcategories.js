const express = require('express');
const router = express.Router();
const controller = require('../controllers/packageSubcategoryController');

router.post('/', controller.createSubcategory);
router.get('/', controller.getSubcategories);
router.put('/:id', controller.updateSubcategory);
router.delete('/:id', controller.deleteSubcategory);

module.exports = router;
