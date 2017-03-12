module.exports = {
    'extends': ['airbnb-base'],
    'rules': {
        'indent': ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],

        'import/no-extraneous-dependencies': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
    },
    'env': {
        'mocha': true
    },
};
