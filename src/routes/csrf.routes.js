const express = require("express");
const router = express.Router();
const CSRF = require("csrf");

const tokens = new CSRF();

router.get("/csrf-token", (req, res) => {
  const secret = req.cookies.csrfSecret;
  if (!secret) {
    return res.status(400).json({ message: "CSRF Secret not found" });
  }
  const token = tokens.create(secret);
  res.json({ csrfToken: token });
});

// ⏳⏳⏳ WITH EXPIRY TIME ⏳⏳⏳

// router.get("/csrf-token", (req, res) => {
//     // Generate a CSRF secret
//     const secret = tokens.secretSync();
//     res.cookie("csrfSecret", secret, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//       sameSite: "Strict",
//       maxAge: 15 * 60 * 1000, // Set cookie expiration to 15 minutes
//     });

//     // Generate CSRF token using the secret
//     const csrfToken = tokens.create(secret);

//     res.json({ csrfToken });
//   });

module.exports = router;
