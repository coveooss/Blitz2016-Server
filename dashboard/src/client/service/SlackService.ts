/// <reference path='../../../definitions/tsd.d.ts' />

import {TeamProps} from "../components/Team/Team";
import LoginService from "./LoginService";

export default class SlackService {

    static sendInvite(gameId: string, channel: string): JQueryXHR {
        var text = `Joignez la partie suivante: \`${gameId}\``;

        var params = $.param({
            token: LoginService.getSlackToken(),
            channel: channel,
            text: text,
            username: 'blitzbot',
            icon_url: 'https://avatars3.githubusercontent.com/u/8632328?v=3&s=200',
            pretty: 1
        });

        return $.ajax({
            url: 'https://slack.com/api/chat.postMessage?' + params,
            method: 'GET'
        });
    }

    static sendMessage(channel: string, message: string) {
        var params = $.param({
            token: LoginService.getSlackToken(),
            channel: channel,
            text: message,
            username: 'blitzbot',
            icon_url: 'https://avatars3.githubusercontent.com/u/8632328?v=3&s=200',
            pretty: 1
        });

        return $.ajax({
            url: 'https://slack.com/api/chat.postMessage?' + params,
            method: 'GET'
        });
    }
}