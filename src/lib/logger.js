'use strict';

const {createLogger, transports, format} = require('winston');

module.exports = createLogger({
    level: 'debug',
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.simple(),
            ),
        }),
    ],
});
