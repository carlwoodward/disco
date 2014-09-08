var discoApp = angular.module('disco', [
  'ngRoute',
  'ngSanitize',
  'emoji',
  'hc.marked',
  'AppController',
  'RepoController',
  'TransformerService',
  'GithubUrlService'
]);

discoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:owner/:repo', { templateUrl: '/templates/repo.html', controller: 'RepoController', reloadOnSearch: false })
  }
]);
