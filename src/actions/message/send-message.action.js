'use strict';

const
    {BadRequest} = require('yahel');


exports.singletons = ['redis', 'config'];

exports.plugins = {
    publish: {channel: 'new-message'},
};

exports.fn = ({singletons: {redis, config}, plugins: {publish}}) => {
    const client = redis.mainClient;

    /**
     * @alias message.sendMessage
     * @param {string} from
     * @param {string} text
     */
    return async(from, text) => {
        if (!from)
            throw BadRequest('Sender name is required');

        if (!text)
            throw BadRequest('Parameter "text" is required');

        const message = {from, text, at: Date.now()};

        await client
            .batch([
                ['lpush', 'messages', JSON.stringify(message)],
                ['ltrim', 'messages', 0, config.common.maxMessages - 1],
            ])
            .execAsync();

        await publish(message);

        return message;
    };
};
