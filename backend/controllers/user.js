const { UnauthorizedError } = require("../helper/customErrors");
const { bcryptHash } = require("../helper/bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//* Current User
const currentUser = async (req, res, next) => {
  try {
    const { loggedUser } = req
    if (!loggedUser) throw new UnauthorizedError()

    loggedUser.dataValues.email = req.headers.email
    delete req.headers.email

    res.json({ user: loggedUser })
  } catch (error) {
    next(error)
  }
}

//* Update User
const updateUser = async (req, res, next) => {
  try {
    const { loggedUser } = req
    if (!loggedUser) throw new UnauthorizedError()

    const {
      user: { password },
      user,
    } = req.body

    Object.entries(user).forEach((entry) => {
      const [key, value] = entry

      if (value !== undefined && key !== "password") loggedUser[key] = value
    })

    if (password !== undefined || password !== "") {
      loggedUser.password = await bcryptHash(password)
    }

    await loggedUser.save()

    res.json({ user: loggedUser })
  } catch (error) {
    next(error)
  }
}

//* Request Password Reset
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) throw new NotFoundError("User")

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_ADDRESS,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             http://${req.headers.host}/reset/${token}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Password reset email sent' })
  } catch (error) {
    next(error)
  }
}

//* Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    })

    if (!user) throw new Error('Password reset token is invalid or has expired.')

    user.password = await bcryptHash(newPassword)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    res.status(200).json({ message: 'Password has been reset' })
  } catch (error) {
    next(error)
  }
}

module.exports = { currentUser, updateUser, requestPasswordReset, resetPassword }