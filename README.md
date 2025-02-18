# Simple image server

## Prerequisites

1. Run rabbitmq server using Docker

2. Run mongodb using docker. 
```
docker pull mongodb/mongodb-community-server:latest

docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

## Demos

### Synchronous upload
```
node server.js
```
### Asynchronous upload
```
# run the server (publisher code is present here)
node server.js

# run the imageUploadWorkers (consumer code is present here)
node workers/imageUploadWorkers.js
```


## Upcoming
1. Load testing to test the limits of the system.
2. Bunny CDN integration to server images efficiently.
3. Log metrics of the service and analyse them by visualising them with grafana.