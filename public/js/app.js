var App = angular.module('nTrace', []);

App.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/app', {
      templateUrl: '/partials/index.html'
    }).
    when('/repo/:owner/:repo/runs/:run', {
      templateUrl: '/partials/run.html',
      controller: 'RunCtrl',
      reloadOnSearch: false
    }).
    when('/repo/:owner/:repo', {
      templateUrl: '/partials/repo.html',
      controller: 'RepoCtrl'
    });
});

