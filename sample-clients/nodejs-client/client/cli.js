function cli(e, o) {
    function r(r) {
        s.readFile(f, "utf8", function (n, a) {
            n && fatal("Failed to open config", n);
            try {
                a = JSON.parse(a)
            } catch (s) {
                fatal("Failed to parse config", s)
            }
            a.bot = e, a.mode = c, a.log = o, a.arenaId = v, "training" === c && (a.turns = l, a.map = g), r(a)
        })
    }

    function n(e) {
        function o() {
            d++, n(e)
        }

        function r(o) {
            "dequeue" === o.type && (I++, n(e))
        }

        for (; p >= m && d >= m && I >= m;)for (var a = 0; m > a; a++) {
            var s = t.fork();
            s.on("exit", o), s.on("message", r), p--, d--, I--
        }
    }

    function a(e) {
        i(e, function (o, r) {
            --p > 0 && a(e)
        })
    }

    var s = require("fs"), t = require("cluster"), i = require("./index"), u = require("optimist").argv;
    o || (o = cli.defaultLog), 1 !== u._.length && usage();
    var c, l, g, f = u._[0];
    void 0 === u.a == (void 0 === u.t) && usage("Must specify either -a or -t."), u.a ? c = "arena" : (c = "training", l = u.turns, g = u.map);
    var p, d, I, m, v;
    if (v = u.id, p = u.a || u.t, d = I = m = 1, "INF" === p)p = 1 / 0; else if ("string" == typeof p) {
        var b = p.split(",", 4);
        2 === b.length ? (d = parseInt(b[0], 10), p = b[1], I = d) : 3 === b.length ? (I = parseInt(b[0], 10), d = parseInt(b[1], 10), p = b[2]) : (m = parseInt(b[0], 10), I = parseInt(b[1], 10), d = parseInt(b[2], 10), p = b[3]), p = "INF" === p ? 1 / 0 : parseInt(p, 10)
    }
    (!p || 1 > p) && usage("Invalid number of games."), (!d || 1 > d) && usage("Invalid number of workers."), (!I || 1 > I) && usage("Invalid queue size."), (!m || 1 > m) && usage("Invalid group size."), I > d && usage("Queue size cannot be larger than number of workers."), m > I && usage("Group size cannot be large than queue size."), p !== 1 / 0 && p % m !== 0 && usage("Number of games must be multiple of group size.");
    var h = "training" === c;
    t.isWorker ? (r(function (e) {
        e.signalMaster = !0, i(e, function (e, o) {
            t.worker.disconnect()
        })
    }), process.on("SIGINT", function () {
        h && process.exit(1), h = !0
    })) : 1 === d ? (r(a), process.on("SIGINT", function () {
        p = 0, h ? (o("abort"), process.exit(1)) : (o("graceful"), h = !0)
    })) : (r(n), process.on("SIGINT", function () {
        p = 0, h ? o("abort") : (o("graceful"), h = !0)
    }))
}
function usage(e) {
    var o = require("path"), r = o.basename(process.argv[1]);
    console.error("Usage: %s <-a or -t> <num games> <config>", r), e && console.error(e), process.exit(1)
}
function fatal(e, o) {
    console.error(e + ": " + o.message), process.exit(2)
}
module.exports = cli, cli.defaultLog = function (e, o) {
    "turn" === e ? process.stdout.write(".") : "queue" === e ? console.log("QUEUE - Waiting for players...") : "start" === e ? console.log("START - " + o.viewUrl) : "end" === e ? (process.stdout.write("\n"), console.log(cli.ranking(o)), console.log("Replay: " + o.viewUrl)) : "graceful" === e ? console.log("\nSIGINT: Finishing matches. Press again to abort.") : "abort" === e ? console.log("\nSIGINT: Matches aborted.") : "error" === e && console.error(o.stack || o.message || o)
}, cli.ranking = function (e) {
    var o, r = e.game.heroes.slice();
    return r.sort(function (e, o) {
        return o.gold - e.gold
    }), o = e.hero.gold === r[0].gold ? r[0].gold === r[1].gold ? "DRAW" : "WIN" : "LOSS", o + " - " + r.map(function (e) {
        return "P" + e.id + " " + e.name + ": " + e.gold + " ◯"
    }).join(", ")
};
