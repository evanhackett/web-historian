var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');


exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};


exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(err, data){
    callback(data.split('\n'));
  });
};


exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(urls){
    callback(urls.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback){
  url = '/' + url;
  fs.exists(exports.paths.archivedSites + url, function(exists){
    callback(exists);
  });
};

exports.downloadUrls = function(urls){
  _.each(urls, function(url) {
    if (!url) {
      return;
    }
    request('http://' + url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        fs.writeFile(exports.paths.archivedSites + '/' + url, body, function(err) {
          if (err) {
            console.log("error writing to file");
          }
        });
      }
    });
  });
};
