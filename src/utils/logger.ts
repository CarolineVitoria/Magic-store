import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'src/logs/error.json',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'src/logs/app.json',
      level: 'info',
      options: { flags: 'a' },
    }),
  ],
});

export default logger;
