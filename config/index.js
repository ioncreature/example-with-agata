'use strict';

const
    {join, sep, extname} = require('path'),
    glob = require('glob'),
    {set} = require('lodash');

const
    env = process.env.NODE_ENV || 'dev',
    names = glob.sync('**/*.js', {cwd: join(__dirname, env), nodir: true});

module.exports = names.reduce((result, fileName) => {
    const name = String(fileName)
        .replace(extname(fileName), '')
        .replace(new RegExp(sep, 'g'), '.');

    set(result, name, require(`.${sep}${join(env, fileName)}`));

    return result;
}, {});
