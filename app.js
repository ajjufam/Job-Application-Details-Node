require("dotenv").config();
const express = require("express");
const connection = require("./src/config/db");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const logger = require("./src/middlewares/logger");
const port = process.env.PORT || 7000;
const userRoutes = require("./src/routes/user.routes");
const setupSwagger = require("./src/config/swagger");

app.use("/api/v1/job/app/tracker/users", userRoutes);

setupSwagger(app);
connection();
app.listen(port, () => {
  logger.info(`Server listening on port number ${port}`);
});
