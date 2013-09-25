var spawn = require('child_process').spawn;
var net   = require('net');
var path  = require('path');
var duplexEmitter = require('duplex-emitter');

var centralPort = 9191;

module.exports = flamegraph;

var flamegraphExec = path.normalize(path.join(
  __dirname, '..', 'node_modules', 'stackvis', 'cmd', 'flamegraph'));

console.log('flamegraph exec:', flamegraphExec);

function flamegraph(req) {
  var stackvis = spawn(flamegraphExec);
  stackvis.on('error', onError);

  var cli = net.connect(centralPort);
  cli.on('error', onError);
  var central = duplexEmitter(cli);
  central.on('error', onError);
  central.emit('stream result', req.params.owner, req.params.repo, req.params.run);
  central.on('data', function(d) {
    stackvis.stdin.write(d);
  });
  central.once('end', function() {
    stackvis.stdin.end();
  });

  req.reply(stackvis.stdout);

  function onError() {
    try {
      stackvis.kill();
      cli.end();
    } catch(err) { console.error(err); }
  }
};