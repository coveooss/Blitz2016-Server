/// <reference path="../../../../definitions/tsd.d.ts" />

import {AchievementProps} from "../Achievement/Achievement";
import LoginService from "../../service/LoginService";

export interface TeamProps {
    _id: string;
    name: string;
    botId?: string;
    image?: string;
    unlockedAchievements?: AchievementProps[]
}

export class Team extends React.Component<TeamProps, any> {

    constructor(props: TeamProps) {
        super(props);
        this.getEditButton = this.getEditButton.bind(this);
    }

    getEditButton() {
        if (LoginService.getCurrentTeam() == this.props._id || LoginService.isAdmin()) {
            return <a className="btn btn-primary" href={`teams/${this.props._id}/edit`}>
                <i className="fa fa-pencil"></i>
            </a>
        }
    }

    render() {
        return (
            <div className="col-sm-6 col-md-4">
                <div className="thumbnail">
                    <img height="20" src={this.props.image}/>

                    <div className="caption">
                        <h3>{this.props.name}</h3>
                        <p>
                            <a className="btn btn-primary" href={`teams/${this.props._id}`}>
                                <i className="fa fa-eye"></i>
                            </a>
                            &nbsp;
                            {this.getEditButton()}
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}