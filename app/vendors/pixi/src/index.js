// run the polyfills
require('./polyfill');

var core = module.exports = require('./core');

// add core plugins.
core.extras         = require('./extras');
core.filters        = require('./filters');
core.interaction    = require('./interaction');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');
core.ticker         = require('./ticker');

// export a premade loader instance
core.loader = new core.loaders.Loader();

// mixin the deprecation features.
Object.assign(core, require('./deprecation'));

// export to global
global.PIXI = core;

// export for AMD if necessary
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
        return core;
    });
}
