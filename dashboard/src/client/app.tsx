/// <reference path="../../definitions/tsd.d.ts" />

import page = require('page');

import LoginService from "./service/LoginService";

import SlideShow from "./SlideShow";
import AppController from "./controllers/AppController";

var appController = new AppController();
var slideshow = new SlideShow(appController);

window['slideshow'] = {
    start: () => {
        slideshow.start();
    },
    stop: () => {
        slideshow.stop();
    }
};

LoginService.checkLogin().done(() => {

    var socket = io.connect('http://blitz2016.xyz/', {
        transports: ["websocket"]
    });

    socket.on('showgame', (data) => {
        page('/tv/' + data.id);
    });

    socket.on('achievement:unlock', (message) => {
        appController.notifyAchievement(message);
    });

    page('/', () => {
        appController.showScore();
    });

    page('/score', () => {
        appController.showScore();
    });

    page('/teams', () => {
        appController.showTeams();
    });

    page('/teams/:id', (ctx: PageJS.Context) => {
        appController.showTeam(ctx.params.id);
    });

    page('/teams/:id/edit', (ctx: PageJS.Context) => {
        appController.editTeam(ctx.params.id);
    });

    page('/achievements', (ctx: PageJS.Context) => {
        appController.showAchievements();
    });

    page('/achievements/add', (ctx: PageJS.Context) => {
        appController.addAchievement();
    });

    page('/achievements/:id', (ctx: PageJS.Context) => {
        appController.showAchievement(ctx.params.id);
    });

    page('/tv/:id', (ctx: PageJS.Context) => {
        appController.showGame(ctx.params.id);
    });

    page('/tweets', () => {
        appController.showTweets();
    });

    page('/doc/rules', () => {
        appController.showRules();
    });

    page('/doc/details', () => {
        appController.showDetails();
    });

    page('/admin/games', () => {
        appController.showGames(socket);
    });

    page('/admin/messages', () => {
        appController.showMessages();
    });

    page('/logout', () => {
        LoginService.logout();
    });

    page('/slideshow', () => {
        slideshow.start();
    });

    page('*', () => {
    });

    page({
        hashbang: true
    });
});