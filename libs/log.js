require('dotenv').config();

var winston = require('winston');
var ENV = process.env.NODE_ENV;

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

function getLogger(module){

	var path = module.filename.split('/').slice(-2).join('/');

	return new winston.createLogger({
    format: combine(
      format.simple(),
      format.label({ label: path })
    ),
  	transports: [
  		new winston.transports.Console({
          format: format.combine(
          format.colorize(),
          // format.level((ENV == 'development') ? 'debug' : 'error'),
          format.simple()
        )
      })
  	]
  });
}

module.exports = getLogger;
