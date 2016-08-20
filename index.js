var debug = require('debug')('change-publisher');
var eventStore = require('./eventstore.js');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var scoreProcessor = require('./scoreProcessor');

io.set('origins', '*localhost*:*');

// Subscribe any client to a match subscription
io.on('connection', function(socket) {
    var match = socket.handshake.query.match;
    if(match) socket.join(match);
});
server.listen(3100);
console.log('change-publisher listening on port 3100...');

// When the score changes, update clients
eventStore.subscribe(function(err, e) {
    var matchId = e.match;

    var response = {};
    response.event = e;

    if(matchId) {
        scoreProcessor.getScore(matchId, function(err, score) {
            if(err) console.log(err);

            response.score = score;
            debug('Dispatching event: %s', JSON.stringify(response));
            io.to(matchId).emit('score-change', response);
        });
    }
});