## Example using Agata dependency injection library

It is a simple backend chat application, split to 3 services:
1. `auth` provides login/logout methods
2. `chat-api` for retrieving and sending messages
3. `updates` which provide WebSocket connection to receive new chat messages

It also uses 2 singletons: `redis` and `mongo` and plugin `publish` to send PubSub messages

There is single chat room which receives messages when user log in or send message 

It is also provides `action` tests, I'm planning to add component tests(test endpoints) and subsystem tests(tests interaction between microservices)

### Tests

This repository demonstrates how to create 3 types of tests.

1. Actions - it is more like standard unit tests, placed in `./test/action`
2. Service or component tests. Used to check service API signatures, see at `./test/service`
3. Subsystem tests is a bunch of user cases which checks how services communicate to each other, see at `./test/subsystem`

With [Agata framework](https://github.com/ioncreature/agata) it is easy to bootstrap required dependencies, create mocks.
Agata framework takes all headache of dependency tree load, and you do not have to worry about it.

For example how to load action and all its dependencies:

```javascript
const sendMessage = await broker.mockAction('message.sendMessage');
```

Or this is the way to mock some dependencies. 
```javascript
const sendMessage = await broker.mockAction('message.sendMessage', {
    plugins: {
        publish: () => console.log('Published!'),
    },
});
```
