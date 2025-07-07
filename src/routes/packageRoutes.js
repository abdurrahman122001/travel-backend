const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

router.post('/', packageController.createPackage);
router.get('/', packageController.getPackages);
router.get(
    "/best-selling-community-trips",
    packageController.getBestSellingCommunityTrips
);
router.get(
    "/summer-deals",
    packageController.getSummerDeals
);
router.get(
    "/affordable-packages",
    packageController.getAfforadablePackage
);
router.get(
    "/europe-with-uk",
    packageController.getEuropeWithUk
);
router.get('/:id', packageController.getPackageById);
router.put('/:id', packageController.updatePackage)
router.delete('/:id', packageController.deletePackage);

module.exports = router;
