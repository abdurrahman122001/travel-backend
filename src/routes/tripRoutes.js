// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/", tripController.createTrip);
router.get("/international", tripController.getInternationalTrips);
router.get("/explore-india", tripController.getExploreIndiaTrips);
router.get("/romantic-escapes", tripController.getRomanticEscapesTrips);

router.get("/", tripController.getAllTrips);
router.get("/:id", tripController.getTripById);
router.put("/:id", tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
