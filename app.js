var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');


// var createError = require('http-errors');
require('dotenv').config();
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var errorHandler = require('errorhandler')();

// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();


// all my environment
app.set('port', process.env.port || config.get('port'));

//create server
http.createServer(app).listen(app.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

// Middleware
app.use(function(req, res, next){
  if (req.url == '/') {
    res.send('Hola!');
  } else {
    next();
  }  
});

app.use(function(req, res, next){
  if (req.url == '/forbidden') {
    next(new Error('Access denied'));
  } else {
    next();
  }  
});

app.use(function(req, res, next){
  if (req.url == '/test') {
    res.send('Test!');
  } else {
    next();
  }  
});

// Error handler
app.use(function(err, req, res, next){
  // NODE_ENV
  if (app.get('env') == 'development') {
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

app.use(function(req, res, next){
    res.send(404, 'no page');  
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//bodyparser
//methodOverride
// app.use(cookieParser());
// //session
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(app)
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
