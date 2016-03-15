/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps, Team} from "./Team";

export interface TeamsProps {
    teams: TeamProps[]
}

export class Teams extends React.Component<TeamsProps, any> {

    render() {
        return (
            <div className="container">
                <h1>Équipes</h1>
                <div className="row">
                    {this.props.teams.map(function (team: TeamProps) {
                        if (team.name != 'guest') {
                            return <div key={team._id}>
                                <Team {...team}/>
                            </div>
                            }
                        })}
                </div>
            </div>
        );
    }
}