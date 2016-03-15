/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import mongoose = require('mongoose');
import express = require('express');
import AchievementService = require('../service/AchievementsService');
import Authentication = require("./auth");
import TeamsService = require("../service/TeamsService");

export = function(io) {
    var router = express.Router();

    router.get('/', function(req: express.Request, res: express.Response) {
        AchievementService.getAll((err, achievements: Achievement[]) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
            }

            res.send(achievements);
        })
    });

    router.get('/:id', function(req: express.Request, res: express.Response) {
        AchievementService.getOne(req.params.id, (err, achievement: Achievement) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
            }

            res.send(achievement);
        })
    });

    router.post('/', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
        AchievementService.create(req.body, (err, achievement: Achievement) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
            }

            res.send(achievement);
        });
    });

    router.put('/:id', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
        if (req.params.id == null) {
            return res.send(400, 'Missing achievement id');
        }

        AchievementService.update(req.params.id, req.body, (err, achievement: Achievement) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
            }

            res.send(achievement);
        });
    });

    router.put('/:id', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
        if (req.params.id == null) {
            return res.send(400, 'Missing achievement id');
        }

        AchievementService.update(req.params.id, req.body, (err, achievement: Achievement) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Something wrong happened.'});
            }

            res.send(achievement);
        });
    });

    router.put('/:id/team', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
        if (req.params.id == null) {
            return res.send(400, 'Missing achievement id');
        }

        AchievementService.unlock(req.params.id, req.body.id, (err, achievement, team) => {
            res.send(achievement);

            io.emit('achievement:unlock', {
                achievement: achievement,
                team: team
            });
        })
    });

    router.delete('/:id', Authentication.isAuthorized('admin'), (req: express.Request, res: express.Response) => {
        if (req.params.id == null) {
            return res.send(400, 'Missing achievement id');
        }

        AchievementService.remove(req.body.id, (err, achievement: Achievement) => {
            if (err) {
                return console.log(err) || res.send(500, {message: 'Achievement could not be deleted.'});
            }

            res.sendStatus(204);
        });
    });

    return router;
}