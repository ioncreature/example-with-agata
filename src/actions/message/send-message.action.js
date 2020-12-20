'use strict';

const
    {BadRequest} = require('yahel'),
    {isString} = require('lodash');


exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'new-message'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    /**
     * @alias message.sendMessage
     * @param {string} from
     * @param {string} text
     */
    return async(from, text) => {
        if (!isString(from))
            throw BadRequest('Sender name have to be string');

        if (!isString(text))
            throw BadRequest('Parameter "text" have to be string');

        const message = {from, text, at: Date.now()};

        await redis
            .pipeline()
            .lpush(config.redis.MESSAGES_KEY, JSON.stringify(message))
            .ltrim(config.redis.MESSAGES_KEY, 0, config.common.maxMessages - 1)
            .exec();

        await publish(message);

        return message;
    };
};
