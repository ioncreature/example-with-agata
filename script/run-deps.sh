# Stop and remove all
docker stop -t 0 red mongo
docker rm red mongo

docker run --name red -it -p 6379:6379 -d redis
docker run --name mongo -it -p 27017:27017 -d mongo