require('dotenv').config();
var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
const MongoStore = require('connect-mongo');
var errorHandler = require('errorhandler');
var config = require('./config');
var log = require('./lib/log')(module);
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var app = express();
var createHttpError = require('http-errors');
var mongoose = require('mongoose');
var HttpError = require('./error').HttpError;

app.use(bodyParser.text({ type: 'text/html' })); // for application/text-html
app.use(bodyParser.json({ type: 'application/*+json' })); // for application/json
app.use(bodyParser.urlencoded({ extended: false })); // for encoding URL
app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: MongoStore.create({mongoUrl: config.get('mongoose:uri')})
}));

app.use(require('./middleware/sendHttpError'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.Router());

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

require('./routes')(app);

// app.use(function(req, res, next) {
//   req.session.numberOfVisits = req.sessions.numberOfVisits + 1 || 1;
//   console.log("Visits = " + req.session.numberOfVisits);
// });

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


http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});