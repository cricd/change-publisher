var debug = require('debug')('change-publisher-eventstore');
var client = require('ges-client');
var exports = module.exports = {};

// Configuration variables
var host = process.env.EVENTSTORE_HOST ? process.env.EVENTSTORE_HOST : 'eventstore';
var port = process.env.EVENTSTORE_PORT ? process.env.EVENTSTORE_PORT : 1113;
var user = process.env.EVENTSTORE_USER ? process.env.EVENTSTORE_USER : 'admin';
var password = process.env.EVENTSTORE_PASSWORD ? process.env.EVENTSTORE_PASSWORD : 'changeit';
var stream = process.env.EVENTSTORE_STREAM ? process.env.EVENTSTORE_STREAM : 'cricket_events_v1';

exports.subscribe = function(callback) {
    var settings = {
        host: host,
        port: port
    };
    debug('Getting match events from EventStore. %s', JSON.stringify(settings));

    var connection = client(settings);
    connection.on('connect', function() {
        var auth = {
            username: user,
            password: password
        };
        debug('EventStore connection established. Listening to stream with credentials %s', JSON.stringify(auth));

        var subscription = connection.subscribeToStream(stream, {
            auth: auth,
            resolveLinkTos: true,
            embedBody: true
        });

        subscription.on('confirmed', function(subscriptionData) {
            debug('Subscription confirmed: ', JSON.stringify(subscriptionData));
        });

        subscription.on('event', function(e) {
            debug('Event received: ', JSON.stringify(e));

            try {
                var dataString = e.Event.Data.toString('utf-8');
                var data = JSON.parse(dataString);

                debug('Parsed valid cricd event: %s', JSON.stringify(data));
                callback(null, data);
            }
            catch(err) {
                debug('Could not parse event: %s', JSON.stringify(e));
            }
        });
    });
};
