'use strict';
var Alexa = require('alexa-sdk');
var request = require('superagent');

var APP_ID = 'amzn1.ask.skill.c777bb28-a73a-4428-94d7-b2eee73864c5';
var SKILL_NAME = 'BBC Sport';

function getTeam(team) {
    return {
        'afc bournemouth': 'afc-bournemouth',
        'arsenal': 'arsenal',
        'burnley': 'burnley',
        'chelsea': 'chelsea',
        'crystal palace': 'crystal-palace',
        'everton': 'everton',
        'hull city': 'hull-city',
        'leicester city': 'leicester-city',
        'liverpool': 'liverpool',
        'manchester city': 'manchester-city',
        'manchester united': 'manchester-united',
        'middlesbrough': 'middlesbrough',
        'southampton': 'southampton',
        'stoke city': 'stoke-city',
        'sunderland': 'sunderland',
        'swansea city': 'swansea-city',
        'tottenham hotspur': 'tottenham-hotspur',
        'watford': 'watford',
        'west bromwich albion': 'west-bromwich-albion',
        'west ham united': 'west-ham-united'
    }[team.toLowerCase()] || null;
}

function buildURL(team) {
    return 'http://push.api.bbci.co.uk/morph/data/bbc-morph-sport-football-scores-tabbed-teams-model/team/' + team + '/version/1.0.6'
}

function requestData(teamSlug, callback) {
    request
        .get(buildURL(teamSlug))
        .end(function(err, res) {
            if (res.status === 202) {
                setTimeout(function() {
                    requestData(teamSlug, callback);
                }, 1000);
            }

            if (res.status === 200) {
                callback(JSON.parse(res.text));
            }
        });
}

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('TalkAboutTeam');
    },
    'StoreTeamIntent': function () {
        this.emit('TalkAboutTeam');
    },
    'TalkAboutTeam': function () {
        var team = this.event.request.intent.slots.Team.value;
        var teamSlug = getTeam(team);

        if (teamSlug === null) {
            this.emit(':tellWithCard', 'Please give me the name of a premier league team.', team, SKILL_NAME, 'Unknown');
            return;
        }

        requestData(teamSlug, function(events) {
            if (events.fixtures.body.rounds.length) {
                this.emit(':tellWithCard', team + ' are playing in the ' + events.fixtures.body.rounds[0].name.full + ' soon', team, SKILL_NAME, team);
                return;
            }

            this.emit(':tellWithCard', 'There are no upcomming fixtures for ' + team, team, SKILL_NAME, team);
        }.bind(this));
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'So long, suckers!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'So long, suckers!');
    }
};
