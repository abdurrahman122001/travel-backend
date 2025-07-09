const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Order matters: slug route must come before :id!
router.get('/slug/:slug', packageController.getPackageBySlug);

router.post('/', packageController.createPackage);
router.get('/', packageController.getPackages);
router.get('/count', packageController.countAllPackages); // Count all packages
router.get("/best-selling-community-trips", packageController.getBestSellingCommunityTrips);
router.get("/summer-deals", packageController.getSummerDeals);
router.get("/affordable-packages", packageController.getAfforadablePackage);
router.get("/europe-with-uk", packageController.getEuropeWithUk);
router.get('/:id', packageController.getPackageById);
router.put('/:id', packageController.updatePackage);
router.delete('/:id', packageController.deletePackage);
router.get('/by-category/:categoryId', packageController.getPackagesByCategory);
module.exports = router;
