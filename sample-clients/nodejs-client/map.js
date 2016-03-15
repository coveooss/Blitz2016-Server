var Types = require('./types');

/* get type for a pair of char */
function getType(a, b) {
    if (isNothing(a, b)) {
        return Types.Nothing;
    } else if (isTree(a, b)) {
        return Types.Tree;
    } else if (isPlayer(a, b)) {
        return Types.Player;
    } else if (isMine(a, b)) {
        return Types.Mine;
    } else if (isTavern(a, b)) {
        return Types.Tavern;
    } else if (isSpike(a, b)) {
        return Types.Spike;
    } else {
        return Types.Unknown
    }
}

/* helper functions */
function isNothing(a, b) {
    return a == ' ' && b == ' ';
}
function isTree(a, b) {
    return a == '#' && b == '#';
}
function isPlayer(a, b) {
    return a == '@';
}
function isMine(a, b) {
    return a == '$';
}
function isSpike(a, b) {
    return a == '^' && b == '^';
}
function isTavern(a, b) {
    return a == '[' && b == ']';
}

/* magic map parsing */
exports.parseBoard = function (board) {
    var map = [];
    var size = board.size;

    var tiles = board.tiles;
    var x = 0;
    var y = 0;
    map[0] = [];
    for (var idx = 0; idx < size * size; idx++) {
        var strIdx = idx * 2;
        var chr = tiles.slice(strIdx, strIdx + 2);
        var type = getType(chr[0], chr[1]);

        map[x][y] = type;

        y++;
        if (y >= size) {
            y = 0;
            x++;
            map[x] = [];
        }
    }

    return map;
};