const path = require('path');

const SOURCE_PATH = path.resolve(__dirname, 'src');
const TEMP_PATH = path.resolve(__dirname, 'tmp');

const NODE_EXTERNAL_DEPS = ['babylon', 'babel-generator', 'babel-traverse', 'babel-types', 'babel-template'];

module.exports = {
    entry: path.resolve(SOURCE_PATH, 'index.js'),

    output: {
        path: TEMP_PATH,
        filename: 'index.js',
        libraryTarget: 'commonjs',
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: SOURCE_PATH,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                },
            },
        ],
    },

    target: 'node',
    externals: NODE_EXTERNAL_DEPS.map(commonjsDep => ({
        [commonjsDep]: `commonjs ${commonjsDep}`,
    })),
};
