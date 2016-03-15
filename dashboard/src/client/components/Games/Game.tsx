/// <reference path="../../../../definitions/tsd.d.ts" />

import GamesService from "../../service/GamesService";
import SlackService from "../../service/SlackService";

import _ = require('underscore');

export interface GameProps {
    socket: SocketIOClient.Socket;
    key?: string;
    id: string;
    category: string;
    turn: number;
    maxTurns: number;
    heroes: [HeroProps]
    finished: boolean;
    started: boolean;
    gameType: string;
}

export interface HeroProps {
    id: string;
    name: string;
    crashed: boolean;
    ready: boolean;
    gold: number;
}

export const GameTypes = {
    active: 'active',
    games: 'games',
    training: 'training'
};

export class Game extends React.Component<GameProps, any> {

    getCrashedIcon(hero: HeroProps) {
        if (hero.crashed) {
            return <i className="fa fa-user-times"></i>
        } else {
            return <i className="fa fa-heart text-danger"></i>
        }
    }

    getReadyIcon(hero: HeroProps) {
        if (hero.ready) {
            return <i className="fa fa-check-square text-success"></i>
        } else {
            return <i className="fa fa-square"></i>
        }
    }

    getGameStateIcon() {
        if (this.props.finished) {
            return <i className="fa fa-flag-checkered"></i>
        } else if (this.props.started) {
            return <i className="fa fa-flag"></i>
        } else {
            return <i className="fa fa-spinner fa-pulse"></i>
        }
    }

    isStartDisabled() {
        return this.props.started || this.props.finished || this.props.gameType === GameTypes.training;
    }

    isStopDisabled() {
        return this.props.finished || this.props.gameType === GameTypes.training;
    }

    startGame() {
        GamesService.startGame(this.props.id);
    }

    abortGame() {
        GamesService.abortGame(this.props.id);
    }

    broadcastGame() {
        this.props.socket.emit('showgame', {id: this.props.id});
    }

	inviteTeamsToGame()	{
		var teamNumbersUserInput = prompt("Team IDs separated by commas");
		var teamNumbers = teamNumbersUserInput.replace(/\ /g, "").split(/,|\n/g);

		var channelList = _.map(teamNumbers, function(teamNumber) {
		  console.log(teamNumber);
		  var actualTeamNumber;
		  if (teamNumber == "15") {
		  	actualTeamNumber = "_coveo01";
		  } else if (teamNumber == "16") {
		  	actualTeamNumber = "_coveo02";
		  } else {
		  	actualTeamNumber = ("00" + teamNumber).slice(-2);
		  }
		  return "team" + actualTeamNumber;
		})

        _.forEach(channelList, (channel) => {
            SlackService.sendInvite(this.props.id, channel);
        });
	}

    render() {
        return (
            <tr>
                <td>
                    <a href={GamesService.getGameUrl(this.props.id)}>{this.props.id}</a>
                </td>
                <td>
                    {this.props.category}
                </td>
                <td>
                    {this.props.turn} / {this.props.maxTurns}
                </td>
                <td>
                    {this.props.heroes.map((hero: HeroProps) => {
                        return <div key={hero.id}>
                            <div>
                                <strong>Hero {hero.id}</strong>
                                : {hero.name} {this.getCrashedIcon(hero)} {this.getReadyIcon(hero)}
                            </div>
                            <div>
                                <i className="fa fa-star"></i>&nbsp;
                                : {hero.gold}
                            </div>
                        </div>
                        })}
                </td>
                <td>{this.getGameStateIcon()}</td>
                <td>
                    <button className="btn btn-primary" disabled={this.isStartDisabled()} onClick={this.startGame.bind(this)}>
                        <i className="fa fa-play"></i>&nbsp;
                        Start
                    </button>
                    &nbsp;
                    <button className="btn btn-danger" disabled={this.isStopDisabled()} onClick={this.abortGame.bind(this)}>
                        <i className="fa fa-stop"></i>&nbsp;
                        Abort
                    </button>
                    &nbsp;
                    <div className="btn btn-default" onClick={this.inviteTeamsToGame.bind(this)}>
                        <i className="fa fa-slack"></i>&nbsp;
                        Invite Teams
                    </div>
                </td>
            </tr>
        )
    }
}