# Services for development

## Development services

There are several services for local run and development.
They run as 3rd-party docker images in containers under docker-compose.

### postgres

Single postgresql server.
Used by the platform and the applications.

### redis

Single redis server
It's used as cache implementation for prosumer-demo app.

### redis-commander

UI to admin/use the redis

### meter-db

Based on QuestDB.
It's a persistent storage to hold history timeseries/timeline data of the meters.

### nginx

For now, it's commented/non-used.
Front web server to host/provide both the server and the client under the same origin.
The platform/applications should work in such configuration.
Uncomment/use it, if it needs.
