var helper = require('./helper');
var moment = require('moment');

module.exports = function(team, results) {

    if (results.rounds.length) {
        var event = results.rounds[0].events[0];
        var myTeam = helper.getMyTeam(team, event.homeTeam, event.awayTeam)
        var myTeamName = myTeam.name.first
        var opposingTeam = helper.getOppositionTo(team, event.homeTeam, event.awayTeam);
        var opposingTeamName = opposingTeam.name.first
        var homeOrAway = helper.getHomeOrAway(myTeamName, event.homeTeam, event.awayTeam);
        var homeScore = helper.zeroToNil(event.homeTeam.scores.score);
        var awayScore = helper.zeroToNil(event.awayTeam.scores.score);
        var fromNow = moment(event.startTime).fromNow();
        var outcome = helper.getOutcome(myTeam.eventOutcome);
        var outcomeModifier = outcome === 'won' ? 'against' : 'to'
        var score = homeScore + ' - ' + awayScore;

        return myTeamName + ' ' + outcome + ' ' + score + ' ' + outcomeModifier + ' ' + opposingTeamName + homeOrAway + ' ' + fromNow + '. ';
    }
}
