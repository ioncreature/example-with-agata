'use strict';

const {join} = require('path'),
    Router = require('express').Router,
    HttpServer = require('../../lib/http-server');

exports.localActionsPath = join(__dirname, '/routes');

exports.singletons = ['config', 'redis'];

exports.actions = ['httpMiddleware.checkAuth'];

exports.start = async ({singletons: {config}, actions: {httpMiddleware}, localActions: {login, logout}, state}) => {
    const router = Router();

    router.post('/api/auth/login', login);
    router.post('/api/auth/logout', httpMiddleware.checkAuth, logout);

    state.httpServer = new HttpServer(router);
    await state.httpServer.listen(config.auth.port);
};

exports.stop = async ({state}) => {
    await (state.httpServer && state.httpServer.close());
};
