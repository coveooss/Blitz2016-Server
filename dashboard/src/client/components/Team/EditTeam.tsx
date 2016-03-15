/// <reference path="../../../../definitions/tsd.d.ts" />

import {TeamProps} from "./Team";
import TeamsService from "../../service/TeamService";
import ClassicComponent = __React.ClassicComponent;

export class EditTeam extends React.Component<TeamProps, any> {

    constructor(props: TeamProps) {
        super(props);

        this.state = {
            _id: this.props._id,
            name: this.props.name,
            password: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);

        this.handleTeamChange = this.handleTeamChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleImageChange(event) {
        this.setState({image: event.target.value});
    }

    handleTeamChange() {
        var formData = new FormData();

        formData.append("image", this.state.image);
        formData.append("name", this.state.name);
        formData.append("password", this.state.password);

        TeamsService.updateOne(this.props._id, formData).done(() => {
            this.forceUpdate();
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Équipe {this.state.name}</h1>

                <div className="form-group">
                    <label>nom:</label>
                    <input className="form-control" type="text" name="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange}/>
                </div>
                <div className="form-group">
                    <label>mot de passe:</label>
                    <input className="form-control" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                </div>
                <div className="form-group">
                    <label>Image d'équipe:</label>
                    <input className="form-control" type="text" placeholder="Image URL" value={this.state.image} onChange={this.handleImageChange}/>
                </div>
                <button type="button" className="btn btn-default" onClick={this.handleTeamChange}>Sauvegarder</button>
            </div>
        );
    }
}