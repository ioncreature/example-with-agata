'use strict';

const {createLogger, transports, format} = require('winston');

module.exports = createLogger({
    level: 'debug',
    defaultMeta: { service: 'Agata example' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
            ),
        }),
    ],
});
