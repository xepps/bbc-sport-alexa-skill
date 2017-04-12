var helper = require('./helper');
var moment = require('moment');

module.exports = function(team, fixtures, and) {
    if (fixtures.rounds.length) {
        var event = fixtures.rounds[0].events[0];
        var myTeam = helper.getMyTeam(team, event.homeTeam, event.awayTeam).name.first;
        var opposingTeam = helper.getOppositionTo(team, event.homeTeam, event.awayTeam).name.first;
        var homeOrAway = helper.getHomeOrAway(myTeam, event.homeTeam, event.awayTeam);
        var fromNow = moment(event.startTime).fromNow();

        return (and ? 'They' : myTeam) + ' are playing ' + opposingTeam + homeOrAway + ' ' + fromNow + '. ';
    }
}
