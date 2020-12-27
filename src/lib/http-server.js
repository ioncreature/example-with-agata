'use strict';

const express = require('express'),
    http = require('http'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    {NotFound, InternalServerError} = require('yahel'),
    log = require('./logger');

class HttpServer {
    constructor(router) {
        this.app = createHttpApp(router);
        this.server = http.createServer(this.app);

        this.server.on('error', error => {
            if (error.code === 'EADDRINUSE') log.error('Port is already in use');
            else log.error(error);

            throw error;
        });

        this.server.on('listening', () => {
            log.info(`Server started on port ${this.server.address().port}`);
        });
    }

    async listen(port) {
        await new Promise((resolve, reject) => {
            this.server.listen(port, error => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    async close() {
        await new Promise((resolve, reject) => {
            this.server.close(error => {
                if (error) reject(error);
                else {
                    log.info('HTTP server stopped');
                    resolve();
                }
            });
        });
    }
}

module.exports = HttpServer;

function createHttpApp(httpRouter) {
    const app = express();

    app.disable('x-powered-by');
    app.enable('trust proxy');

    app.use(
        morgan('[:remote-addr] :method :url HTTP/:http-version :status [:res[content-length] b] [:response-time ms]', {
            stream: {write: msg => log.verbose(msg.trim())},
        }),
    );

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(httpRouter);

    app.use((req, res, next) => next(NotFound()));

    // eslint-disable-next-line
    app.use((error, req, res, next) => {
        const e = error instanceof Error ? error : InternalServerError(String(error)),
            status = isCodeValid(e.status) ? e.status : 500,
            message = e.message || '';

        res.status(status);
        res.json({error: message});

        if (status >= 500) log.error(`Server Error "${message}" at "${req.originalUrl}":`, e);
        else log.warn(`Status: ${status} at "${req.method} ${req.originalUrl}", reason: ${message}`);
    });

    return app;
}

function isCodeValid(code) {
    return Number.isInteger(code) && code >= 400 && code <= 599;
}
