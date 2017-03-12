const path = require('path');
const { createConfig, entryPoint, setOutput } = require('@webpack-blocks/webpack2');

const { baseConfig, SOURCE_PATH, TEMP_PATH } = require('./shared.js');

const NODE_EXTERNAL_DEPS = ['babylon', 'babel-generator', 'babel-traverse', 'babel-types', 'babel-template'];

const excludeNodeDepsFromCompilation = () => () => ({
    externals: NODE_EXTERNAL_DEPS.map(dep => ({
        [dep]: `commonjs ${dep}`,
    })),
});

module.exports = createConfig.vanilla([
    entryPoint(path.resolve(SOURCE_PATH, 'index.js')),
    setOutput({
        path: TEMP_PATH,
        filename: 'index.js',
        libraryTarget: 'commonjs-module',
    }),
    baseConfig(),
    excludeNodeDepsFromCompilation(),
]);
