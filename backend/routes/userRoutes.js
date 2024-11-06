const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// referral route
router.post("/apply-referral", userController.applyReferral);
// get top referrers
router.get("/get-top-referrers", userController.getTopReferrers);

router.get("/:id/user-details", userController.getUserDetails);

module.exports = router;
