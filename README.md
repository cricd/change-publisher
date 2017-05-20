# cricd-score-publisher
This websocket endpoint allows subscribers to be notified when the score of a cricket match changes including the results of the last ball which caused it to change.
It is intended to provide a component to assist the [cricd](https://github.com/ryankscott/cricd) project which is an open platform for cricket scoring

## Running the service in Docker
This endpoint is dependent on a connection to an EventStore instance which alerts to new cricd events. The host, port, authentication credentials and Eventstore stream name are all configured using the following environment variables: `EVENTSTORE_HOST`, `EVENTSTORE_PORT`, `EVENTSTORE_USER`, `EVENTSTORE_PASSWORD`, `EVENTSTORE_STREAM`
It is also dependent on a [cricd-score-processor](https://github.com/bradleyscott/cricd-score-processor) service to provide the latest score. The host and port are configured using the following environment variables: `SCOREPROCESSOR_HOST`, `SCOREPROCESSOR_PORT`

You can specify these environment variables when running the docker container. For example `docker run -d -p 3100:3100 -e EVENTSTORE_HOST=172.18.0.2 SCOREPROCESSOR_HOST=172.18.0.3 bradleyscott/cricd-change-publisher`

Alternatively, you can clone the [code repository for this service](https://github.com/bradleyscott/cricd-change-publisher) and use Docker-Compose to spin up a environment containing both EventStore and this service which removes the need to perform these steps

## Using the endpoint
This service exposes a websocket endpoing at port 3100 by default which listens for subscribers. The endpoint takes 1 query string parameter: match (Id of the match) which filters the change events. An example client webpage is viewable on [Github](https://github.com/bradleyscott/cricd-change-publisher/blob/master/index.html)