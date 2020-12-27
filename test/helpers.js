'use strict';

require('jest-extended');
const {isMatch} = require('lodash');
const WebSocket = require('ws');
const config = require('../config');
const broker = require('../src/broker');
exports.DEFAULT_PASSWORD = 'Secret123';

exports.UPDATES_URL = `http://localhost:${config.updates.port}`;
exports.CHAT_URL = `http://localhost:${config.chatApi.port}`;
exports.AUTH_URL = `http://localhost:${config.auth.port}`;

/**
 * @param {string} [accountName]
 * @returns {Promise<{name: string, token: string}>}
 */
exports.createAccount = async accountName => {
    const signUp = await broker.mockAction('user.signUp');
    const name = accountName || `name-${Date.now()}`;
    const token = await signUp(name);

    return {name, token};
};

class WsClient {
    constructor(url, token) {
        this.promise = new Promise((resolve, reject) => {
            this.ws = new WebSocket(url, {headers: {cookie: `AUTH_TOKEN=${token}`}});

            this.ws.on('open', resolve);
            this.ws.on('error', reject);
        });
    }

    async waitFor(channel, filter) {
        return new Promise((resolve, reject) => {
            const ws = this.ws;

            const timer = setTimeout(() => reject(new Error('WS.waitFor: Timed out')), 2000);
            ws.on('message', function messageFilter(value) {
                const msg = parseJson(value);
                if (msg[0] === channel && isMatch(msg[1], filter)) {
                    clearTimeout(timer);
                    ws.removeEventListener('message', messageFilter);
                    resolve(msg[1]);
                }
            });
        });
    }
}

/**
 * @param {string} token
 * @return {Promise<WsClient>}
 */
exports.createWsClient = async token => {
    const client = new WsClient(exports.UPDATES_URL, token);
    await client.promise;
    return client;
};

function parseJson(value) {
    try {
        const data = JSON.parse(value);
        return !Array.isArray(data) || data.length < 2 ? undefined : data;
    } catch {
        return undefined;
    }
}
