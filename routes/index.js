var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var ObjectID = require('mongodb').ObjectId; //TODO fix it, problems with name object id and model ids

module.exports = function(app) {
  app.use(function(req, res, next) {
    if (req.url == '/') {
      res.status(200).send("Hello");
    } else {
      next();
    }
  });
  
  app.get('/users', function(req, res, next){
    users = User.find({}, function(err, users){
      if (err) return next(err);
      res.json(users);
    });
  });
  
  app.get('/user/:id', function(req, res, next) {
    try {
      var id = new ObjectID(req.params.id);
    } catch (e) {
      next(404);
      return;
    }

    User.findById(id, function(err, user) { // ObjectID
      if (err) return next(err);
      if (!user) {
        return next(404);
      }
      res.json(user);
    });
  });
}