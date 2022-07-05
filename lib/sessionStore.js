var mongoose = require('mongoose');
var express = require('express');
var MongoStore = require('connect-mongo');
var config = require('../config')
sessionStore = MongoStore.create({mongoUrl: config.get('mongoose:uri')});

module.exports = sessionStore;