require('dotenv').config();
var express = require('express');
var http = require('http');
var path = require('path');
var errorHandler = require('errorhandler');
var config = require('./config');
var log = require('./lib/log')(module);
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var app = express();

var routes = require('./routes');
var user = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
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

app.get('/', routes.index);
// app.get('/users', user.list);


http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

app.use(function(req, res, next) {
  if (req.url == '/') {
    res.status(200).send("Hello");
  } else {
    next();
  }
});

app.use(function(req, res) {
  res.status(404).send("Page Not Found");
});

app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    app.use(errorHandler());
    errorHandler(err, req, res, next);
  } else {
    res.status(500);
  }
});
