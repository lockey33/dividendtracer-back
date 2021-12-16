const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
var http = require('http');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  http.createServer(app).listen(3001, () => {
    console.log('server running at ' + 3001)
  });
});

