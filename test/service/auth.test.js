'use strict';

const supertest = require('supertest');
const config = require('../../config');
const broker = require('../../src/broker');

const request = supertest(`http://localhost:${config.auth.port}`);

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        await broker.startService('auth');
    });

    it.each([
        {},
        {name: ''},
    ])('should return 400 on invalid request parameters: %p', async params => {
        await request //
            .post('/api/auth/login')
            .send(params)
            .expect('Content-Type', /json/)
            .expect(400);
    });

    it('should return login and return token', async () => {
        const {body} = await request
            .post('/api/auth/login')
            .send({name: `name-${Date.now()}`})
            .expect('Content-Type', /json/)
            .expect('Set-Cookie', /AUTH_TOKEN=/)
            .expect(200);

        expect(body.result.token).toBeTruthy();
    });
});
