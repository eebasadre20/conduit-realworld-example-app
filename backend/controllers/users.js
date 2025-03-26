const { User } = require("../models");
const { jwtSign } = require("../helper/jwt");
const { bcryptHash, bcryptCompare } = require("../helper/bcrypt");
const {
  ValidationError,
  FieldRequiredError,
  AlreadyTakenError,
  NotFoundError,
} = require("../helper/customErrors");

// Register
const signUp = async (req, res, next) => {
  try {
    const { username, email, bio, image, password } = req.body.user;
    // Check if username is provided, throw an error if not
    if (!username) throw new FieldRequiredError(`A username`);
    if (!email) throw new FieldRequiredError(`An email`);
    if (!password) throw new FieldRequiredError(`A password`);

    const userExists = await User.findOne({
      where: { email: req.body.user.email },
    });
    if (userExists) throw new AlreadyTakenError("Email", "try logging in");

    const newUser = await User.create({
      email: email,
      username: username,
      bio: bio,
      image: image,
      password: await bcryptHash(password),
    });
    newUser.dataValues.token = await jwtSign(newUser);

    res.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
};

// Login
const signIn = async (req, res, next) => {
  try {
    const { user } = req.body;

    const existentUser = await User.findOne({ where: { email: user.email } });
    if (!existentUser) throw new NotFoundError("Email", "sign in first");

    const pwd = await bcryptCompare(user.password, existentUser.password);
    if (!pwd) throw new ValidationError("Wrong email/password combination");

    existentUser.dataValues.token = await jwtSign(user);

    res.json({ user: existentUser });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // Check if the token is expired
    if (user.verificationTokenExpires < new Date()) {
      return res.status(400).json({ message: "Verification token has expired" });
    }

    user.emailVerified = true;
    user.verificationToken = null; // Clear the token after verification
    user.verificationTokenExpires = null; // Clear the expiration date
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = { signUp, signIn, verifyEmail };
