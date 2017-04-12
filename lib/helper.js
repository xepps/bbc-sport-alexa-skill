module.exports = {
    getTeam: function (team) {
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
    },

    getMyTeam: function (team, homeTeam, awayTeam) {
        return homeTeam.name.first.toLowerCase() === team.toLowerCase()
            ? homeTeam
            : awayTeam;
    },

    getOppositionTo: function (team, homeTeam, awayTeam) {
        return homeTeam.name.first.toLowerCase() === team.toLowerCase()
            ? awayTeam
            : homeTeam;
    },

    getHomeOrAway: function (team, homeTeam, awayTeam) {
        return homeTeam.name.first === team
            ? ' at home'
            : ', away,'; // Commas are required in order for Alexa to pronounce team names correctly!
    },

    verifyTeamName: function (event, onValid) {
        var team = event.request.intent.slots.Team.value;
        var teamSlug = this.getTeam(team);

        if (teamSlug === null) {
            this.emit(':tellWithCard', 'Please give me the name of a premier league team.', team, SKILL_NAME, 'Unknown');
            return;
        }

        onValid({
            name: team,
            slug: teamSlug
        });
    }
}
