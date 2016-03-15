/// <reference path='../../../definitions/tsd.d.ts' />

var mongoose = require('mongoose');
var secrets: any = require('../config/secrets');

mongoose.connect(secrets.db);

require('../models/team');
var teams = require('./teams');
teams.generate(10);

require('../models/achievements');
var achievements = require('./achievements');
achievements.generate(30);