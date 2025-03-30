const mongoose = require("mongoose");
const logger = require("../middlewares/logger");

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    logger.info("Connected to DB");
  } catch (error) {
    logger.error("Error while connecting to DB", error.message);
  }
};

module.exports = connection;
