To setup MongoDB, Docker is the fastest way. Run the following commands in your terminal - 
```
docker pull mongodb/mongodb-community-server:latest

docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```