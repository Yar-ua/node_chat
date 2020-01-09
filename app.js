require('dotenv').config();

var express = require('express');
var http = require('http');

// var createError = require('http-errors');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var logger = require('morgan');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var HttpError = require('./error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.text({ type: 'text/html' })); // for application/text-html
app.use(bodyParser.json({ type: 'application/*+json' })); // for application/json
app.use(bodyParser.urlencoded({ extended: false })); // for encoding URL
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middleware/sendHttpError'));

app.use(express.Router());


require('./routes')(app);


// all my environment
app.set('port', process.env.port || config.get('port'));

//create server
http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});


// Error handler
app.use(function(err, req, res, next){
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});
