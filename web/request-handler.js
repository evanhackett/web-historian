var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var urlParser = require('url');

var actions = {
  'GET': function(req, res) {
    var parts = urlParser.parse(req.url);
    var asset = parts.pathname;

    if (asset === '/') {
      asset = '/index.html';
    }

    if (asset.indexOf('.') === -1) {
      res.writeHead(404);
      res.end('Bad url: ' + asset);
      return;
    }

    httpHelpers.serveAssets(res, asset, function(data) {
      res.writeHead(200);
      res.end(data);
    });

  },

  'POST': function(req, res) {
    httpHelpers.collectData(req, function(data) {
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              httpHelpers.sendRedirect(res, '/' + url);
            } else {
             httpHelpers.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httpHelpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];

  if (action) {
    action(req, res);
  } else {
    res.writeHead(404);
    res.end("Server doesn't support method: " + req.method);
  }
};
