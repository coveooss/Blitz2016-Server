/// <reference path='../../../definitions/tsd.d.ts' />

import {TeamProps} from "../components/Team/Team";

export default class TeamsService {

    static getAll() : JQueryXHR {
        return $.ajax({
            url: '/teams',
            method: 'GET'
        });
    }

    static getOne(id) : JQueryXHR  {
        return $.ajax({
            url: '/teams/' + id,
            method: 'GET'
        })
    }

    static updateOne(id: string, data: FormData) : JQueryXHR {
        return $.ajax({
            url: `/teams/${id}`,
            method: 'PUT',
            data: data,
            processData: false,
            contentType: false
        })
    }
}