var DuplexEmitter   = require('duplex-emitter');
var WSStream        = require('wsstream/browser');
var ReconnectInject = require('reconnect/inject');

var Reconnect = ReconnectInject(function(path) {
  var s = WSStream(path);
  s.once('open', onOpen);
  return s;

  function onOpen() {
    s.emit('connect');
  }
});

var App = angular.module('nTrace');
App.factory('WebSocket', function() {

  return connect;

  function connect(scope, path, cb) {
    var r = Reconnect(onStream);
    r.connect(path);

    function onStream(stream) {

      scope.$on('$destroy', function() {
        r.reconnect = false;
        stream.end();
      });

      cb(DuplexEmitter(stream));

    }
  }



});