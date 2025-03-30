const userService = require("../services/user.service");

const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };
