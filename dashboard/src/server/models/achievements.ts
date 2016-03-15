///<reference path="../../shared/shared.d.ts" />
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Team = mongoose.model('Team');

var schema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    hidden: Boolean,
    unlocked: Boolean,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

schema.plugin(findOrCreate);

mongoose.model('Achievement', schema);