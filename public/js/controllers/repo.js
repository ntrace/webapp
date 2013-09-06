global.RepoCtrl = RepoCtrl;

var moment = require('moment');

function RepoCtrl($scope, $routeParams, WebSocket) {
  WebSocket($scope, 'ws://localhost:8081', onConnected);

  var repo     = $routeParams.owner + '/' + $routeParams.repo;
  $scope.owner = $routeParams.owner;
  $scope.repo  = $routeParams.repo;

  function onConnected(server) {
    $scope.runs  = [];
    var repo = $routeParams.owner + '/' + $routeParams.repo;
    server.emit('follow', {repo: repo});

    server.on('run', onRun);

    function onRun(_repo, run) {
      if (repo == _repo && (typeof run == 'object')) {
        run.href = "/repo/" + run.repo + '/runs/' + run.id;
        run.started = moment(run.started).format("YYYY/MM/DD HH:mm:ss");
        $scope.runs.unshift(run);
        $scope.$digest();
      }
    }
  }
};