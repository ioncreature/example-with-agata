'use strict';

describe('te', () => {
    it('a', () => {
        console.log(process.env.NODE_ENV); // eslint-disable-line
        console.log(process.env); // eslint-disable-line
        console.log(require('../../config')); // eslint-disable-line
    });
});