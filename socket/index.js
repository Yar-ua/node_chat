var log = require('../lib/log').module;

module.exports = function(server){
  var io = require('socket.io')(server, {
    cors: {
      origin: process.env.HOST
    },
    logger: log
  });
    
  io.sockets.on('connection', function(socket) {
    socket.on('message', function(text, cb) {
        socket.broadcast.emit('message', text);
        cb();
    })
  })
}
