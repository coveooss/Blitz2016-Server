function client(e, t) {
    function r(e) {
        function o(t, a) {
            process.nextTick(function () {
                if (t)return n(t);
                switch (u && u("turn", e), a || (a = ""), a.toLowerCase()) {
                    case"n":
                    case"north":
                        a = "North";
                        break;
                    case"e":
                    case"east":
                        a = "East";
                        break;
                    case"s":
                    case"south":
                        a = "South";
                        break;
                    case"w":
                    case"west":
                        a = "West";
                        break;
                    default:
                        a = "Stay"
                }
                var o = {key: s, dir: a};
                gameRequest(e.playUrl, o, function (e, t) {
                    e ? n(e) : r(t)
                })
            })
        }

        if (e.context = i, u && e.game.turn < 4 && u("start", e), e.game.finished)return u && u("end", e), t(null, e);
        try {
            a(e, o)
        } catch (c) {
            o(c)
        }
    }

    function n(e) {
        u && u("error", e), t(e)
    }

    var a = e.bot, s = e.key, o = e.mode, u = e.log, i = e.context || {}, c = e.serverUrl || "http://perdu.com", f = e.signalMaster, l = e.arenaId;
    if ("function" != typeof a)throw new Error("bot must be set");
    if ("string" != typeof s)throw new Error("key must be set");
    if ("arena" !== o && "training" !== o)throw new Error("mode must be set to arena or training");
    u && u("queue");
    var m = {key: s};
    "training" === o && (e.turns && (m.turns = e.turns), e.map && (m.map = e.map));
    var p = c + "/api/" + o;
    l && (p += "?gameId=" + l), gameRequest(p, m, function (e, t) {
        return f && process.send({type: "dequeue"}), e ? n(e) : void r(t)
    })
}
function gameRequest(e, t, r) {
    var n = {url: e, form: t}, a = request.post(n, function (e, t, n) {
        if (e)return r(e);
        if (200 !== t.statusCode)return r(new Error(t.statusCode + " " + n));
        try {
            n = JSON.parse(n)
        } catch (a) {
            return r(a)
        }
        r(null, n)
    });
    a.start(), a.req.setSocketKeepAlive(!0, 1e4)
}
var request = require("request");
module.exports = client, client.cli = require("./cli");