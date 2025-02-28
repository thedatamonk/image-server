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
## Load testing
1. We wil use artillery to perform load testing.
2. All the performance metrics are maintained and can be visualised in Artillery cloud.

**Run load testing**
- Create artillery-test.yaml in your project root folder.
- Run the following command - 
    ```
    artillery run artillery-test.yaml --record --key <ENTER_API_KEY>
    ```
## Upcoming
1. Bunny CDN integration to server images efficiently.
2. Benchmark the 2 approaches - async vs sync.
