/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps} from "../Team/Team";
import {Achievement, AchievementProps} from "./Achievement";
import LoginService from "../../service/LoginService";

export interface AchievementsProps {
    achievements: AchievementProps[]
}

export class Achievements extends React.Component<AchievementsProps, any> {

    renderAddAchievement() {
        if (LoginService.isAdmin()) {
            return <a href="/achievements/add" type="button" className="btn btn-primary pull-right">
                <i className="fa fa-plus-circle"></i>
            </a>
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Achievements</h1>
                {this.renderAddAchievement()}

                {this.props.achievements.map(function (achievement: AchievementProps) {
                    return <div key={achievement._id}>
                        <Achievement {...achievement}/>
                    </div>
                    })}
            </div>
        );
    }
}