///<reference path="../../shared/shared.d.ts" />
import mongoose = require('mongoose');
import AchievementsService = require('../service/AchievementsService');

require('../models/achievements');

class Achievemnts {
    static generate(achievementsToInitialize: number) {
        for (let i = 1; i <= achievementsToInitialize; i++) {
            AchievementsService.create({
                name: 'achievement' + i,
                image: 'achievement_img',
                description: 'achievement_description_' + i,
                hidden: false,
                unlocked: false
            }, (err, achievement: Achievement) => {
                if (err) {
                    console.error(err);
                }
                console.log('Achievement ' + achievement.name + ' saved successfully');
            });
        }
    }
}

export = Achievemnts;