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
  validateRequest(userUpdatePassword),
  updatePassword
);
router.put("/update-role", validateRequest(userUpdateRoll), updateRoll);
router.put(
  "/update-reporting-manager",
  validateRequest(userUpdareReportingManager),
  updateReportingManager
);

module.exports = router;
