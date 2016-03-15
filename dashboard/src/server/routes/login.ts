/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import mongoose = require('mongoose');
import express = require('express');
import TeamsService = require('../service/TeamsService');
var secrets = require('../config/secrets');

var Team = mongoose.model('Team');
var router = express.Router();

interface Request extends express.Request {
    session?: Session;
}

router.all('/', (req: Request, res: express.Response) => {
    var errors = [];

    if (req.body != null && req.body.team != null && req.body.password != null) {
        if (isAdmin(req)) {
            req.session.user = {role: 'admin', team: 'admin', apiKey: secrets.apiKey, slackToken: secrets.slackToken};
            res.redirect('/');
        } else {
            var team = req.body.team;
            var password = req.body.password;

            TeamsService.getOneWithPassword(team.toString(), (err, team: Team) => {
                if (err) {
                    console.log(err);
                    console.log('Probably wrong password');
                    return renderLoginPage(res);
                }

                if (team != null && team.password === password) {
                    req.session.user = {role: 'user', team: team._id};
                    res.redirect('/');
                } else {
                    return renderLoginPage(res);
                }
            });
        }
    } else {
        req.session.user = null;
        return renderLoginPage(res);
    }
});

router.get('/info', (req: Request, res: express.Response) => {
    res.send({
        user: req.session.user
    });
});

function isAdmin(req: Request) {
    return req.body.team == 'admin' && req.body.password == secrets.adminPassword;
}

function renderLoginPage(res: express.Response) {
    TeamsService.getAll((err, teams: Team[]) => {
        if (err) {
            return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
        }

        teams.push(<any> {
            id: 'admin',
            name: 'admin',
            members: []
        });

        res.render('login.ejs', {
            teams: teams
        });
    });
}

export = router;
