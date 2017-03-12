const path = require('path');

const SOURCE_PATH = path.resolve(__dirname, 'src');
const TEST_PATH = path.resolve(__dirname, 'test');
const TEMP_PATH = path.resolve(__dirname, 'tmp');

module.exports = {
    entry: path.resolve(TEST_PATH, 'tests.js'),

    output: {
        path: TEMP_PATH,
        filename: 'testBundle.js',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    SOURCE_PATH,
                    TEST_PATH,
                ],
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                },
            },
        ],
    },

    resolveLoader: {
        alias: {
            self: TEMP_PATH,
        },
    },

    target: 'node',
};
