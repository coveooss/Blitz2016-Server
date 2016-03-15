/// <reference path="../../../../definitions/tsd.d.ts" />

import { MenuItem, MenuItemProps } from './MenuItem';
import LoginService from "../../service/LoginService";

export default class Menu extends React.Component<any, any> {

    getBasicUserMenuItems(): MenuItemProps[] {
        return [{
            label: 'Score',
            link: 'score'
        }, {
            label: 'Équipes',
            link: 'teams'
        }, {
            label: 'Achievements',
            link: 'achievements'
        }, {
            label: 'Tweets',
            link: 'tweets'
        }, {
            label: 'Règlements',
            link: '/doc/rules'
        }, {
            label: 'Technique',
            link: '/doc/details'
        }, {
            label: 'Slack',
            link : 'https://coveoblitz2016.slack.com'
        }]
    }

    getAdminUserMenuItems(): MenuItemProps[] {
        var menuItems = [];
        if (LoginService.isAdmin()) {
            menuItems = [{
                label: 'Games',
                link: '/admin/games'
            }, {
                label: 'Messages',
                link: '/admin/messages'
            }]
        }
        return menuItems;
    }

    getMenuItems(): MenuItemProps[] {
        return this.getBasicUserMenuItems().concat(this.getAdminUserMenuItems());
    }

    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">
                            <img src="img/logo.png" alt="Coveo Blitz"/>
                        </a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            {this.getMenuItems().map(function (item: MenuItemProps) {
                                return  <li key={item.link}>
                                    <MenuItem {...item}/>
                                </li>
                                })}
                            <li>
                                <a href="logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}