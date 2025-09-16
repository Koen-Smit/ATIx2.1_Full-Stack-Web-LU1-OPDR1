/** info, debug, error
 * logger.info({ label: "APP", message: "Test successful" }); -> Green text
 * logger.debug({ label: "AUTH", message: `User ${userId} logged in` }); -> Blue text
 * logger.error({ label: "DB", message: `Connection failed: ${err.message}` }); -> Red text
*/

const winston = require("winston");

const { combine, timestamp, printf, colorize, align } = winston.format;



const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    printf((info) => {
      const label = info.label || "APP";
      return `[${info.timestamp}] [${label}] ${info.level}: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;


