var RepoController = angular.module('RepoController', []);

RepoController.controller('RepoController', ['$scope', '$http', '$routeParams', '$location',
  function ($scope, $http, $routeParams, $location) {
    var clientParams = '&client_id=c3a2cf5bc90344e47858&client_secret=650c7e530b49c3d89126d928991bf8e4eaf129d1'
    $scope.viewMode = 'commits'; // Other option is issue.

    var transformSummary = function(commit) {
      commit['short_sha'] = commit.sha.substring(0, 8);
      commit['formatted_date'] = moment(commit.commit.author.date).format('DD MMM YYYY');
      var message = commit.commit.message;
      commit['title'] = message.substring(0, message.indexOf('\n') == -1 ? message.length : message.indexOf('\n'));
      return commit;
    };

    var transformDetail = function(commit) {
      commit['formatted_date'] = moment(commit.commit.author.date).format('DD MMM YYYY h:mm:ss a');
      var message = commit.commit.message;
      var index = message.indexOf('\n');
      commit['title'] = message.substring(0, index == -1 ? message.length : index);

      var issueMatch = commit['title'].match(/#(\d+)\s/);
      if(issueMatch) {
        commit['issue'] = issueMatch[1];
      }
      else {
        commit['issue'] = null;
      }

      commit['body'] = '';
      if(index != -1) {
        commit['body'] = message.substring(index + 1, message.length);
      }

      for(var i = 0; i < commit.files.length; i++) {
        var lines = commit.files[i].patch.split('\n');
        commit.files[i].lines = [];
        for(var j = 0; j < lines.length; j++) {
          var kind = 'default';
          if(lines[j].indexOf('+') === 0) {
            kind = 'add';
          }
          else if(lines[j].indexOf('-') === 0) {
            kind = 'delete';
          }
          else if(lines[j].indexOf('@@') === 0) {
            kind = 'marker';
          }
          else {
            kind = 'context';
          }
          var line = { value: lines[j], kind: kind }
          commit.files[i].lines.push(line);
        }
      }
      return commit;
    };

    $scope.loadIssue = function(issueNumber) {
      var issueUrl = 'https://api.github.com/repos/' + $routeParams.owner + '/' + $routeParams.repo + '/issues/' + issueNumber + '?callback=JSON_CALLBACK' + clientParams;
      $http.jsonp(issueUrl).success(function(response) {
        $scope.issue = response.data;
      });
      var commentsUrl = 'https://api.github.com/repos/' + $routeParams.owner + '/' + $routeParams.repo + '/issues/' + issueNumber + '/comments?callback=JSON_CALLBACK' + clientParams;
      $http.jsonp(commentsUrl).success(function(response) {
        $scope.issueComments = response.data;
      });
      $scope.viewMode = 'issue';
    };

    $scope.hideIssue = function() {
      $scope.viewMode = 'commits';
    };

    $scope.commitSummaryClass = function(commit) {
      if($scope.commmit && commit.sha === $scope.commit.sha) {
        return 'selected';
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
        $http.jsonp(commitSummary.url + '?callback=JSON_CALLBACK' + clientParams).success(function(response) {
          $scope.commit = transformDetail(response.data);
        });
      }
    };

    $scope.gotoNextPage = function() {
      if($scope.nextPage !== null) {
        $http.jsonp($scope.nextPage.replace(/angular.callbacks._\d+/, 'JSON_CALLBACK')).success(function(response) {
          $scope.commits = $scope.commits.concat((response.data || []).map(function(commit) {
            return transformSummary(commit);
          }));

          $scope.nextPage = $scope.findNextPage(response.meta);
        });
      }
    };

    var repoUrl = 'https://api.github.com/repos/' + $routeParams.owner + '/' + $routeParams.repo + '?callback=JSON_CALLBACK' + clientParams;
    $http.jsonp(repoUrl).success(function(response) {
      $scope.repo = response.data;
    });

    var commitsUrl = 'https://api.github.com/repos/' + $routeParams.owner + '/' + $routeParams.repo + '/commits?callback=JSON_CALLBACK' + clientParams;
    $http.jsonp(commitsUrl).success(function(response) {
      $scope.commits = (response.data || []).map(function(commit) {
        return transformSummary(commit);
      });

      $scope.nextPage = $scope.findNextPage(response.meta);

      if($scope.commits.length > 0) {
        var commitSummary = $scope.commits[0];
        $http.jsonp(commitSummary.url + '?callback=JSON_CALLBACK' + clientParams).success(function(response) {
          $scope.commit = transformDetail(response.data);
        });
      }
    });
  }]
);
