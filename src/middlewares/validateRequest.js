const validateRequest = (schema) => (req, res, next) => {
  if (!schema || typeof schema.validate !== "function") {
    return res
      .status(500)
      .json({ error: "Invalid validation schema provided." });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((err) => err.message) });
  }

  next();
};

module.exports = validateRequest;
