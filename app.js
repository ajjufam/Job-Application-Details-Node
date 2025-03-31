require("dotenv").config();
const express = require("express");
const connection = require("./src/config/db");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const logger = require("./src/middlewares/logger");
const port = process.env.PORT || 7000;
const userRoutes = require("./src/routes/user.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const setupSwagger = require("./src/config/swagger");
const cookieParser = require("cookie-parser");
const csrfMiddleware = require("./src/middlewares/csrf");
const csrfRoutes = require("./src/routes/csrf.routes");

//Cookie-Parser
app.use(cookieParser());

app.use(csrfMiddleware);

app.use("/api/v1/job/app/tracker/users", userRoutes);
app.use("/api/v1/job/app/tracker/users", notificationRoutes);
app.use("/api/v1/job/app/tracker", csrfRoutes);

setupSwagger(app);
connection();
app.listen(port, () => {
  logger.info(`Server listening on port number ${port}`);
});
