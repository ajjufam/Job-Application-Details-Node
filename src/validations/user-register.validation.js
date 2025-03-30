const Joi = require("joi");
const { UserRoleEnum } = require("../../enums");

const userRegisterSchema = Joi.object({
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

module.exports = { userRegisterSchema }; // ✅ Export the schema directly
