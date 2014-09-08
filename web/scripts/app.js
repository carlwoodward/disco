var discoApp = angular.module('disco', [
  'ngRoute',
  'ngSanitize',
  'emoji',
  'hc.marked',
  'AppController',
  'RepoController'
]);

// discoApp.config(['marked', function(marked) { marked.setOptions({gfm: true}); }]);

discoApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:owner/:repo', { templateUrl: '/templates/repo.html', controller: 'RepoController', reloadOnSearch: false })
  }
]);
