/// <reference path='../../../definitions/tsd.d.ts' />
///<reference path="../../shared/shared.d.ts" />

import express = require('express');

class Authentication {

    static isAuthorized(role?: string) {
        return (req: express.Request, res: express.Response, next: Function) => {
            if (req.session != null && req.session['user'] != null && (role == null || role == req.session['user'].role)) {
                next();
            } else {
                res.sendStatus(401);
            }
        }
    }
}

export  = Authentication;