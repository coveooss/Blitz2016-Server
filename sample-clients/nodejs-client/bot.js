var open = require("open");

var MapUtils = require('./map');
var Types = require('./types');

var directions = ["north", "south", "east", "west", "stay"];
var first = true;
function bot(state, callback) {
    if (first) {
        console.log('Open Browser at ' + state.viewUrl);
        open(state.viewUrl);
        first = false;
    }

    var map = MapUtils.parseBoard(state.game.board);
    var dir = directions[Math.floor(Math.random() * directions.length)];
    console.log(dir);

    callback(null, dir);
};


module.exports = bot;
if (require.main === module)
    require('./client/index').cli(bot);