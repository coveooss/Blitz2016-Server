/// <reference path="../../../../definitions/tsd.d.ts" />

import ClassicComponent = __React.ClassicComponent;

import page = require('page');
import SlackService from "../../service/SlackService";

export default class Messages extends React.Component<any, any> {

    constructor() {
        super();

        this.state = {
            channel: '',
            message: ''
        };

        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChannelChange(event) {
        this.setState({channel: event.target.value});
    }

    handleMessageChange(event) {
        this.setState({message: event.target.value});
    }

    handleSubmit() {
        SlackService.sendMessage(this.state.channel, this.state.message).done(() => {
            this.setState({
                channel: '',
                message: ''
            });
        });
    }

    render() {
        return (
            <div className="container">
                <div className="form-group">
                    <label>Channel (without the #)</label>
                    <input id="channel" className="form-control" value={this.state.channel} onChange={this.handleChannelChange}/>
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea className="form-control" value={this.state.message} onChange={this.handleMessageChange}/>
                </div>

                <button type="button" className="btn btn-default" onClick={this.handleSubmit}>Envoyer</button>
            </div>
        )
    }
}
