'use strict';

const {join} = require('path'),
    Router = require('express').Router,
    HttpServer = require('../../lib/http-server');

exports.singletons = ['config', 'redis'];
exports.actions = ['httpMiddleware.checkAuth'];
exports.localActionsPath = join(__dirname, '/routes');

exports.start = async ({state, singletons: {config}, actions: {httpMiddleware}, localActions}) => {
    const router = Router();

    router.get('/api/users', httpMiddleware.checkAuth, localActions.getUsers);
    router.get('/api/messages', httpMiddleware.checkAuth, localActions.getMessages);
    router.post('/api/messages', httpMiddleware.checkAuth, localActions.postMessage);

    state.httpServer = new HttpServer(router);
    await state.httpServer.listen(config.chatApi.port);
};

exports.stop = async ({state}) => {
    await (state.httpServer && state.httpServer.close());
};
