/// <reference path="../../../definitions/tsd.d.ts" />

import _ = require('underscore');

import TeamsService from "../service/TeamService";
import AchievementService from "../service/AchievementService";
import LoginService from "../service/LoginService";

import {Achievement, AchievementProps} from "../components/Achievement/Achievement";
import {Achievements} from "../components/Achievement/Achievements";
import {AchievementAdmin} from "../components/Achievement/AchievementAdmin";
import {AchievementNotification} from "../components/Achievement/AchievementNotification";
import {AchievementAdd} from "../components/Achievement/AchievementAdd";

import {Team, TeamProps} from "../components/Team/Team";
import {Teams}  from "../components/Team/Teams";
import {EditTeam}  from "../components/Team/EditTeam";
import {ViewTeam}  from "../components/Team/ViewTeam";

import Menu from "../components/Menu/Menu";

import {TV} from "../components/TV/TV";
import {ScoreTable} from "../components/Score/ScoreTable";
import {ScoreBoard} from "../components/Score/ScoreBrackets";
import {Games} from "../components/Games/Games";
import Twitter from "../components/Twitter/Twitter";
import Messages from "../components/Messages/Messages";
import GamesService from "../service/GamesService";
import {Rules} from "../components/Doc/Rules";
import {TechnicalDetails} from "../components/Doc/TechnicalDetails";

export default class AppController {

    showScore() {
        GamesService.getGames().done((games) => {
            var quaterFinalGames = _.findWhere(games, {
                category: 'QUARTERFINAL'
            });
            this.renderContent(<ScoreBoard/>)
        });
    }

    showTeams() {
        TeamsService.getAll().done((teams: TeamProps[]) => {
            this.renderContent(<Teams teams={teams}/>);
        });
    }

    showTeam(id) {
        TeamsService.getOne(id)
            .done((team: TeamProps) => {
                this.renderContent(<ViewTeam {...team}/>);
            });
    }

    editTeam(id) {
        TeamsService.getOne(id)
            .done((team: TeamProps) => {
                this.renderContent(<EditTeam {...team}/>);
            });
    }

    showAchievements() {
        AchievementService.getAll()
            .done((achievements: AchievementProps[]) => {
                this.renderContent(<Achievements achievements={achievements}/>);
            });
    }

    addAchievement() {
        this.renderContent(<AchievementAdd/>);
    }

    showAchievement(id) {
        AchievementService.getOne(id).done((achievement: AchievementProps) => {
            TeamsService.getAll().done((teams: TeamProps[]) => {
                if (LoginService.isAdmin()) {
                    achievement.allTeams = teams;
                    this.renderContent(<AchievementAdmin {...achievement}/>);
                } else {
                    this.renderContent(<div className="container">
                        <Achievement {...achievement} single={true}/>
                    </div>);
                }
            })
        });
    }

    showGame(id) {
        this.renderContent(<TV game={id}/>);
    }

    showGames(socket) {
        this.renderContent(<Games socket={socket}/>);
    }

    showTweets() {
        this.renderContent(<Twitter/>)
    }

    showMessages() {
        if (LoginService.isAdmin()) {
            this.renderContent(<Messages/>)
        }
    }

    showRules() {
        this.renderContent(<Rules/>)
    }

    showDetails() {
        this.renderContent(<TechnicalDetails/>)
    }

    notifyAchievement(message) {
        if (!LoginService.isAdmin()) {
            var notification = React.render(<AchievementNotification
                name={message.achievement.name}
                image={message.team.image}
                description={message.achievement.description}
                team={message.team.name}
            />, document.getElementById('notifications')) as AchievementNotification;
            setTimeout(() => {
                notification.animateOut(() => {
                    React.unmountComponentAtNode(document.getElementById('notifications'));
                });

            }, 10000);
        }
    }

    private renderContent(content) {
        React.render(<div>
            <Menu/>
            {content}
        </div>, document.getElementById('app'));
    }
}