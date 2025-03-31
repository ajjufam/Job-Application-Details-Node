const Joi = require("joi");
const { UserRoleEnum } = require("../../enums");

const userRegisterValidation = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/
    )
    .required(),
  phoneNo: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required(),
  role: Joi.string()
    .valid(...Object.values(UserRoleEnum))
    .required(),
  reportingManager: Joi.alternatives().conditional("role", {
    is: UserRoleEnum.SUPERADMIN,
    then: Joi.valid(null),
    otherwise: Joi.string().length(24).required(),
  }),
});

const userLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/
    )
    .required(),
});

const userUpdatePassword = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/
    )
    .required(),
  newPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/
    )
    .disallow(Joi.ref("oldPassword")) // Prevents new password from being the same as old
    .required()
    .messages({
      "any.invalid": "New password must be different from old password",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword")) // Ensures it matches newPassword
    .required()
    .messages({ "any.only": "Confirm password must match new password" }),
});

const userUpdateRoll = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(UserRoleEnum))
    .required(),
});

const userUpdareReportingManager = Joi.object({
  email: Joi.string().email().required(),
  reportingManager: Joi.string().length(24).required(),
});

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  userUpdatePassword,
  userUpdateRoll,
  userUpdareReportingManager,
}; // ✅ Export the schema directly
