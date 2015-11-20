exports.register = function (server, options, next) {
    next();
};

exports.register.attributes = {
    name: 'empty-plugin',
    version: '1.0.0'
};
