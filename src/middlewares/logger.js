const pino = require("pino");

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

module.exports = logger;

//NOTE : Install Both
// 1) npm i pino
// 2) npm install pino-pretty --save-dev
