/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import mongoose = require('mongoose');
import express = require('express');
import im = require('imagemagick');
import multiparty = require('multiparty');
import fs = require('fs');

var Team = mongoose.model('Team');

type TeamCallback = (err: any, teams: Team) => void;
type TeamsCallback = (err: any, teams: Team[]) => void;

class TeamsService {

    static getAll(callback?: TeamsCallback) {
        Team.find({}).select('-__v -password').populate('unlockedAchievements').exec(callback);
    }

    static getOne(id, callback?: TeamCallback) {
        Team.findById(id).select('-__v -password').populate('unlockedAchievements').exec(callback);
    }

    static getOneWithPassword(team, callback?: TeamCallback) {
        Team.findById(team).exec(callback);
    }

    static create(teamAttributes: Team, callback?: TeamCallback) {
        var team = new Team({
            name: teamAttributes.name,
            password: teamAttributes.password
        });

        team.save(callback);
    }

    static update(id, req: express.Request, callback?: TeamCallback) {
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            var team = {
                name: fields.name[0],
                password: fields.password[0],
                image: fields.image[0]
            };

            removeNullOrUndefinedAttributes(team);
            Team.findByIdAndUpdate(id, team).populate('unlockedAchievements').exec(callback);
        });
    }

    static remove(id, callback?: TeamCallback) {
        Team.findByIdAndRemove(id, callback);
    }
}

function removeNullOrUndefinedAttributes(object: any) {
    for (var i in object) {
        if (object[i] === '' || object[i] === null || object[i] === undefined) {
            delete object[i];
        }
    }
}

function resizeImage(src: string, dest: string, height: number, width: number) {
    im.resize({
        srcPath: src,
        dstPath: dest,
        width: width,
        height: height
    }, (err: Error, result: any) => {
        if (err) {
            console.log('error when resizing image');
        }
    });
}

export  = TeamsService;