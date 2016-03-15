/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps} from "./Team";
import TeamsService from "../../service/TeamService";
import ClassicComponent = __React.ClassicComponent;
import {Achievement, AchievementProps} from "../Achievement/Achievement";

export class ViewTeam extends React.Component<TeamProps, any> {

    render() {
        var style = {backgroundImage: `url(${this.props.image})`};

        return (
            <div className="team container">
                <div className="card">
                    <div className="card-background" style={style}></div>
                    <div className="useravatar">
                        <img className="card-bkimg" height="20" src={this.props.image}/>
                    </div>
                </div>
                <div className="container">
                    <h1>Équipe {this.props.name}</h1>
                    {this.props.unlockedAchievements.map((achievement) => {
                        return <Achievement key={achievement._id} {...achievement}/>
                        })}
                </div>
            </div>
        );
    }
}