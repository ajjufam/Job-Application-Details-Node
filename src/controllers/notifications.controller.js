const UserNotification = require("../models/notifications.model");
const logger = require("../middlewares/logger");
const {
  userSendNotification,
} = require("../validations/notification.validation");

const sendNotification = async (email, subject, msg) => {
  try {
    logger.info("Sending notification", { email, subject });

    // Prepare notification object
    const notification = {
      subject,
      msg,
      dateAndTime: new Date(),
    };

    // Find user notification entry
    let userNotification = await UserNotification.findOne({ email });

    if (userNotification) {
      // Append to existing notifications
      userNotification.notifications.push(notification);
    } else {
      // Create a new notification entry
      userNotification = new UserNotification({
        email,
        notifications: [notification],
      });
    }

    // Save to DB
    await userNotification.save();
    logger.info("Notification saved successfully", { email });
  } catch (error) {
    logger.error("Error saving notification", { error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const email = req.params.email;
    logger.info(`Request received from ${email} to get notifications`);

    //Find user by email
    const userNotifications = await UserNotification.findOne({ email: email });
    if (!userNotifications || userNotifications.notifications.length == 0) {
      logger.warn("No notifications available for this user");
      return res.status(404).json({
        statusCode: 404,
        message: "No notifications available for this user",
      });
    }

    logger.info("Notifications found");
    return res.status(200).json({
      statusCode: 200,
      message: "Notifications found",
      data: userNotifications,
    });
  } catch (error) {
    logger.error("Server error during get notifications", {
      error: error.message,
    });
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { sendNotification, getNotifications };
