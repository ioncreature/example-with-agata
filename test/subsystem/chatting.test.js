'use strict';

const supertest = require('supertest');
const broker = require('../../src/broker');
const {createAccount, createWsClient, AUTH_URL, CHAT_URL} = require('../helpers');

describe('Chatting', () => {
    beforeAll(async () => {
        await broker.startService('auth');
        await broker.startService('updates');
        await broker.startService('chatApi');
    });

    test('Get messages about user login and logout', async () => {
        const receiver = await createAccount('receiver');
        const receiverWs = await createWsClient(receiver.token);
        const loginMessagePromise = receiverWs.waitFor('user-login', {from: 'sender'});

        const {
            body: {token},
        } = await supertest(AUTH_URL)
            .post('/api/auth/login')
            .send({name: 'sender'})
            .expect('Content-Type', /json/)
            .expect(200);

        const loginMessage = await loginMessagePromise;
        expect(loginMessage.from).toEqual('sender');

        const logoutMessagePromise = receiverWs.waitFor('user-logout', {from: 'sender'});
        await supertest(AUTH_URL)
            .post('/api/auth/logout')
            .set('Cookie', `AUTH_TOKEN=${token};`)
            .expect('Content-Type', /json/)
            .expect(200);

        const logoutMessage = await logoutMessagePromise;
        expect(logoutMessage.from).toEqual('sender');
    });

    test('Users exchange messages and receive updates', async () => {
        const [sender, receiver] = await Promise.all([createAccount('sender'), createAccount('receiver')]);
        const [senderWs, receiverWs] = await Promise.all([
            createWsClient(sender.token),
            createWsClient(receiver.token),
        ]);

        const senderPromise = senderWs.waitFor('new-message', {from: 'sender', text: 'Hello world'});
        const receiverPromise = receiverWs.waitFor('new-message', {from: 'sender', text: 'Hello world'});
        const {body: message} = await supertest(CHAT_URL)
            .post('/api/messages')
            .send({text: 'Hello world'})
            .set('Cookie', `AUTH_TOKEN=${sender.token};`)
            .expect('Content-Type', /json/)
            .expect(200);

        const [senderMsg, receiverMsg] = await Promise.all([senderPromise, receiverPromise]);

        expect(message).toEqual(senderMsg);
        expect(message).toEqual(receiverMsg);
    });
});
