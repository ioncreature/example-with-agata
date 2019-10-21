'use strict';

const
    Router = require('express').Router,
    bodyParser = require('body-parser'),
    HttpServer = require('../../lib/http-server');


exports.localActionsPath = './routes';
exports.singletons = ['config'];


exports.start = async({
    singletons: {config},
    actions: {httpMiddleware, user},
    localActions,
    state,
}) => {
    state.httpServer = new HttpServer(getRouter({actions, localActions}));
    await state.httpServer.listen(config.auth.port);
};


exports.stop = async({state}) => {
    await (state.httpServer && state.httpServer.close());
};


function getRouter({actions, localActions: {}}) {
    const router = Router();

    router.use(bodyParser.urlencoded());
    router.use(bodyParser.json());

    router.post('/api/auth/login', );

    return router;
}
