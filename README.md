# injectify-loader

Build status: [![Build Status](https://travis-ci.org/vladimir-tikhonov/injectify-loader.svg?branch=master)](https://travis-ci.org/vladimir-tikhonov/injectify-loader)

A rewrite of [inject-loader](https://github.com/plasticine/inject-loader) which is using `babel` parser under the hood. It has the following advantages:
- more reliable parsing ([inject-loader#32](https://github.com/plasticine/inject-loader/issues/32))
- sourcemap support

API and behaviour are fully compatible with original inject-loader. Here is the copy of it's readme, all thanks go to [@plasticine](https://github.com/plasticine).

**💉👾 A Webpack loader for injecting code into modules via their dependencies**

This is particularly useful for writing tests where mocking things inside your module-under-test is sometimes necessary before execution.

### Installation

```bash
npm install injectify-loader --save-dev
```

or

```bash
yarn add injectify-loader --dev
```

### Usage

[Documentation: loaders](https://webpack.js.org/concepts/loaders/)

Use the inject loader by adding `injectify-loader!` when you use `require`, this will return a function that can be passed things to inject.

By default all `require` statements in an injected module will be altered to be replaced with an injector, though if a replacement it not specified the default will be used.

### Examples

Given some code in a module like this:

```javascript
// MyStore.js

var Dispatcher = require('lib/dispatcher');
var EventEmitter = require('events').EventEmitter;
var handleAction = require('lib/handle_action');

Dispatcher.register(handleAction, 'MyStore');
```

You can manipulate it’s dependencies when you come to write tests as follows:

```javascript
// All require statements are wrapped in an injector
var MyModuleInjector = require('injectify-loader!MyStore')
var MyModule = MyModuleInjector({
  'lib/dispatcher': DispatcherMock,
  'events': EventsMock,
  'lib/handle_action': HandleActionMock
})
```
