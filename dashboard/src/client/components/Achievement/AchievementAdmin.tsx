/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps} from "../Team/Team";
import {Achievement} from "./Achievement";
import AchievementService from "../../service/AchievementService";
import ClassicComponent = __React.ClassicComponent;

export class AchievementAdmin extends Achievement {
    render() {
        return (
            <div className="container">
                {super.render()}

                <select name="team" id="team" ref="team">
                    {this.props.allTeams.map(function(team: TeamProps) {
                        return <option key={team._id} value={team._id}>{team.name}</option>
                        })}
                </select>
                <button type="button" onClick={this.onClickUnlock.bind(this)}>Unlock</button>

                {super.renderUnlockedBy()}
            </div>
        )
    }

    onClickUnlock() {
        var teamSelect = (this.refs['team'] as ClassicComponent<any, any>).getDOMNode() as HTMLSelectElement;
        AchievementService.unlock(this.props._id, teamSelect.value);
    }
}