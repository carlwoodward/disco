var GithubUrlService = angular.module('GithubUrlService', []);

GithubUrlService.factory('GithubUrlService', function() {
  return {
    clientParams: '&client_id=1869ccc40d16d4b36b51&client_secret=a37eda7a98ba3a34b9d4d7bc3dac5ac0d082f7ee',

    issueUrl: function(routeParams, issueNumber) {
      return 'https://api.github.com/repos/' + routeParams.owner + '/' + routeParams.repo + '/issues/' + issueNumber + '?callback=JSON_CALLBACK' + this.clientParams;
    },

    issueCommentsUrl: function(routeParams, issueNumber) {
      return 'https://api.github.com/repos/' + routeParams.owner + '/' + routeParams.repo + '/issues/' + issueNumber + '/comments?callback=JSON_CALLBACK' + this.clientParams;
    },

    repoUrl: function(routeParams) {
      return 'https://api.github.com/repos/' + routeParams.owner + '/' + routeParams.repo + '?callback=JSON_CALLBACK' + this.clientParams;
    },

    commitsUrl: function(routeParams) {
      return 'https://api.github.com/repos/' + routeParams.owner + '/' + routeParams.repo + '/commits?callback=JSON_CALLBACK' + this.clientParams;
    }
  }
});
