var express = require('express');
var path = require('path');
var session = require('express-session');
var errorHandler = require('errorhandler');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var app = express();
var createHttpError = require('http-errors');
var HttpError = require('./error').HttpError;
var sessionStore = require('./lib/sessionStore');

app.use(bodyParser.text({ type: 'text/html' })); // for application/text-html
app.use(bodyParser.json({ type: 'application/*+json' })); // for application/json
app.use(bodyParser.urlencoded({ extended: false })); // for encoding URL
app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.Router());

module.exports = app;