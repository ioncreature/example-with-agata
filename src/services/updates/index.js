'use strict';

const {Server} = require('ws'),
    Router = require('express').Router,
    HttpServer = require('../../lib/http-server'),
    log = require('../../lib/logger');

const CHANNEL = {
    LOGIN: 'user-login',
    LOGOUT: 'user-logout',
    NEW_MESSAGE: 'new-message',
};

exports.singletons = ['redisSubscribe', 'config', 'redis'];
exports.actions = ['httpMiddleware.checkAuth'];

exports.start = async ({singletons: {redisSubscribe, config}, actions: {httpMiddleware}, state}) => {
    const router = Router();
    router.use(httpMiddleware.checkAuth);
    state.httpServer = new HttpServer(router);
    state.wsServer = new Server({
        server: state.httpServer.server,
        clientTracking: true,
    });

    await state.httpServer.listen(config.updates.port);
    redisSubscribe.on('message', (channel, message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            log.error('Got invalid message in Redis PubSub', error.stack);
            return;
        }

        switch (channel) {
            case CHANNEL.LOGIN:
                sendAll(CHANNEL.LOGIN, {at: Date.now(), from: data.name});
                return;
            case CHANNEL.LOGOUT:
                sendAll(CHANNEL.LOGOUT, {at: Date.now(), from: data.name});
                return;
            case CHANNEL.NEW_MESSAGE:
                sendAll(CHANNEL.NEW_MESSAGE, {at: data.at, from: data.from, text: data.text});
                return;
            default:
                log.warn('What have I received?', JSON.stringify(data));
        }
    });

    redisSubscribe.subscribe([CHANNEL.LOGIN, CHANNEL.LOGOUT, CHANNEL.NEW_MESSAGE]);

    function sendAll(channel, data) {
        state.wsServer.clients.forEach(socket => {
            socket.send(JSON.stringify([channel, data]));
        });
    }
};

exports.stop = async ({state}) => {
    await (state.httpServer && state.httpServer.close());
};
