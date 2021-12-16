const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
var https = require('https');
const path = require('path');
const fs = require('fs');

const key = fs.readFileSync(path.join(__dirname, 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'server.cert'));
 
const options = { key, cert };

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB'); 
  https.createServer(options, app).listen(3001, () => {
    console.log('App is running !');
  });
});

