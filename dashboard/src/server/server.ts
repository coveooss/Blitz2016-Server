/// <reference path='../../definitions/tsd.d.ts' />

import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import session = require('express-session');
import mongoose = require('mongoose');
import request = require('request');

var secrets = require('./config/secrets');

require('./models/team');
require('./models/achievements');

mongoose.connect(secrets.db);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

import teams = require('./routes/teams');
import login = require('./routes/login');
import achievementsRouter = require('./routes/achievements');

var achievements = achievementsRouter(io);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: secrets.session,
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

app.use('/', express.static('static'));
app.use('/teams', teams);
app.use('/achievements', achievements);
app.use('/login', login);

app.get('/games', function(req,res) {
    // Proxy /games to game service
    // Local
    // AWS
    request(`http://localhost:8080/games?apiKey=${secrets.apiKey}`).pipe(res);
});

app.get('/*', function (req, res) {
    res.render('app.ejs');
});

var port = process.argv[2] || 80;
server.listen(port);
console.log('Server running at  http://localhost:' + port);


io.on('connection', function (socket) {
    socket.on('showgame', function (data) {
        console.log(data);
        socket.broadcast.emit('showgame', {
            id: data.id
        })
    });
});
