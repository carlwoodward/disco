var TransformerService = angular.module('TransformerService', []);

TransformerService.factory('TransformerService', function() {
  return {
    transformSummary: function(commit) {
      commit['short_sha'] = commit.sha.substring(0, 8);
      commit['formatted_date'] = moment(commit.commit.author.date).format('DD MMM YYYY');
      var message = commit.commit.message;
      commit['title'] = message.substring(0, message.indexOf('\n') == -1 ? message.length : message.indexOf('\n'));
      return commit;
    },

    transformDetail: function(commit) {
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

      commit.files.forEach(function(file) {
        var lines = file.patch.split('\n');
        file.lines = [];
        lines.forEach(function(line) {
          var kind = 'default';
          if(line.indexOf('+') === 0) {
            kind = 'add';
          }
          else if(line.indexOf('-') === 0) {
            kind = 'delete';
          }
          else if(line.indexOf('@@') === 0) {
            kind = 'marker';
          }
          else {
            kind = 'context';
          }
          var output = { value: line, kind: kind }
          file.lines.push(output);
        });
      });
      return commit;
    }
  };
});
