global.RunCtrl  = RunCtrl;

var moment      = require('moment');
var ansi        = require('ansi-to-html');
var convertAnsi = new ansi();

function RunCtrl($scope, $routeParams, $http, WebSocket) {
  WebSocket($scope, 'ws://localhost:8081', onConnected);

  var repo      = $routeParams.owner + '/' + $routeParams.repo;
  var run       = $routeParams.run;
  $scope.owner  = $routeParams.owner;
  $scope.repo   = $routeParams.repo;
  $scope.run    = run;

  function onConnected(server) {
    var result = [];
    $scope.streams = {
      events: [],
      out:    []
    };

    var startTime;

    var repo = $routeParams.owner + '/' + $routeParams.repo;
    server.emit('follow', {run: run});

    server.on('result', onResult);

    function onResult(_run, stream, data, when) {
      if (run == _run) {
        switch (stream) {
          case 'control':
            onControl(data);
            break;
          case 'events':
            onEvent(data, when);
            break;
          case 'stdout':
          case 'stderr':
            var s = $scope.streams.out;
            data = escape(data);
            s.push(data);
            break;
          case 'result':
            s.push(data);
            break;
        }
        $scope.$digest();
      }
    }

    function onEvent(data, when) {
      when = moment(Number(when));
      if (! startTime) {
        startTime = when;
        when = when.format("YYYY/MM/DD HH:mm:ss");
      } else {
        when = when.diff(startTime, 'seconds') + ' s';
      }

      $scope.streams.events.push({
        level:   data.level || 'info',
        label:   levelAndCodeToLabel(data.level, data.code),
        message: data.message,
        code:    data.code,
        stack:   data.stack,
        when:    when
      });
    }

    function onControl(data) {
      var stream = data.stream;
      var event = data.event;
      if (stream == 'result' && event == 'end') buildGraphs();
    }

    function buildGraphs() {
      var url = '/repo/' + repo + '/runs/' + run + '/graphs/flamegraph';
      //$scope.flamegraph = url;
      $http.get(url).
        success(function(data) {
          console.log('data is here');
          $scope.flamegraph = data;
        }).
        error(function(data) {
          alert(data);
        });
    }
  }
};

var codeToLabelMap = {
  start:  'success',
  finish: 'success'
};

var levelToLabelMap = {
  'trace': 'info',
  'info' : 'success',
  'error': 'danger'
};

function levelAndCodeToLabel(level, code) {
  var label;
  if (code) label = codeToLabelMap[code];
  if (! label) label = levelToLabelMap[level];
  return label || 'info';
}

function escape(s) {
  s = s.replace(/ /g, '&nbsp;');
  s = s.replace(/\n/g, '<br>');
  s = convertAnsi.toHtml(s);
  return s;
}