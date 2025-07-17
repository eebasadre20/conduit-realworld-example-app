const { createAndSendOtp, verifyOtp } = require("../helper/otp");
const {
  FieldRequiredError,
  ValidationError,
} = require("../helper/customErrors");

// POST /api/otp/send
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) throw new FieldRequiredError("A phone number");
    await createAndSendOtp(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/otp/verify
const verifyOtpController = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) throw new FieldRequiredError("Phone and OTP");
    const result = await verifyOtp(phone, otp);
    if (!result.success) throw new ValidationError(result.message);
    res.status(200).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtpController,
};