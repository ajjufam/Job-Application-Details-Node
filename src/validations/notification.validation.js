const Joi = require("joi");

const userSendNotification = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(50).required(),
  msg: Joi.string().min(3).required(),
});

module.exports = {
  userSendNotification,
};
