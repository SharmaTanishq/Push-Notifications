import winston from "winston";
import { config } from "./config";

import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
    filename: `${config.LOG_DIR_PATH}/push-notifications-logs/` + 'push-notifications-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    //zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d'
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json({ space: 4 }),
    // winston.format.printf((info) => `${info.timestamp} ${info.level} ${info.message}`)
),
transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: EnvConfig.LOG_DIR_PATH })
    transport
],
});

export default logger;