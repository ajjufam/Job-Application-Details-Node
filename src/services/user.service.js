const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { UserRoleEnum } = require("../../enums");
const userValidation = require("../validations/user.validation");

const createUser = async (data) => {
  // Validate user input
  const { error, value } = userValidation.validate(data);
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(", "));
  }
  const existUser = await User.findOne({ email: value.email });
  if (existUser) {
    throw new Error("Email already exists.");
  }

  // Check if it's the first user in DB
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    value.role = UserRoleEnum.SUPERADMIN;
    value.reportingManager = null;
  }

  // Hash password if exists
  if (value.password) {
    value.password = await bcrypt.hash(value.password, 10);
  }

  // Create user
  return await User.create(value);
};

module.exports = { createUser };
