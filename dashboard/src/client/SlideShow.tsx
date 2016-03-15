/// <reference path="../../definitions/tsd.d.ts" />

import AchievementService from "./service/AchievementService";
import TeamsService from './service/TeamService';

import {TeamProps}  from './components/Team/Team';
import {AchievementProps} from "./components/Achievement/Achievement";

import Menu from './components/Menu/Menu';
import AppController from "./controllers/AppController";

export default class SlideShow {

    private interval;

    private currentStep = 0;
    private steps = [this.showScore, this.showRandomTeam, this.showRandomAchievement, this.showTweets];

    constructor(private appController: AppController) {

    }

    start() {
        console.log('Starting slideshow');
        this.playStep();
    }

    stop() {
        clearTimeout(this.interval);
    }

    playStep() {
        this.steps[this.currentStep].apply(this);
        this.currentStep++;
        if (this.currentStep == this.steps.length) {
            this.currentStep = 0;
        }

        this.interval = setTimeout(() => {
            this.playStep();
        }, 10000);
    }

    showScore() {
        this.appController.showScore();
    }

    showRandomTeam() {
        TeamsService.getAll().done((teams: TeamProps[]) => {
            var team: TeamProps = this.pickRandomItemFromArray(teams);

            this.appController.showTeam(team._id);
        });
    }

    showRandomAchievement() {
        AchievementService.getAll().done((achievements: AchievementProps[]) => {
            var achievement: AchievementProps = this.pickRandomItemFromArray(achievements);

            this.appController.showAchievement(achievement._id);
        });
    }

    showTweets() {
        this.appController.showTweets();
    }

    private pickRandomItemFromArray(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    renderContent(content) {
        React.render(<div>
            <Menu />
            {content}
        </div>, document.getElementById('app'));
    }

}