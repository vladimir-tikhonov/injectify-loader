const path = require('path');
const { group } = require('@webpack-blocks/webpack2');

const ROOT_PATH = path.resolve(__dirname, '..');
const SOURCE_PATH = path.resolve(ROOT_PATH, 'src');
const TEST_PATH = path.resolve(ROOT_PATH, 'test');
const TEMP_PATH = path.resolve(ROOT_PATH, 'tmp');

const babelLoader = () => () => ({
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
});

const nodeTarget = () => () => ({
    target: 'node',
});

const baseConfig = () => group([
    babelLoader(),
    nodeTarget(),
]);

module.exports = {
    baseConfig,
    SOURCE_PATH,
    TEST_PATH,
    TEMP_PATH,
};
