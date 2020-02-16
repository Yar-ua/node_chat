var log = require('../libs/log')(module);
var sessionStore = require('../libs/sessionStore');
var async = require('async');
var connect = require('connect');
var cookie = require('cookie');
var config = require('../config');
var HttpError = require('../error').HttpError;
var cookieParser = require('cookie-parser')
var User = require('../models/user').User;

function loadSession(sid, callback){

  // sessionStore callback is not in async type
  sessionStore.load(sid, function(err, session){
    if (arguments.length == 0) {
      //no arguments -> no session
      return callback(null, null);
    } else {
      return callback(null, session);
    }
  });

};

function loadUser(session, callback){

  if (!session) {
    log.warn("Session %s is anonymous", session.id);
    return callback(null, null);
  }

  log.info("Retrieving user ", session.user);

  User.findById(session.user, function(err, user){

    if (err) return callback(err);

    if (!user) return callback(null, null);
      
    log.info("user findById result: " + user);
    callback(null, user);
  });
  
};

module.exports = function(server){

  var io = require('socket.io')(server);

  io.set('origins', 'localhost:*');
  io.set('logger', log);

  io.set('authorization', function(handshake, callback){
    async.waterfall([
      function(callback){
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        var sidCookie = handshake.cookies[config.get('session:key')];
        var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        loadSession(sid, callback);
      },

      function(session, callback) {

        if (!session) {
          callback(new HttpError(401, "No session"));
        }

        handshake.session = session;
        loadUser(session, callback);

      },

      function(user, callback) {
        if (!user) {
          callback(new HttpError(403, "Anonymous session cannnot connect"));
        }

        handshake.user = user;
        callback(null);
      }

    ], function(err){
      if (!err) {
        return callback(null, true);
      }

      if (err instanceof HttpError) {
        return callback(null, false)
      }

      callback(err);
    });
    
  });

  io.sockets.on('session:reload', function(sid){
    var clients = io.sockets.clients();

    clients.forEach(function(client){
      if (client.handshake.session.id != sid) return;

      loadSession(sid, function(err, session){
        if (err) {
          client.emit("error", "server error");
          client.disconnect();
          return;
        }

        if (!session) {
          client.emit("logout");
          client.disconnect();
          return;
        }

        client.handshake.session = session;
      });

    });
    
  });

  io.sockets.on('connection', function(socket){
    /*
    in old socket version to get handsheke here was possible in next method
    var username = socket.handshake.user.get('username');
    in new ver. handshake what coming here is not updated (without 'user' data)
    and it nesessary to reload handshake in this method
    var handshake = socket.request;
    */
    
    var handshake = socket.request;
    var username = handshake.user.get('username');

    socket.broadcast.emit('join', username);

    socket.on('message', function(text, cb){
      socket.broadcast.emit('message', username, text);
      cb && cb();
    });

    socket.on('disconnect', function(){
      socket.broadcast.emit('leave', username);
    });

  });

  return io;
};