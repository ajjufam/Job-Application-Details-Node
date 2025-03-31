const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { UserRoleEnum } = require("../../enums");
const {
  userRegisterValidation,
  userLoginValidation,
  userUpdatePassword,
  userUpdateRoll,
  userUpdareReportingManager,
} = require("../validations/user.validation");
const logger = require("../middlewares/logger");
const { generateToken } = require("../config/jwt");
const { sendNotification } = require("./notifications.controller");

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

    await sendNotification(
      user.email,
      "Welcome to the System!",
      "Your account has been successfully created."
    );
    logger.info("Notification sent");

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

    await sendNotification(
      user.email,
      "Logged In!",
      "You have successfully logged in."
    );
    logger.info("Notification sent");

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
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update password
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

    logger.info("input validation successful");

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

    await sendNotification(
      user.email,
      "Password Updated!",
      "You have successfully changed your password."
    );
    logger.info("Notification sent");

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
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update Roll
const updateRoll = async (req, res) => {
  try {
    logger.info("Update Role request received");
    const { error, value } = userUpdateRoll.validate(req.body);
    if (error) {
      logger.warn("Failed to update roll", { error: error.details });
      return res.status(400).json({
        statusCode: 400,
        message: error.details.map((err) => err.message.join(", ")),
      });
    }

    logger.info("input validation successful");

    //find user by email
    logger.info("Finding user by email");
    const user = await User.findOne({ email: value.email });
    if (!user) {
      logger.warn("Invalid email");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email",
      });
    }
    const oldRole = user.role;

    //Make sure superadmin role can not be override
    const superadmin = await User.findOne({ role: "superadmin" });
    if (superadmin && value.role == "superadmin") {
      logger.warn("Superadmin role can not be override");
      return res.status(400).json({
        statusCode: 400,
        message: "superadmin role can not be override",
      });
    }

    //update role
    logger.info("updating role in DB");
    user.role = value.role;
    await user.save();

    await sendNotification(
      user.email,
      "Role Updated!",
      `Your role successfully changed from ${oldRole} to ${value.role}.`
    );
    logger.info("Notification sent");

    logger.info("Role updated successfully");
    return res.status(200).json({
      statusCode: 200,
      message: "Role updated successfully",
    });
  } catch (error) {
    logger.error("Server error during update role", { error: error.message });
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update Reporting manager
const updateReportingManager = async (req, res) => {
  try {
    logger.info("Update reporting manager request received");

    // Validate input
    const { error, value } = userUpdareReportingManager.validate(req.body);
    if (error) {
      logger.warn("Error while updating reporting manager", {
        error: error.details,
      });
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    logger.info("Input validation successful");

    // Find user
    logger.info("Finding user by email");
    const user = await User.findOne({ email: value.email });
    if (!user) {
      logger.warn("Invalid email");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email",
      });
    }
    const oldReportingManager = user.reportingManager;

    // Find the reporting manager
    logger.info("Finding reporting manager by ID");
    const reportingManager = await User.findById(value.reportingManager);
    if (!reportingManager) {
      logger.warn("Invalid reporting manager ID");
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid reporting manager ID",
      });
    }

    // 🚀 **Role-based validation**
    if (user.role === "superadmin") {
      logger.warn("Superadmin does not require a reporting manager");
      return res.status(400).json({
        statusCode: 400,
        message: "Superadmin does not require a reporting manager",
      });
    }

    if (user._id.equals(reportingManager._id)) {
      logger.warn("Reporting manager cannot be self");
      return res.status(400).json({
        statusCode: 400,
        message: "Reporting manager cannot be self",
      });
    }

    if (["employee", "candidate"].includes(reportingManager.role)) {
      logger.warn("Employees and Candidates cannot be a reporting manager");
      return res.status(400).json({
        statusCode: 400,
        message: "Employees and Candidates cannot be a reporting manager",
      });
    }

    if (user.role === "admin" && reportingManager.role !== "superadmin") {
      logger.warn("Admin's reporting manager must be a Superadmin");
      return res.status(400).json({
        statusCode: 400,
        message: "Admin's reporting manager must be a Superadmin",
      });
    }

    // 🚀 **Update Reporting Manager**
    logger.info("Updating Reporting Manager in DB");
    user.reportingManager = value.reportingManager;
    await user.save();

    await sendNotification(
      user.email,
      "Reporting Manager Updated!",
      `Your Reporting manager successfully changed from ${oldReportingManager} to ${value.reportingManager}.`
    );
    logger.info("Notification sent");

    logger.info("Reporting manager updated successfully");
    return res.status(200).json({
      statusCode: 200,
      message: "Reporting manager updated successfully",
    });
  } catch (error) {
    logger.error("Server error while updating reporting manager", {
      error: error.message,
    });
    return res.status(500).json({
      statusCode: 500,
      message: "Server error while updating reporting manager",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  updateRoll,
  updateReportingManager,
};
