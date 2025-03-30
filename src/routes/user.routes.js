const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/user.controller");
// const validateUser = require("../validations/user-register.validation");
const validateRequest = require("../middlewares/validateRequest");

const {
  userRegisterSchema,
} = require("../validations/user-register.validation");

router.post("/register", validateRequest(userRegisterSchema), registerUser);

module.exports = router;
