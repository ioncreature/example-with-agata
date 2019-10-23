'use strict';

exports.singletons = ['config', 'redis'];

exports.fn = ({singletons: {config, redis}}) => {
    const client = redis.mainClient;

    /**
     * @alias message.getMessages
     * @return {Array<{name: string, text: string, at: number}>}
     */
    return async() => {
        const list = await client.lrangeAsync('messages', 0, config.common.maxMessages - 1);

        return list.map(JSON.parse).reverse();
    };
};
