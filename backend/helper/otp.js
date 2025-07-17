const { Otp } = require("../models");
const { Op } = require("sequelize");

// Generates a 6-digit OTP
function generateOtp(length = 6) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

// (Stub) Replace this with a real SMS provider
async function sendOtpToPhone(phone, otp) {
  // In production, integrate with an SMS API (e.g., Twilio)
  console.log(`OTP for ${phone}: ${otp}`); // Log for development only
  return true;
}

async function createAndSendOtp(phone) {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes from now

  // Delete old OTPs for this phone
  await Otp.destroy({ where: { phone } });

  await Otp.create({
    phone,
    otp_code: otpCode,
    expires_at: expiresAt,
    is_verified: false,
  });

  await sendOtpToPhone(phone, otpCode);
}

async function verifyOtp(phone, code) {
  const otp = await Otp.findOne({
    where: {
      phone,
      otp_code: code,
      expires_at: { [Op.gt]: new Date() },
      is_verified: false,
    },
  });

  if (!otp) {
    return { success: false, message: "Invalid or expired OTP" };
  }
  otp.is_verified = true;
  await otp.save();
  return { success: true, message: "OTP verified successfully" };
}

module.exports = {
  createAndSendOtp,
  verifyOtp,
};