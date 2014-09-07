var discoApp = angular.module('disco', [
  'ngRoute',
  'ngSanitize',
  'AppController',
  'RepoController'
]);

discoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:owner/:repo', { templateUrl: '/templates/repo.html', controller: 'RepoController', reloadOnSearch: false })
  }
]);
