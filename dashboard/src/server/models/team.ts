///<reference path="../../shared/shared.d.ts" />
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var schema = new mongoose.Schema({
    name: String,
    unlockedAchievements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Achievement'}],
    members: [],
    endpoint: String,
    password: String,
    ready: Boolean,
    uiScore: Number,
    number: Number,
    image: String
});

schema.plugin(findOrCreate);

mongoose.model('Team', schema);