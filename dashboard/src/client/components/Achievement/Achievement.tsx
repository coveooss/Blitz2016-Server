/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps} from "../Team/Team";

export interface AchievementProps {
    key?: string;
    _id?: string;
    name: string;
    image: string;
    description: string;
    unlocked?: boolean;
    teams?: TeamProps[];
    allTeams?: TeamProps[];
    single?: boolean;
}

export class Achievement extends React.Component<AchievementProps, any> {
    render() {
        return (
            <div className="media">
                <div className="media-left">
                    <a href="#">
                        <img width="120" height="120" src={this.props.image} alt={this.props.name}/>
                    </a>
                </div>
                <div className="media-body">
                    <h4 className="media-heading">
                        <a href={'achievements/' + this.props._id}>{this.props.name}</a>
                    </h4>
                    {this.props.description}
                </div>
                {this.props.single ? this.renderUnlockedBy() : ''}
            </div>
        )
    }

    renderUnlockedBy() {
        return <div>
            <h2>Obtenu par:</h2>
            {this.props.teams.map(function(team) {
                return <div className="media">
                    <div className="media-body">
                        <h4 className="media-heading">
                            {team.name}
                        </h4>
                    </div>
                </div>
                })}
        </div>
    }
}