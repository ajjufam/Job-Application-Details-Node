const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
} = require("../controllers/user.controller");
// const validateUser = require("../validations/user-register.validation");
const validateRequest = require("../middlewares/validateRequest");

const {
  userRegisterValidation,
  userLoginValidation,
  userUpdatePassword,
} = require("../validations/user.validation");

router.post("/register", validateRequest(userRegisterValidation), registerUser);
router.post("/login", validateRequest(userLoginValidation), loginUser);
router.put(
  "/update-password",
  validateRequest(userUpdatePassword),
  updatePassword
);

module.exports = router;
