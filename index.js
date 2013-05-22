/**
 * Defines a plugin to use express as flatiron routing mechanism.
 */

/*! Module dependencies. */

var express = require('express'),
    methods = require('methods');

/*! Module exports. */

exports.name = 'express';
exports.attach = attach;

/**
 * Attaches the plugin to a flatiron application.
 *
 * @param {Object} options The plugin supports the following options:
 *
 *   * `instance` - Provide an already created express instance to use.
 */

function attach(options) {
  var app = this;
  app.express = express;

  /*! Populate the express router. */

  app.http = app.router = options.instance || express();
  app.use = use.bind(app, app.use);

  /*! Populate the routing verbs provided by express on the application. */

  methods.concat([ 'del' ]).forEach(function (method) {
    app[method] = app.router[method].bind(app.router);
  });
}

/**
 * A proxy function to make attachment of express middleware through the normal
 * use method possible.
 *
 * @param {Function} origUse The original flatiron `use()` method.
 *
 * @api private
 */

function use(origUse) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof args[0] === 'function') {

    /*! If the first argument is a function we can be sure that this is an
     * express middleware so we attach it to the router instance. */

    return this.router.use.apply(this.router, args);
  } else {

    /*! Otherwise we dispatch to the flatiron plugin mechanism. */

    return origUse.apply(this, args);
  }
}
