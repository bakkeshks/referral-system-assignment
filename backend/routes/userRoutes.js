const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// referral route
router.post("/apply-referral", userController.applyReferral);
// get top referrers
router.get("/get-top-referrers", userController.getTopReferrers);

router.get("/:id/referral-count", userController.getReferralCount);
router.get("/:id/referrals", userController.getReferredUsers);

module.exports = router;
