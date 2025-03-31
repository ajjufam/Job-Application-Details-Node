const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const logger = require("../middlewares/logger");

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Application Tracker API",
      version: "1.0.0",
      description: "API documentation for Job Application Tracker",
    },
    servers: [
      {
        url: "http://localhost:7000/api/v1/job/app/tracker", // Base URL for your APIs
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/config/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info("Swagger docs available at http://localhost:7000/api-docs");
};

module.exports = setupSwagger;
