var path   = require('path');
var server = require('./server');
var graphs = require('./graphs');

var ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

/// /:owner/:repo/graphs/flamegraph

server.route({
  method: 'GET',
  path: '/repo/{owner}/{repo}/runs/{run}/graphs/flamegraph',
  handler: graphs.flamegraph,
  config: {
    cache: {
      mode: 'client',
      expiresIn: ONE_YEAR
    }
  }
});


/// Public

server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path:    __dirname + '/public',
      listing: false,
      index:   true
    }
  }
});


/// Angular routes, handled by Angular

var angularHandler = {
  file: path.normalize(__dirname + '/public/app/index.html')
};

/// /:owner/:repo/runs/:run

server.route({
  method: 'GET',
  path: '/repo/{owner}/{repo}/runs/{run}',
  handler: angularHandler
});


/// /:owner/:repo

server.route({
  method: 'GET',
  path: '/repo/{owner}/{repo}',
  handler: angularHandler
});
