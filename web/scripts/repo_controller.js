var RepoController = angular.module('RepoController', []);

RepoController.controller('RepoController', ['$scope', '$http', '$routeParams', '$location', 'marked', 'TransformerService', 'GithubUrlService',
  function ($scope, $http, $routeParams, $location, marked, TransformerService, GithubUrlService) {
    $scope.viewMode = 'commits'; // Other option is issue.

    $scope.loadIssue = function(issueNumber) {
      var issueUrl = GithubUrlService.issueUrl($routeParams, issueNumber);
      $http.jsonp(issueUrl).success(function(response) {
        $scope.issue = response.data;
        $scope.issue['markdown_body'] = marked($scope.issue.body);
      });
      var commentsUrl = GithubUrlService.issueCommentsUrl($routeParams, issueNumber);
      $http.jsonp(commentsUrl).success(function(response) {
        $scope.issueComments = response.data;
        $scope.issueComments.forEach(function(issueComment) {
          issueComment['markdown_body'] = marked(issueComment.body);
        });
      });
      $scope.viewMode = 'issue';
    };

    $scope.hideIssue = function() {
      $scope.viewMode = 'commits';
    };

    $scope.commitSummaryClass = function(commit) {
      if($scope.commit) {
        if(commit.sha === $scope.commit.sha) {
          return 'selected';
        }
      }
      return '';
    };

    $scope.findNextPage = function(meta) {
      for(var i = 0; i < meta['Link'].length; i++) {
        var link = meta['Link'][i];
        if(link[1]['rel'] === 'next') {
          return link[0];
        }
      }
      return null;
    };

    $scope.show = function(commit) {
      if($scope.commits.length > 0) {
        var commitSummary = commit;
        $http.jsonp(commitSummary.url + '?callback=JSON_CALLBACK' + GithubUrlService.clientParams).success(function(response) {
          $scope.commit = TransformerService.transformDetail(response.data);
        });
      }
    };

    $scope.gotoNextPage = function() {
      if($scope.nextPage !== null) {
        $http.jsonp($scope.nextPage.replace(/angular.callbacks._\d+/, 'JSON_CALLBACK')).success(function(response) {
          $scope.commits = $scope.commits.concat((response.data || []).map(function(commit) {
            return TransformerService.transformSummary(commit);
          }));

          $scope.nextPage = $scope.findNextPage(response.meta);
        });
      }
    };

    var repoUrl = GithubUrlService.repoUrl($routeParams);
    $http.jsonp(repoUrl).success(function(response) {
      $scope.repo = response.data;
    });

    var commitsUrl = GithubUrlService.commitsUrl($routeParams);
    $http.jsonp(commitsUrl).success(function(response) {
      $scope.commits = (response.data || []).map(function(commit) {
        return TransformerService.transformSummary(commit);
      });

      $scope.nextPage = $scope.findNextPage(response.meta);

      if($scope.commits.length > 0) {
        var commitSummary = $scope.commits[0];
        $http.jsonp(commitSummary.url + '?callback=JSON_CALLBACK' + GithubUrlService.clientParams).success(function(response) {
          $scope.commit = TransformerService.transformDetail(response.data);
        });
      }
    });
  }]
);
