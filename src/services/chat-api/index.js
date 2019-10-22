'use strict';

const
    {join} = require('path'),
    Router = require('express').Router,
    HttpServer = require('../../lib/http-server');


exports.localActionsPath = join(__dirname, '/routes');
exports.singletons = ['config', 'redis'];


exports.start = async({state, singletons: {config}}) => {
    const router = Router();

    // todo: implement http apis

    state.httpServer = new HttpServer(router);
    await state.httpServer.listen(config.chatApi.port);
};


exports.stop = async({state}) => {
    await (state.httpServer && state.httpServer.close());
};
