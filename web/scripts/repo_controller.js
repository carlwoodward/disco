var RepoController = angular.module('RepoController', []);

RepoController.controller('RepoController', ['$scope', '$http', '$routeParams',
  function ($scope, $http, $routeParams) {
    var clientParams = '&client_id=c3a2cf5bc90344e47858&client_secret=650c7e530b49c3d89126d928991bf8e4eaf129d1'

    var transformSummary = function(commit) {
      commit["short_sha"] = commit.sha.substring(0, 8);
      commit["formatted_date"] = moment(commit.commit.author.date).format("DD MMM YYYY");
      var message = commit.commit.message;
      commit["title"] = message.substring(0, message.indexOf("\n") == -1 ? message.length : message.indexOf("\n"));
      return commit;
    };

    var transformDetail = function(commit) {
      commit["formatted_date"] = moment(commit.commit.author.date).format("DD MMM YYYY h:mm:ss a");
      var message = commit.commit.message;
      var index = message.indexOf("\n");
      commit["title"] = message.substring(0, index == -1 ? message.length : index);
      commit["body"] = "";
      if(index != -1) {
        commit["body"] = message.substring(index + 1, message.length);
      }
      for(var i = 0; i < commit.files.length; i++) {
        commit.files[i].lines = commit.files[i].patch.split('\n');
        console.log(commit.files[i].lines);
      }
      return commit;
    };

    var url = 'https://api.github.com/repos/' + $routeParams.owner + '/' + $routeParams.repo + '/commits?callback=JSON_CALLBACK' + clientParams;
    $http.jsonp(url).success(function(response) {
      $scope.commits = (response.data || []).map(function(commit) {
        return transformSummary(commit);
      });

      if($scope.commits.length > 0) {
        var commitSummary = $scope.commits[0];
        $http.jsonp(commitSummary.url + '?callback=JSON_CALLBACK' + clientParams).success(function(response) {
          $scope.commit = transformDetail(response.data);
        });
      }
    });
  }]
);
