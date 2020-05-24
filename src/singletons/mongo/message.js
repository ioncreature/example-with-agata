'use strict';

const mongoose = require('mongoose');

exports.singletons = ['mongo.connection'];

exports.start = async() => {
    const messageSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    });

    return mongoose.model('Message', messageSchema);
};
