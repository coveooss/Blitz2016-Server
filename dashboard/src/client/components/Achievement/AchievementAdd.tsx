/// <reference path="../../../../definitions/tsd.d.ts" />

import ClassicComponent = __React.ClassicComponent;
import AchievementService from "../../service/AchievementService";

import page = require('page');

export class AchievementAdd extends React.Component<any, any> {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        var name = this.refs['name'] as ClassicComponent<any, any>;
        var description = this.refs['description'] as ClassicComponent<any, any>;
        var image = this.refs['image'] as ClassicComponent<any, any>;

        AchievementService.create({
            name: name.getDOMNode<HTMLInputElement>().value,
            description: description.getDOMNode<HTMLInputElement>().value,
            image: image.getDOMNode<HTMLInputElement>().value,
        }).done(() => {
            page('/achievements');
        });
    }

    render() {
        return (
            <div className="container">
                <h1>Ajouter un achievement</h1>

                <div className="form-group">
                    <label>Nom:</label>
                    <input ref="name" className="form-control" type="text" name="name" placeholder="Nom"/>
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input ref="description" className="form-control" type="text" name="description" placeholder="Description"/>
                </div>
                <div className="form-group">
                    <label>image:</label>
                    <input ref="image" className="form-control" type="text" name="image" placeholder="URL d'image"/>
                </div>
                <button type="button" className="btn btn-default" onClick={this.handleSubmit}>Créer</button>
            </div>
        );
    }
}