const path = require('path');
const { createConfig, entryPoint, setOutput } = require('@webpack-blocks/webpack2');

const { baseConfig, TEST_PATH, TEMP_PATH } = require('./shared.js');

const addSelfToLoaders = () => () => ({
    resolveLoader: {
        alias: {
            self: TEMP_PATH,
        },
    },
});

module.exports = createConfig.vanilla([
    entryPoint(path.resolve(TEST_PATH, 'tests.js')),
    setOutput({
        path: TEMP_PATH,
        filename: 'testBundle.js',
    }),
    baseConfig(),
    addSelfToLoaders(),
]);
