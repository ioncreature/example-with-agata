### Example using Agata dependency injection library

It is a simple backend chat application, split to 3 services:
1. `auth` provides login/logout methods
2. `chat-api` for retrieving and sending messages
3. `updates` which provide WebSocket connection to receive new chat messages

It also uses 2 singletons: `redis` and `mongo` and plugin `publish` to send PubSub messages

There is single chat room which receives messages when user log in or send message 

It is also provides `action` tests, I'm planning to add component tests(test endpoints) and subsystem tests(tests interaction between microservices)

