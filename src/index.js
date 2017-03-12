import injectify from './injectify.js';

// TODO: sourcemaps
module.exports = function injectifyLoader(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    const { code } = injectify(this, source);
    return code;
};
