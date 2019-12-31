'use strict';

const mongoose = require('mongoose');

exports.singletons = ['config'];
exports.start = async({state, singletons: {config}}) => {
    state.connection = await mongoose.connect(config.mongo.url);
};

exports.stop = async({state}) => {
    await state.connection.close();
};
