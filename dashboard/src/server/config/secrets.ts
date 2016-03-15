/// <reference path='../../../definitions/tsd.d.ts' />

module.exports = {
    db: process.env.MONGODB || 'mongodb://example.com/vindinium',
    session: process.env.SESSION || 'blitz_session_secret',
    adminPassword: 'kungfu16',
    apiKey: 'asdf',
    slackToken: 'xoxp-179XXXX-XXXXX-XXXXX-XXXX6b0'
};
