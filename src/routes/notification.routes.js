const express = require("express");
const { getNotifications } = require("../controllers/notifications.controller");
const router = express.Router();
const verifyToken = require("../middlewares/auth");

router.get("/notification/:email", verifyToken, getNotifications);

module.exports = router;
