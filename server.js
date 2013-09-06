var Hapi    = require('hapi');

var options = require('./options');
var server  = module.exports = new Hapi.Server('0.0.0.0', 8080, options);

require('./routes');