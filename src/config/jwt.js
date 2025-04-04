const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

module.exports = { generateToken };
