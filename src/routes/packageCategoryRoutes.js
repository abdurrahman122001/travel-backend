const express = require('express');
const router = express.Router();
const packageCategoryController = require('../controllers/packageCategoryController');

router.post('/', 
  packageCategoryController.uploadImage, 
  packageCategoryController.createCategory
);

router.get('/', packageCategoryController.getCategories);
router.get('/with-subcategories', packageCategoryController.getCategoriesWithSubcategories);

router.put('/:id', 
  packageCategoryController.uploadImage, 
  packageCategoryController.updateCategory
);

router.delete('/:id', packageCategoryController.deleteCategory);

module.exports = router;