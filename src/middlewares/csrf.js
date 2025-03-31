const CSRF = require("csrf");
const tokens = new CSRF();

module.exports = (req, res, next) => {
  // Ensure CSRF Secret exists in cookies
  const secret = req.cookies.csrfSecret;
  if (!secret) {
    return res.status(403).json({ message: "CSRF Secret missing" });
  }

  // Bypass CSRF check for GET requests
  if (req.method === "GET") {
    return next();
  }

  // Get the CSRF token from the request header
  const csrfToken = req.headers["x-csrf-token"];

  if (!csrfToken || !tokens.verify(secret, csrfToken)) {
    return res.status(403).json({ message: "Invalid or missing CSRF token" });
  }

  next();
};
