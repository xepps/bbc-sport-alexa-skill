var request = require('superagent');

module.exports = function (teamSlug, callback, invocations) {
    var invs = invocations || 0;

    function buildURL(team) {
        return 'http://push.api.bbci.co.uk/morph/data/bbc-morph-sport-football-scores-tabbed-teams-model/team/' + team + '/version/1.0.6'
    }

    request
        .get(buildURL(teamSlug))
        .end(function(err, res) {
            if(err) {
                callback({
                    success: false,
                    events: null
                });
            }

            if (res.status === 202) {
                if (invs === 4) {
                    callback({
                        success: false,
                        events: null
                    });
                    return;
                }

                setTimeout(function() {
                    requestData(teamSlug, callback, invs + 1);
                }, 500);
            }

            if (res.status === 200) {
                callback({
                    success: true,
                    events: JSON.parse(res.text)
                });
            }
        });
}
