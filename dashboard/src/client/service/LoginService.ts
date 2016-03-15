/// <reference path='../../../definitions/tsd.d.ts' />

interface LoginResponse {
    user: {
        role: string;
        team: string;
        apiKey: string;
        slackToken: string;
    }
}

export default class LoginService {

    static checkLogin() {
        return $.ajax({
            url: '/login/info',
            method: 'GET'
        }).done((data: LoginResponse) => {
            if (!data.user) {
                this.logout();
            } else {
                localStorage.setItem('role', data.user.role);
                localStorage.setItem('team', data.user.team);
                if (data.user.apiKey) {
                    localStorage.setItem('apiKey', data.user.apiKey);
                }
                if (data.user.slackToken) {
                    localStorage.setItem('slackToken', data.user.slackToken);
                }
            }
        });
    }

    static getCurrentTeam() {
        return localStorage.getItem('team');
    }

    static logout() {
        localStorage.clear();
        window.location.replace('/login');
    }

    static isAdmin(): boolean {
        return localStorage.getItem('role') === 'admin';
    }

    static getApiKey(): string {
        if (this.isAdmin()) {
            return localStorage.getItem('apiKey');
        }
        return '';
    }

    static getSlackToken(): string {
        if (this.isAdmin()) {
            return localStorage.getItem('slackToken');
        }
        return '';
    }
}