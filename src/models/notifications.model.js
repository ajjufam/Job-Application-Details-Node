const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  msg: { type: String, required: true },
  dateAndTime: { type: Date, default: Date.now },
});

const userNotificationSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  notifications: [notificationSchema],
});

const UserNotification = mongoose.model(
  "UserNotification",
  userNotificationSchema
);

module.exports = UserNotification;
