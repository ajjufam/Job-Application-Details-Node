const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/user.controller");
const validateUser = require("../validations/user.validation");
const validateRequest = require("../middlewares/validateRequest");

router.post("/register", validateRequest(validateUser), registerUser);

module.exports = router;
