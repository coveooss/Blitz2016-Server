/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import mongoose = require('mongoose');
import express = require('express');
import {Model} from "mongoose";

var AchievementModel = mongoose.model('Achievement');
var TeamModel = mongoose.model('Team');

type AchievementCallback = (err: any, achievement: Achievement) => void;
type AchievementsCallback = (err: any, achievement: Achievement[]) => void;
type UnlockCallback = (err: any, achievement: Achievement, team: Team) => void;

class AchievementsService {

    static getAll(callback?: AchievementsCallback) {
        AchievementModel.find({}).populate('teams', '_id name members').exec(callback);
    }

    static getOne(id, callback?: AchievementCallback) {
        AchievementModel.findById(id).populate('teams', '_id name members').exec(callback);
    }

    static unlock(achievementId, teamId, callback?: UnlockCallback) {
        AchievementModel.findByIdAndUpdate(achievementId, {$addToSet: {teams: teamId}}, (achievementError, achievement: Achievement) => {
            TeamModel.findByIdAndUpdate(teamId, {$addToSet: {unlockedAchievements: achievementId}}, (teamError, team: Team) => {
                if (callback) {
                    callback({
                        achievementError: achievementError,
                        teamError: teamError
                    }, achievement, team);
                }
            });
        });
    }

    static create(achievementAttributes: Achievement, callback?: AchievementCallback) {
        var achievement = new AchievementModel(achievementAttributes);
        achievement.save(callback);
    }

    static update(id, achievementAttributes: Achievement, callback?: AchievementCallback) {
        AchievementModel.findByIdAndUpdate(id, {$set: achievementAttributes}, callback);
    }

    static remove(id, callback?: AchievementCallback) {
        AchievementModel.findByIdAndRemove(id, callback);
    }
}

export  = AchievementsService;