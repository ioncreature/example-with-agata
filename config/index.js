'use strict';

const
    {existsSync} = require('fs'),
    {join, sep, extname} = require('path'),
    glob = require('glob'),
    {set, camelCase} = require('lodash');

const
    env = process.env.NODE_ENV || 'dev',
    folderExists = existsSync(join(__dirname, env)),
    names = glob.sync('**/*.js', {cwd: join(__dirname, env), nodir: true});

if (!folderExists)
    throw new Error(`There is no config for such env: "${env}"`);

module.exports = names.reduce((result, fileName) => {
    const name = String(fileName)
        .replace(extname(fileName), '')
        .replace(new RegExp(sep, 'g'), '.')
        .split('.')
        .map(camelCase)
        .join('.');

    set(result, name, require(`.${sep}${join(env, fileName)}`));

    return result;
}, {});
