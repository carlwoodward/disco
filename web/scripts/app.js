var discoApp = angular.module('disco', [
  'ngRoute',
  'AppController',
  'RepoController'
]);

discoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/repo', { templateUrl: '/templates/repo.html', controller: 'RepoController' })
  }
]);
