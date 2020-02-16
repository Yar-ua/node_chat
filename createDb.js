var mongoose = require('./libs/mongoose');
var async = require('async');

async.series([
  open,
  dropDatabase,
  createUsers
], function(err){
  console.log(arguments);
  mongoose.disconnect();
});

function open(callback){
  mongoose.connection.on('open', callback);
};

function dropDatabase(callback){
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
};

function createUsers(callback){
  require('./models/user');

  var users = [
    {username: 'Вася', password: 'supervasya'},
    {username: 'Петя', password: '123'},
    {username: 'admin', password: 'thetruehero'}
  ];
  async.each(users, function(userData, callback){
    var user = new mongoose.models.User(userData);
    user.save(callback);
  }, callback);
};

