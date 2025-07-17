const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtpController } = require("../controllers/otp");

// Send OTP
router.post("/send", sendOtp);

// Verify OTP
router.post("/verify", verifyOtpController);

module.exports = router;