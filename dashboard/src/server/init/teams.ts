///<reference path="../../shared/shared.d.ts" />
import mongoose = require('mongoose');
import TeamsService = require('../service/TeamsService');

class Teams {
    static generate(teamsToInitialize: number) {
        for (let i = 1; i <= teamsToInitialize; i++) {

            TeamsService.create({
                name: 'team_' + i,
                password: 'team_' + i
            }, (err, team: Team) => {
                if (err) console.error(err);

                console.log('Team ' + team.name + ' saved successfully');
            });
        }
    }
}

export = Teams;