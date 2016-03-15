/// <reference path='../../../definitions/tsd.d.ts' />

import _ = require('underscore');

import {TeamProps} from "../components/Team/Team";

export default class ScoreService {

    getScores(games: any[], teams: TeamProps[]) {
        console.log('-----------scores------------------');
        var scores = [];

        teams.forEach((team: TeamProps) => {
            if (team.botId) {
                scores.push({
                    id: team._id,
                    name: team.name,
                    image: team.image,
                    score: this.getScoreForTeam(games, team.botId)
                })
            }
        });

        return scores.sort((a, b) => {
            if (a.score > b.score) {
                return 1;
            }
            if (a.score < b.score) {
                return -1;
            }
            return 0;
        }).reverse();
    }

    getScoreForTeam(games, userId) {
        var gamesWithTeam = _.filter(games, (g) => {
            return this.gameContainsTeam(g, userId)
        });

        return _.map(gamesWithTeam, (g: any) => {
                var position = this.getTeamRankInGame(g, userId);
                var score = position;

                switch (g.category) {
                    case 'ROUND_1':
                        score = position * 1;
                        break;
                    case 'ROUND_2':
                        score = position * 2;
                        break;
                    case 'ROUND_3':
                        score = position * 3;
                        break;
                    case 'TOP_16':
                    case 'QUARTERFINAL':
                    case 'SEMIFINAL':
                    case 'FINAL':
                        if (position == 3) {
                            score = position + 1000;
                        }
                        break;
                }

                return score;
            })
            .reduce((memo, num) => {
                return memo + num;
            }, 0);
    }

    private gameContainsTeam(game, userId) {
        return _.some(this.getHeroListForGame(game), (hero: any) => {
            return hero.userId == userId
        });
    }

    private getHeroListForGame(game) {
        return [game.heroes[0], game.heroes[1], game.heroes[2], game.heroes[3]];
    }

    private getTeamRankInGame(game, userId) {
        var heroesInOrder = _.sortBy(this.getHeroListForGame(game), (h) => h.gold);

        var rank = 0;

        var groupedScores: any = _.groupBy(heroesInOrder, function(hero) { return hero.gold });

        for (var score in groupedScores) {
            _.each(groupedScores[score], (hero: any) => {
                hero.rank = rank;
            });

            rank += groupedScores[score].length;
        }

        var team = _.findWhere(heroesInOrder, {userId: userId});

        console.log('Team ' + team.name + ' gets ' + team.rank + 'pts in game ' + game.id + ' in round ' + game.category +
                    ' with ' + team.gold + ' gold');

        return team.rank;
    }


}