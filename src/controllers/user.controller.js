const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { UserRoleEnum } = require("../../enums");
const {
  userRegisterValidation,
  userLoginValidation,
  userUpdatePassword,
} = require("../validations/user.validation");
const logger = require("../middlewares/logger");
const { generateToken } = require("../config/jwt");

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    logger.info("Register user request receiver", { email: req.body.email });
    // Validate user input
    const { error, value } = userRegisterValidation.validate(req.body);
    if (error) {
      logger.warn("User registration failed", { error: error.details });
      return res.status(400).json({
        statusCode: 400,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    logger.info("User input validation successfull");

    // Check if user already exists
    const existUser = await User.findOne({ email: value.email });
    if (existUser) {
      logger.warn("User registration failed, Email already exists", {
        email: value.email,
      });
      return res.status(400).json({
        statusCode: 400,
        message: "Email already exists.",
      });
    }

    // Prevent multiple superadmins
    if (
      value.role?.toLowerCase() === "superadmin" &&
      (await User.exists({ role: "superadmin" }))
    ) {
      logger.warn("Attempt to create multiple superadmins prevented");
      return res.status(400).json({
        statusCode: 400,
        message: "Superadmin already exists. Cannot override.",
      });
    }

    // If it's the first user, make them SUPERADMIN
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      value.role = UserRoleEnum.SUPERADMIN;
      value.reportingManager = null;
      logger.info("First user detected - assigning SUPERADMIN role");
    }

    // Hash password
    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
      logger.info("User password hashed successfully");
    }

    // Create user
    const user = await User.create(value);
    logger.info("User registered successfully", {
      userId: user._id,
      email: user.email,
    });
    return res.status(201).json({
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    logger.error("Server error during user registration", {
      error: error.message,
    });
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    logger.info("User login request received", { email: req.body.email });
    const { error, value } = userLoginValidation.validate(req.body);
    if (error) {
      logger.warn("User Login failed", { error: error.details });
      return res.status(400).json({
        statusCode: 400,
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    //Find User by email
    logger.info("Finding user by email");
    const user = await User.findOne({ email: value.email });
    if (!user) {
      logger.warn("Invalid email");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email or password",
      });
    }

    //Check password
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      logger.warn("Invalid Password");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email or password",
      });
    }

    //Generate Token
    const token = generateToken({
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      phoneNo: user.phoneNo,
    });
    logger.info("Login Successful, token generated", {
      user: { id: user._id, email: user.email, role: user.role },
    });

    return res.status(200).json({
      message: "Login successfull",
      data: {
        statusCode: 200,
        user: { id: user._id, email: user.email, role: user.role },
        token: token,
      },
    });
  } catch (error) {
    logger.error("Server error during user login", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    logger.info("Update password request received");
    const { error, value } = userUpdatePassword.validate(req.body);
    if (error) {
      logger.warn("Failed to update password", { error: error.details });
      return res.status(400).json({
        statusCode: 400,
        message: error.details.map((err) => err.message.join(", ")),
      });
    }

    logger.info("input validation successfull");

    //find user by email
    logger.info("Finding user by email");
    const user = await User.findOne({ email: value.email });
    if (!user) {
      logger.warn("Invalid email");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email or password",
      });
    }

    //check old password
    const oldPassword = await bcrypt.compare(value.oldPassword, user.password);
    if (!oldPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email or password",
      });
    }

    logger.info("Hashing password");
    const hasedPassword = await bcrypt.hash(value.newPassword, 10);

    logger.info("Updating password in Database");
    user.password = hasedPassword;
    await user.save();

    logger.info("Password updated successfully");
    return res.status(200).json({
      statusCode: 200,
      message: "password updated successfully",
    });
  } catch (error) {
    logger.error("Server error during update password", {
      error: error.message,
    });
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, updatePassword };
