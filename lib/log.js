var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

function getLogger(module){
	var path = module.filename.split('/').slice(-2).join('/');
	return new createLogger({
    format: combine(
    label({ label: path }),
    timestamp(),
    myFormat
    ),
  	transports: [
  		new winston.transports.Console({
          format: format.combine(
          format.colorize(),
          format.simple()
        )
      })
  	]
  });
}

module.exports = getLogger;