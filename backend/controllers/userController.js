const User = require("../models/User");
const Referral = require("../models/Referral");

exports.getTopReferrers = async (req, res) => {
  try {
    const topReferrers = await User.find()
      .sort({ referralCount: -1 })
      .limit(5)
      .select("username referralCount referralCode");

    res.status(200).json({ success: true, data: topReferrers });
  } catch (error) {
    console.error("Error fetching top referrers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const referralCount = user.referralCount;
    const referralCode = user.referralCode;
    const referredUsers = await User.find({ _id: { $in: user.referredUsers } });
    res.json({ referralCount, referralCode, referredUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.applyReferral = async (req, res) => {
  const { username, referralCode } = req.body;

  try {
    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid referral code." });
    }

    // Find the referred user by username
    const referredUser = await User.findOne({ username });
    if (!referredUser) {
      return res
        .status(400)
        .json({ success: false, message: "Referred user not found." });
    }

    // Check if referral relationship already exists
    const existingReferral = await Referral.findOne({
      referrer: referrer._id,
      referred: referredUser._id,
    });
    if (existingReferral) {
      return res
        .status(400)
        .json({ success: false, message: "Referral already applied." });
    }

    // Create the referral and update referrer count
    await Referral.create({
      referrer: referrer._id,
      referred: referredUser._id,
    });
    referrer.referralCount += 1;
    referrer.referredUsers.push(referredUser._id);
    await referrer.save();

    res.status(200).json({
      success: true,
      message: "Referral applied successfully",
      referrer: referrer.username,
    });
  } catch (error) {
    console.error("Error applying referral:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
