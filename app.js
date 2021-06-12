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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}


http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

// Middleware
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















// var log = require('./lib/log')(module);
// // var logger = require('morgan');


// var app = express();

// // app.use(logger('dev'));
// // app.engine('ejs', require('ejs-locals'));
// // app.set('views', __dirname + '/template');
// // app.set('view engine', 'ejs');

// // app.use(express.favicon());

// // if (app.get('env') == 'development') {
// //   app.use(express.logger('dev'));
// // } else {
// //   app.use(express.logger('default'));
// // }

// // app.use(express.bodyParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser);
// app.use(express.Router());

// // app.get('/', function(req, res, next) {
// //   // res.render("index");
// //   res.send("index");
// // });

// app.use(function(req, res) {
//   res.send(404, "Page Not Found Sorry");
// });




// // app.use(express.static(path.join(__dirname, 'public')));

// // app.use(function(err, req, res, next) {
// //   if (app.get('env') == 'development') {
// //     var errorHandler = require('errorhandler');
// //     errorHandler(err, req, res, next);
// //   } else {
// //     res.send(500);
// //   }
// // });

// /*
// var routes = require('./routes');
// var user = require('./routes/user');

// // all environments

// app.get('/', routes.index);
// app.get('/users', user.list);
// */


// http.createServer(app).listen(config.get('port'), function(){
//   // log.info('Express server listening on port ' + config.get('port'));
//   console.log('Express server listening on port ' + config.get('port'));
// });

