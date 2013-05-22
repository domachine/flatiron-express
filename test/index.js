var broadway = require('broadway'),
    methods = require('methods'),
    express = require('express'),
    expressPlugin,
    sinon = require('sinon'),
    should = require('should'),
    mockery = require('mockery');
describe('Express-Plugin', function () {
  describe('#use', function () {
    var app,
        origUse,
        meths = methods.concat([ 'del' ]),
        expressApi;
    before(function () {
      app = new broadway.App();
      expressApi = express();
      sinon.stub(expressApi, 'use');
      origUse = sinon.stub(app, 'use');
      mockery.enable({
        useCleanCache: true
      });
      mockery.registerMock('express', function () {
        return expressApi;
      });
      mockery.registerAllowables([
        '..',
        'methods'
      ]);
      expressPlugin = require('..');
    });
    it(
      'should initialize express and attach it to the application',
      function () {
        var middleware,
            plugin;
        middleware = function () {};
        plugin = {};
        expressPlugin.attach.call(app, {});
        app.use(middleware);
        expressApi.use.calledOnce.should.be.true;
        expressApi.use.args[0][0].should.equal(middleware);
        app.use(plugin);
        origUse.calledOnce.should.be.true;
        origUse.args[0][0].should.equal(plugin);
      }
    );
    after(function () {
      expressApi.use.restore();
      origUse.restore();
      mockery.deregisterAll();
      mockery.disable();
    });
  });
  describe('#attach', function () {
    var app,
        meths = methods.concat([ 'del' ]),
        expressApi;
    before(function () {
      app = new broadway.App();
      expressApi = express();
      meths.forEach(function (method) {
        sinon.stub(expressApi, method);
      });
      mockery.enable({
        useCleanCache: true
      });
      mockery.registerMock('express', function () {
        return expressApi;
      });
      mockery.registerAllowables([
        '..',
        'methods'
      ]);
      expressPlugin = require('..');
    });
    it(
      'should initialize express and attach it to the application',
      function () {
        var middleware,
            plugin;
        app.use(expressPlugin);
        meths.forEach(function (method) {
          app[method]();
          expressApi[method].thisValues[0].should.equal(app.router);
        });
        should.exist(app.http);
        should.exist(app.router);
      }
    );
    after(function () {
      meths.forEach(function (method) {
        expressApi[method].restore();
      });
      mockery.deregisterAll();
      mockery.disable();
    });
  });
});
