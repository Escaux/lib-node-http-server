exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/test',
        handler: function(request, reply) {
            return reply(true);
        }
    });
    
    next();
};

exports.register.attributes = {
    name: 'basic-plugin',
    version: '1.0.0'
};
