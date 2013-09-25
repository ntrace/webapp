#!/usr/bin/env node
var net           = require('net');
var duplexEmitter = require('duplex-emitter');

var owner  = process.argv[2];
var repo   = process.argv[3];
var run    = process.argv[4];

var centralPort = 9191;

var cli = net.connect(centralPort);
var central = duplexEmitter(cli);

central.on('data', onData);
central.emit('stream result', owner, repo, run);

function onData(d) {
	process.stdout.write(d);
}