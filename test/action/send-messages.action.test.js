'use strict';

const broker = require('../../src/broker');

describe('Action "message.send-message"', () => {
    let sendMessage;
    let messagePublished = false;

    beforeAll(async () => {
        sendMessage = await broker.mockAction('message.sendMessage', {
            plugins: {
                publish: () => {
                    messagePublished = true;
                },
            },
        });
    });

    beforeEach(() => {
        messagePublished = false;
    });

    it.each([
        [undefined, undefined],
        ['Alex', undefined],
        ['Alex', 100],
    ])('should throw on invalid params, path: %p %p', async (from, message) => {
        await expect(sendMessage(from, message)).rejects.toThrow();
    });

    it('should send message', async () => {
        const message = await sendMessage('Alex', 'hi');

        expect(messagePublished).toBe(true);
        expect(message.from).toEqual('Alex');
        expect(message.text).toEqual('hi');
        expect(typeof message.at).toBe('number');
    });
});
