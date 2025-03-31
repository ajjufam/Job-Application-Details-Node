const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
  updateRoll,
  updateReportingManager,
} = require("../controllers/user.controller");
const validateRequest = require("../middlewares/validateRequest");
const verifyToken = require("../middlewares/auth");
const {
  userRegisterValidation,
  userLoginValidation,
  userUpdatePassword,
  userUpdateRoll,
  userUpdareReportingManager,
} = require("../validations/user.validation");

router.post("/register", validateRequest(userRegisterValidation), registerUser);
router.post("/login", validateRequest(userLoginValidation), loginUser);
router.put(
  "/update-password",
  verifyToken,
  validateRequest(userUpdatePassword),
  updatePassword
);
router.put(
  "/update-role",
  verifyToken,
  validateRequest(userUpdateRoll),
  updateRoll
);
router.put(
  "/update-reporting-manager",
  verifyToken,
  validateRequest(userUpdareReportingManager),
  updateReportingManager
);

module.exports = router;
