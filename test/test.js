var assert     = require('assert'),
    HTTPServer = require('../');

describe('HTTPServer', function() {
    describe('#constructor', function () {
        it('should return a `HTTPServer` object without options', function () {
            return assert.equal(new HTTPServer() instanceof HTTPServer, true);
        });
        it('should throw an error with invalid options', function () {
            return assert.throws(function() {
                new HTTPServer({
                    bullshit: "Throw please.."
                });
            });
        });
    });
    describe('#connections', function() {
        var server;

        before(function() {
            server = new HTTPServer();
        });

        it('should be an empty array without adding connection', function() {
            return assert.deepEqual(server.connections(), []);
        });
        it('add a connection to this HTTP server', function() {
            return server.connection({host: '127.0.0.1', port: 2000})
            .then(function(result) {
                return assert.equal(result, server);
            });
        });
        it('should be an array with only one element: our new connection', function() {
            return assert.deepEqual(server.connections(), ["http://127.0.0.1:2000"]);
        });
    });
    describe('#routes', function() {
        var server;

        before(function() {
            server = new HTTPServer();
        });

        it('should be an empty array without adding route', function() {
            return assert.deepEqual(server.routes(), []);
        })
    });
    describe('#plugins', function() {
        var server;

        before(function() {
            server = new HTTPServer();
            return server.connection({host: '127.0.0.1', port: 2000});
        });

        it('add an empty plugin', function() {
            return server.plugin(require('./empty_plugin.js'))
            .then(function() {
                return assert.ok(true);
            })
        });
        it('add a basic plugin', function() {
            return server.plugin(require('./basic_plugin.js'))
            .then(function(err) {
                return assert.ok(true);
            })
        });
        it('route list should list plugin routes', function() {
            return assert.deepEqual(server.routes(), [{
                method: 'get',
                connection: 'http://127.0.0.1:2000',
                path: '/test'
            }]);
        });
    });
});
