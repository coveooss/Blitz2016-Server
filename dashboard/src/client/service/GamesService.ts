/// <reference path='../../../definitions/tsd.d.ts' />

import _ = require('underscore');

import LoginService from "./LoginService";

const GAME_SERVER_URL = 'http://blitz2016.xyz:8080';

export default class GamesService {

    static getGameUrl(id: string): string {
        return `${GAME_SERVER_URL}/${id}`
    }

    static getGames() {
        return $.ajax({
            url: '/games',
            method: 'GET'
        });
    }

    static getStartedGames(): JQueryXHR {
        return $.ajax({
            url: this.url('/games'),
            method: 'GET'
        });
    }

    static getActiveGames(): JQueryXHR {
        return $.ajax({
            url: this.url('/games/active'),
            method: 'GET'
        });
    }

    static getTrainingGames(): JQueryXHR {
        return $.ajax({
            url: this.url('/games/training'),
            method: 'GET'
        });
    }

    static createGame(category: string): JQueryXHR {
        return $.ajax({
            url: this.url('/games', {category: category}),
            method: 'POST'
        })
    }

    static startGame(id: string): JQueryXHR {
        return $.ajax({
            url: this.url(`/games/${id}/start`),
            method: 'POST'
        })
    }

    static abortGame(id: string): JQueryXHR {
        return $.ajax({
            url: this.url(`/games/${id}`),
            method: 'DELETE'
        })
    }

    private static url(path: string, params: any = {}) {
        var queryString = $.param(_.extend(params, {
            apiKey: LoginService.getApiKey()
        }));
        return GAME_SERVER_URL + path + '?' + queryString;
    }
}