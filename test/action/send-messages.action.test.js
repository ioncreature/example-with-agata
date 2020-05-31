'use strict';

const broker = require('../../src/broker');

describe('Action "message.send-message"', () => {
    let sendMessage;

    beforeAll(async() => {
        sendMessage = await broker.mockAction('message.sendMessage');
    });

    it.each([
        [undefined, undefined],
        ['alex', undefined],
        ['alex', 100],
    ])(
        'should throw on invalid params, path: %p %p',
        async(from, message) => {
            await expect(sendMessage(from, message)).rejects.toThrow();
        },
    );
});
