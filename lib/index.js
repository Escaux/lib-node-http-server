'use strict';

// Import some libraries
var fs = require('fs'),
    Hapi = require('hapi-lts');

module.exports = HTTPServer;

/**
 * Construct a new HTTP server.
 * @constructor
 * @param {object} options - Options of the HTTP server.
 */
function HTTPServer(options) {
    this.server = new Hapi.Server(options);
}

/**
 * Add a new connection to HTTP server configuration.
 * @see Hapi documentation.
 * @param {array} connection - An object representing the HTTP connection.
 * @return {Promise}
 */
HTTPServer.prototype.connection = function(connection) {
    var self = this;

    return new Promise(function(resolve, reject) {
        if (connection.util && typeof connection.util.cloneDeep === 'function') {
            connection = connection.util.cloneDeep(connection);
        }

        if (connection && connection.tls && connection.tls.key && connection.tls.cert) {
            if (connection.tls.key.indexOf('\n') === -1) {
                connection.tls.key = fs.readFileSync(connection.tls.key);
            }
            if (connection.tls.cert.indexOf('\n') === -1) {
                connection.tls.cert = fs.readFileSync(connection.tls.cert);
            }
        }

        try {
            self.server.connection(connection);
            resolve(self);
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * List connections of this HTTP server.
 * @return {array} Array of string which represents every connections.
 */
HTTPServer.prototype.connections = function() {
    return this.server.connections.map(function(connection) {
        var info = connection.info;
        return info.protocol + '://' + info.host + ':' + info.port
    });
};

/**
 * Start HTTP server listening.
 * @return {Promise}
 */
HTTPServer.prototype.start = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.server.start(function(err) {
            if (err) {
                return reject(err);
            }

            return resolve(self);
        });
    });
};

/**
 * Add one or more route.
 * @see Hapi documentation: `Hapi.Server.route`
 * @param {object|array} route - The route(s) to add.
 * @return {Promise} Adding route can throws exception, this exception will
 *         reject the promise and can be catched through standard Promise error
 *         handling.
 */
HTTPServer.prototype.route = function(route) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.server.route(route);
        resolve(self);
    });
};

/**
 * Add a plugin.
 * @see Hapi documentation: `Hapi.Server.plugin`
 * @param {function} plugin - The plugin registration function.
 * @param {object} plgnOptions - Optional options passed to the registration
 *        function when called.
 * @param {object} regOptions - Optional registration options (different from
 *        the options passed to the registration function)
 * @return {Promise}
 */
HTTPServer.prototype.plugin = function(plugin, plgnOptions, regOptions) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.server.register({
            register: plgnOptions,
            options: plgnOptions
        }, regOptions || {}, function(err) {
            if (err) {
                return reject(err);
            }

            return resolve(self);
        });
    });
};

/**
 * Retrieve informations about service.
 * @return {object} An object representing server state.
 */
HTTPServer.prototype.info = function() {
    return this.server.info || server.connections.map(function(connection) {
        return connection.info;
    });
};

/**
 * Prints the current status of the server.
 * @return {string} Summary of this HTTP server's connections and routes.
 */
HTTPServer.prototype.toString = function() {
    var output = '';
    var connections = this.server.connections;

    for (var i = 0; i < connections.length; i++) {
        if (i) {
            output += '\n';
        }

        var info = connections[i].info;
        var table = connections[i].table();

        output += info.protocol + '://' + info.host + ':' + info.port;
        output += ' (' + (info.started !== 0
            ? 'Running since ' + new Date(info.started).toISOString()
            : 'Not running') + ')';

        for (var j = 0; j < table.length; j++) {
            output += '\n\t' + table[j].method + ' ' + table[j].path;
        }
    }

    return output;
};
