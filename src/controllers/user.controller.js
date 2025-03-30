const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserRoleEnum } = require("../../enums");
const {
  userRegisterSchema,
} = require("../validations/user-register.validation");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    // Validate user input
    const { error, value } = userRegisterSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message).join(", ") });
    }

    // Check if user already exists
    const existUser = await User.findOne({ email: value.email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Prevent multiple superadmins
    if (
      value.role?.toLowerCase() === "superadmin" &&
      (await User.exists({ role: "superadmin" }))
    ) {
      return res
        .status(400)
        .json({ message: "Superadmin already exists. Cannot override." });
    }

    // If it's the first user, make them SUPERADMIN
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      value.role = UserRoleEnum.SUPERADMIN;
      value.reportingManager = null;
    }

    // Hash password
    if (value.password) {
      value.password = await bcrypt.hash(value.password, 10);
    }

    // Create user
    const user = await User.create(value);
    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login User
// const loginUser = async (req, res) => {
//   try {
//     // Validate input
//     const { error, value } = userLoginValidationSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ message: error.details.map((err) => err.message).join(", ") });
//     }

//     // Find user by email
//     const user = await User.findOne({ email: value.email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(value.password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       SECRET_KEY,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful.",
//       data: {
//         token,
//         user: { id: user._id, email: user.email, role: user.role },
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

module.exports = { registerUser };
