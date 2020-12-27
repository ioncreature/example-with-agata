'use strict';

const mongoose = require('mongoose');

exports.singletons = ['mongo.connection'];

exports.start = async () => {
    const userScheme = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    });

    return mongoose.model('User', userScheme);
};
