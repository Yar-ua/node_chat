var User = require('./models/user').User;

var user = new User({
  username: "Tester",
  password: "secret"
});

user.save(function(err, user, affected){
  if (err) throw err;

  User.findOne({username: "Tester"}, function(err, tester){
    console.log(tester);
  })
  console.log(arguments);
})


// user.save();





// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/node_chat');

// const catSchema = new mongoose.Schema({
//   name: String
// });

// const Cat = mongoose.model('Cat', catSchema);

// var kitty = new Cat({
//   name: "Tom"
// });

// console.log(kitty);

// kitty.save(function(err, kitty, affected){
//   console.log(arguments);
// })





// const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// const dbName = 'node_chat';

// client.connect();
// console.log('Connected successfully to server');
// const db = client.db(dbName);
// const collection = db.collection('test_insert');
// collection.insertOne({a:2}, function(err, docs){
//   collection.count(function(err, count){
//     console.log("conunt = %s", count);
//   });

//   collection.find().toArray(function(err, results){
//     console.dir(results);
//     client.close();
//   })
// })

// console.log('done.');
