(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = injectifyLoader;

var _injectify2 = __webpack_require__(1);

var _injectify3 = _interopRequireDefault(_injectify2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: sourcemaps
function injectifyLoader(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    var _injectify = (0, _injectify3.default)(this, source),
        code = _injectify.code;

    return code;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = injectify;

var _babylon = __webpack_require__(7);

var babylon = _interopRequireWildcard(_babylon);

var _babelGenerator = __webpack_require__(3);

var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var _babelTraverse = __webpack_require__(5);

var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var _babelTypes = __webpack_require__(6);

var t = _interopRequireWildcard(_babelTypes);

var _wrapper_template = __webpack_require__(2);

var _wrapper_template2 = _interopRequireDefault(_wrapper_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function processRequireCall(path) {
    var dependencyString = path.node.arguments[0].value;
    path.replaceWith(t.logicalExpression('||', t.CallExpression(t.identifier('__getInjection'), [t.stringLiteral(dependencyString)]), path.node));

    return dependencyString;
}

function injectify(context, source) {
    var ast = babylon.parse(source);

    var dependencies = [];
    (0, _babelTraverse2.default)(ast, {
        CallExpression: function CallExpression(path) {
            if (t.isIdentifier(path.node.callee, { name: 'require' })) {
                dependencies.push(processRequireCall(path));
                path.skip();
            }
        }
    });

    if (dependencies.length === 0) {
        context.emitWarning('The module you are trying to inject into doesn\'t have any dependencies. ' + 'Are you sure you want to do this?');
    }

    var dependenciesArrayAst = t.arrayExpression(dependencies.map(function (dependency) {
        return t.stringLiteral(dependency);
    }));
    var wrappedSourceAst = (0, _wrapper_template2.default)({ SOURCE: ast, DEPENDENCIES: dependenciesArrayAst });
    return (0, _babelGenerator2.default)(wrappedSourceAst, null, source);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _babelTemplate = __webpack_require__(4);

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _babelTemplate2.default)('\n    module.exports = function __injector(__injections) {\n        __injections = __injections || {};\n\n        (function __validateInjection() {\n            var validDependencies = DEPENDENCIES;\n            var injectedDependencies = Object.keys(__injections);\n            var invalidInjectedDependencies = injectedDependencies.filter(function (dependency) {\n                return !validDependencies.includes(dependency);\n            });\n\n            if (invalidInjectedDependencies.length > 0) {\n                var validDependenciesString = \'- \' + validDependencies.join(\'\\n- \');\n                var injectedDependenciesString = \'- \' + injectedDependencies.join(\'\\n- \');\n                var invalidDependenciesString = \'- \' + invalidInjectedDependencies.join(\'\\n- \');\n\n                throw new Error(\'Some of the injections you passed in are invalid.\\n\' +\n                    \'Valid injection targets for this module are:\\n\' + validDependenciesString + \'\\n\' +\n                    \'The following injections were passed in:\\n\' + injectedDependenciesString + \'\\n\' +\n                    \'The following injections are invalid:\\n\' + invalidDependenciesString\n                );\n            }\n        })();\n\n        var module = { exports: {} };\n        var exports = module.exports;\n\n        function __getInjection(dependency) {\n            return __injections.hasOwnProperty(dependency) ? __injections[dependency] : null;\n        }\n\n        (function () {\n            SOURCE\n        })();\n\n        return module.exports;\n    }\n');

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-generator");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-template");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-traverse");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-types");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babylon");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ])));