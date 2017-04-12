'use strict';
var Alexa = require('alexa-sdk');

var request = require('./lib/request');
var helper = require('./lib/helper');
var getNextFixture = require('./lib/next-fixture');
var getLastFixture = require('./lib/last-fixture');

var APP_ID = 'amzn1.ask.skill.c777bb28-a73a-4428-94d7-b2eee73864c5';
var SKILL_NAME = 'BBC Sport';



exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('NextFixture');
    },
    'StoreTeamIntent': function () {
        this.emit('NextFixture');
    },
    'NextFixture': function () {
        helper.verifyTeamName(this.event, function onValid(team) {
            request(team.slug, function onError() {
                this.emit(':tellWithCard', 'Response timed out. Please try again.', SKILL_NAME, 'Timed out', team.name);
            }, function onSuccess(events) {
                var nextFixture = getNextFixture(team.name, events.fixtures.body);

                if(nextFixture) {
                    this.emit(':tellWithCard', nextFixture, SKILL_NAME, nextFixture, team.name);
                    return;
                }

                this.emit(':tellWithCard', 'There are no upcomming fixtures for ' + team.name, SKILL_NAME, 'There are no upcomming fixtures for ' + team.name, team.name);
            }.bind(this));
        }.bind(this));
    },
    'LastFixture': function() {
        helper.verifyTeamName(this.event, function onValid(team) {
            request(team.slug, function onError() {
                this.emit(':tellWithCard', 'Response timed out. Please try again.', SKILL_NAME, 'Timed out', team.name);
            }, function onSuccess(events) {
                var lastFixture = getLastFixture(team.name, events.results.body);

                if(lastFixture) {
                    this.emit(':tellWithCard', lastFixture, SKILL_NAME, lastFixture, team.name);
                    return;
                }

                this.emit(':tellWithCard', 'There are no previous fixtures for ' + team.name, SKILL_NAME, 'There are no previous fixtures for ' + team.name, team.name);
            }.bind(this));
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
