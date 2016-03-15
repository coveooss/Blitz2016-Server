/// <reference path="../../../../definitions/tsd.d.ts" />

import {ScoreProps, Score} from "./Score";
import {TeamProps} from "../Team/Team";

import GamesService from "../../service/GamesService";
import ScoreService from "../../service/ScoreService";
import TeamsService from "../../service/TeamService";
import {GameProps} from "../Games/Game";

export interface ScoreTableState {
    scores: any[];
}

export class ScoreTable extends React.Component<any, ScoreTableState> implements React.ComponentLifecycle<any, ScoreTableState> {

    scoreService: ScoreService;

    constructor() {
        super();

        this.state = {scores: []};

        this.scoreService = new ScoreService();
    }

    componentWillMount() {
        this.getStartedGames();
    }

    getStartedGames() {
        return GamesService.getGames().done((games: GameProps[]) => {
            TeamsService.getAll().done((teams: TeamProps[]) => {
                var scores = this.scoreService.getScores(games, teams);

                this.setState({scores: scores});
            });
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Score</h1>
                <button className="btn" onClick={this.getStartedGames.bind(this)}>
                    <i className="fa fa-refresh"></i>
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Équipe</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.scores.map((score: ScoreProps) => {
                            return <Score key={score.id} {...score} />
                            })}
                    </tbody>
                </table>
            </div>

        );
    }
}