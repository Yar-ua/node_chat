var mongoose = require('mongoose');
var config = require('../config');

// mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
mongoose.connect(config.get('mongoose:uri'));
mongoose.set('debug', true);

module.exports = mongoose;
