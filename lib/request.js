var request = require('superagent');

function requestData(teamSlug, onError, onSuccess, invocations) {
    var invs = invocations || 0;

    function buildURL(team) {
        return 'http://push.api.bbci.co.uk/morph/data/bbc-morph-sport-football-scores-tabbed-teams-model/team/' + team + '/version/1.0.6'
    }

    request
        .get(buildURL(teamSlug))
        .end(function(err, res) {
            if(err) {
                return onError();
            }

            if (res.status === 200) {
                return onSuccess(JSON.parse(res.text));
            }

            if (res.status === 202) {
                if (invs === 4) {
                    return onError();
                }

                setTimeout(function() {
                    requestData(teamSlug, onError, onSuccess, invs + 1);
                }, 500);
            }
        });
}

module.exports = requestData;
