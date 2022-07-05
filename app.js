require('dotenv').config();

var app = require('./loader');

var http = require('http');
var errorHandler = require('errorhandler');
var config = require('./config');
var log = require('./lib/log')(module);
var logger = require('morgan');
var createHttpError = require('http-errors');
var HttpError = require('./error').HttpError;

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

require('./routes')(app);

app.use(function(req, res) {
  res.status(404).send("Page Not Found");
});

app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }
  
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (process.env.NODE_ENV == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

var server = http.createServer(app);
server.listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

require('./socket')(server);
