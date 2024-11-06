const z = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Referral = require("../models/Referral");
const { registerSchema, loginSchema } = require("../utils/validations");
require("dotenv").config();

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, username, referralCode } = registerSchema.parse(
      req.body
    );

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique referral code
    const { nanoid } = await import("nanoid");
    const uniqueReferralCode = nanoid(6);

    // Check if referral code is provided and valid
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid referral code." });
      }
    }

    // Create and save new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      referralCode: uniqueReferralCode,
    });

    // If a valid referrer exists, create a referral entry and update referral count
    if (referrer) {
      referrer.referralCount += 1;
      referrer.referredUsers.push(newUser._id);
      await referrer.save();

      await Referral.create({
        referrer: referrer._id,
        referred: newUser._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      referralCode: uniqueReferralCode,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
