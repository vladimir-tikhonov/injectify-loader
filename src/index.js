import * as babylon from 'babylon';
import generate from 'babel-generator';
import traverse from 'babel-traverse';
import template from 'babel-template';
import * as t from 'babel-types';

const injectorModuleTemplate = template(`
    module.exports = function __injector(__injections) {
        __injections = __injections || {};

        (function __validateInjection() {
            var validDependencies = DEPENDENCIES;
            var injectedDependencies = Object.keys(__injections);
            var invalidInjectedDependencies = injectedDependencies.filter(function (dependency) {
                return !validDependencies.includes(dependency);
            });

            if (invalidInjectedDependencies.length > 0) {
                var validDependenciesString = '- ' + validDependencies.join('\\n- ');
                var injectedDependenciesString = '- ' + injectedDependencies.join('\\n- ');
                var invalidDependenciesString = '- ' + invalidInjectedDependencies.join('\\n- ');

                throw new Error('Some of the injections you passed in are invalid.\\n' +
                    'Valid injection targets for this module are:\\n' + validDependenciesString + '\\n' +
                    'The following injections were passed in:\\n' + injectedDependenciesString + '\\n' +
                    'The following injections are invalid:\\n' + invalidDependenciesString
                );
            }
        })();

        var module = { exports: {} };
        var exports = module.exports;

        function __getInjection(dependency) {
            return __injections.hasOwnProperty(dependency) ? __injections[dependency] : null;
        }

        (function () {
            SOURCE
        })();

        return module.exports;
    }
`);

function processRequireCall(path) {
    const dependencyString = path.node.arguments[0].value;
    path.replaceWith(t.logicalExpression('||',
        t.CallExpression(t.identifier('__getInjection'), [t.stringLiteral(dependencyString)]),
        path.node)
    );

    return dependencyString;
}

function transform(context, source) {
    let ast = babylon.parse(source);

    const dependencies = [];
    traverse(ast, {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee, { name: 'require' })) {
                dependencies.push(processRequireCall(path));
                path.skip();
            }
        },
    });

    if (dependencies.length === 0) {
        context.emitWarning('The module you are trying to inject into doesn\'t have any dependencies. ' +
            'Are you sure you want to do this?');
    }

    const dependenciesAst = t.arrayExpression(
        dependencies.map(dependency => t.stringLiteral(dependency))
    );
    ast = injectorModuleTemplate({ SOURCE: ast, DEPENDENCIES: dependenciesAst });
    const result = generate(ast, null, source);
    return result.code;
}

// TODO: sourcemaps
export default function injectifyLoader(source) {
    if (this.cacheable) {
        this.cacheable();
    }
    return transform(this, source);
}
