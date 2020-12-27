'use strict';

const broker = require('../src/broker');

afterAll(async () => {
    await broker.stopAll();
});
