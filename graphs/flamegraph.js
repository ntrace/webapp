var spawn = require('child_process').spawn;
var net   = require('net');
var path  = require('path');
var duplexEmitter = require('duplex-emitter');

var centralPort = 9191;

module.exports = flamegraph;

var flamegraphExec = path.normalize(path.join(
  __dirname, '..', 'node_modules', 'stackvis', 'cmd', 'flamegraph'));

console.log('flamegraphExec:', flamegraphExec);

function flamegraph(req) {
  var stackvis = spawn(flamegraphExec);
  var central = duplexEmitter(net.connect(centralPort));
  central.emit('stream result', req.params.owner, req.params.repo, req.params.run);
  central.on('data', function(d) {
    stackvis.stdin.write(d);
  });
  central.once('end', function() {
    stackvis.stdin.end();
  });

  req.reply(stackvis.stdout);
};