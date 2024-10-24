const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/users");
const { verifyEmail } = require("../controllers/users");

// Register
router.post("/", signUp);
// Login
router.post("/login", signIn);
// Verify Email
router.post("/verify-email", verifyEmail);

module.exports = router;