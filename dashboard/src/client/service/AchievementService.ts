/// <reference path='../../../definitions/tsd.d.ts' />

import {TeamProps} from "../components/Team/Team";
import {AchievementProps} from "../components/Achievement/Achievement";

export default class AchievementService {

    static getAll() : JQueryXHR {
        return $.ajax({
            url: '/achievements',
            method: 'GET'
        });
    }

    static getOne(id) : JQueryXHR  {
        return $.ajax({
            url: `/achievements/${id}`,
            method: 'GET'
        })
    }

    static updateOne(achievement: AchievementProps) : JQueryXHR {
        return $.ajax({
            url: `/achievements/${achievement._id}`,
            method: 'PUT',
            data: achievement
        })
    }

    static create(achievement) : JQueryXHR {
        return $.ajax({
            url: `/achievements`,
            method: 'POST',
            data: achievement
        })
    }

    static unlock(achievementId: string, teamId: string) : JQueryXHR {
        return $.ajax({
            url: `/achievements/${achievementId}/team`,
            method: 'PUT',
            data: {
                id: teamId
            }
        })
    }
}