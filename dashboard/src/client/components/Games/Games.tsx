/// <reference path="../../../../definitions/tsd.d.ts" />

import {Game, GameProps, GameTypes} from "./Game";
import GamesService from "../../service/GamesService";

export interface GamesProps {
    socket: SocketIOClient.Socket;
}

export interface GamesState {
    games?: any[];
    gamesType?: string;
    category?: string;
}

const GAME_CATEGORIES = ['ROUND_1', 'ROUND_2', 'ROUND_3', 'TOP_16', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL', 'ALL'];

export class Games extends React.Component<GamesProps, GamesState> implements React.ComponentLifecycle<any, GamesState> {
    private timer;

    constructor() {
        super();
        this.state = {
            gamesType: 'active',
            games: [],
            category: 'ROUND_1'
        };
        this.createGame = this.createGame.bind(this);
    }

    componentDidMount() {
        this.getGames();
    }

    private getGames() {
        var request;
        if (this.state.gamesType == GameTypes.active) {
            request = GamesService.getActiveGames();
        } else if (this.state.gamesType == GameTypes.games) {
            request = GamesService.getStartedGames();
        } else if (this.state.gamesType == GameTypes.training) {
            request = GamesService.getTrainingGames();
        }

        request.done((games: GameProps[]) => {
            this.setState({games: games});

            this.timer = setTimeout(() => {
                this.getGames()
            }, 1000);
        });
    }

    private createGame(category: string) {
        GamesService.createGame(category);
    }

    private onSelectGameType(e) {
        this.setState({
            gamesType: e.target.value
        })
    }

    private onSelectGameCategory(e) {
        this.setState({
            category: e.target.value
        })
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <div>
                <h1>Games</h1>

                <div className="btn-group dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                        Create a game
                        &nbsp;
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {GAME_CATEGORIES.map((category: string) => {
                            return <li onClick={this.createGame.bind(this, category)}>
                                <a>{category}</a>
                            </li>
                            })}
                    </ul>
                </div>
                &nbsp;
                <button className="btn" onClick={this.getGames.bind(this)}>
                    <i className="fa fa-refresh"></i>
                </button>
                <span className="pull-right">
                    Show: &nbsp;
                    <select value={this.state.gamesType} onChange={this.onSelectGameType.bind(this)}>
                        <option value="active">Active Games</option>
                        <option value="games">Started Games</option>
                        <option value="training">Training Games</option>
                    </select>

                    <select value={this.state.category} onChange={this.onSelectGameCategory.bind(this)}>
                        {GAME_CATEGORIES.map((category: string) => {
                            return <option value={category}>{category}</option>
                            })}
                    </select>
                </span>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Game</th>
                            <th>Type</th>
                            <th>Round</th>
                            <th>Heroes</th>
                            <th>State</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.games.map((game: GameProps) => {
                            if (this.state.category == game.category || this.state.category == 'ALL') {
                                return <Game key={game.id} {...game} socket={this.props.socket} gameType={this.state.gamesType}/>
                                }
                            })}
                    </tbody>
                </table>
            </div>

        );
    }
}