/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import mongoose = require('mongoose');
import express = require('express');

import TeamsService = require('../service/TeamsService');
import Authentication = require("./auth");

var Team = mongoose.model('Team');
var router = express.Router();

router.get('/', function (req: express.Request, res: express.Response) {
    TeamsService.getAll((err, teams: Team[]) => {
        if (err) {
            return console.log(err) || res.status(500).send({message: 'Something wrong happened.'});
        }

        res.send(teams);
    });
});

router.get('/:id', (req: express.Request, res: express.Response) => {
    if (req.params.id == null) {
        return res.send(400, 'Missing team id');
    }

    TeamsService.getOne(req.params.id, (err, team: Team) => {
        if (err) {
            return console.log(err) || res.status(500).send({message: 'Something wrong happened.'});
        }

        res.send(team);
    });
});

router.post('/', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
    TeamsService.create(req.body, (err, team: Team) => {
        if (err) {
            return console.log(err) || res.status(500).send({message: 'Something wrong happened.'});
        }

        res.send(team);
    });
});

router.put('/:id', isTeamOwnerOrAdmin(), (req: express.Request, res: express.Response) => {
    if (req.params.id == null) {
        return res.send(400, 'Missing team id');
    }

    TeamsService.update(req.params.id, req, (err, team: Team) => {
        if (err) {
            return console.log(err) || res.status(500).send({message: 'Something wrong happened.'});
        }

        res.send(team);
    });
});

router.delete('/:id', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
    if (req.params.id == null) {
        return res.send(400, 'Missing team id');
    }

    TeamsService.remove(req.params.id, (err) => {
        if (err) {
            return console.log(err) || res.send(404, {message: 'Team could not be deleted'});
        }
        res.sendStatus(204);
    });
});

function isTeamOwnerOrAdmin() {
    return (req: express.Request, res: express.Response, next: Function) => {
        var session = <Session> req.session;
        if (session != null &&
            session.user != null &&
            (session.user.team == 'admin' || session.user.team == req.params.id)) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
}

export = router;
