var debug = require('debug')('change-publisher-scoreProcessor');
var exports = module.exports = {};
var Client = require('node-rest-client').Client;
var client = new Client();

// Configuration variables
var host = process.env.SCOREPROCESSOR_HOST ? process.env.SCOREPROCESSOR_HOST : 'score-processor';
var port = process.env.SCOREPROCESSOR_PORT ? process.env.SCOREPROCESSOR_PORT : 3002;

exports.getScore = function(matchId, callback) {
    debug('Attempting to retrieve updated score');

    if(!matchId) {
        var error = 'matchId is required to get score';
        debug(error);
        return callback(error);
    }
 
    var baseUrl = 'http://' + host + ':' + port; 
    client.get(baseUrl + '?match=' + matchId, function (score, response) {
        debug('Received updated score: %s', JSON.stringify(score));
        callback(null, score);
    }).on('error', function (err) {
        var message = 'Problem retrieving updated score: ' + err;
        debug(message);
        return callback(message);
    });
};
