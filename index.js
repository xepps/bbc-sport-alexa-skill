'use strict';
var Alexa = require('alexa-sdk');

var request = require('./lib/request');
var helper = require('./lib/helper');
var getNextFixture = require('./lib/next-fixture');
var getLastFixture = require('./lib/last-fixture');

var APP_ID = null;
var SKILL_NAME = 'BBC Sport';

var radioUrl = 'https://s3.amazonaws.com/bbc-sport-info/Euro+2016+EnglandIceland+Round+of+16+BBC+Radio+5+Live+Post+Match+Reaction+62716.mp3';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = Alexa.CreateStateHandler('', {
    'LaunchRequest': function () {
        this.handler.state = 'START';

        this.response
            .speak('Ask me about a premier league team?');

        this.emit(':responseReady');
    },
    'StoreTeamIntent': function () {
        this.emit('NextFixture');
    },
    'Team': function () {
        helper.verifyTeamName(this.event, function onValid(team) {
            request(team.slug, function onError() {
                this.emit(':tellWithCard', 'Response timed out. Please try again.', SKILL_NAME, 'Timed out', team.name);
            }, function onSuccess(events) {
                var nextFixture = getNextFixture(team.name, events.fixtures.body, true);
                var lastFixture = getLastFixture(team.name, events.results.body);

                if(nextFixture) {
                    this.emit(':tellWithCard', lastFixture + nextFixture, SKILL_NAME, lastFixture + nextFixture, team.name);
                    return;
                }

                this.emit(':tellWithCard', 'There are no upcomming fixtures for ' + team.name, SKILL_NAME, 'There are no upcomming fixtures for ' + team.name, team.name);
            }.bind(this));
        }.bind(this));
    },
    'NextFixture': function () {
        helper.verifyTeamName(this.event, function onValid(team) {
            request(team.slug, function onError() {
                this.emit(':tellWithCard', 'Response timed out. Please try again.', SKILL_NAME, 'Timed out', team.name);
            }, function onSuccess(events) {
                if(team.slug === 'everton') {
                    this.response
                        .speak('Everton are playing today, here\'s the action')
                        .audioPlayerPlay('REPLACE_ALL', radioUrl, team.slug, null, 0);

                    this.emit(':responseReady');
                    return;
                }

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
        var speechOutput = "Ask me for information about any premier league team.";
        this.response
            .speak(speechOutput)
            .listen(speechOutput);
        this.emity(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Ok, I\'ll be quiet.')
            .audioPlayerStop();
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Ok, I\'ll be quiet.')
            .audioPlayerStop();
        this.emit(':responseReady');
    }
});
