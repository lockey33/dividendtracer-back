const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require('fs');
const path = require('path');

var privateKey  = fs.readFileSync(path.join(__dirname, 'letsencrypt/live/dividendtracer.com/privkey.pem'));
var certificate = fs.readFileSync(path.join(__dirname, 'letsencrypt/live/dividendtracer.com/cert.pem'));

var credentials = {key: privateKey, cert: certificate};

let server = https.createServer(credentials, app);

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(3001, () => {
    logger.info(`Listening to port 3001`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
