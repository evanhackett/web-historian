var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

// helper function to serve static files
exports.serveAssets = function(res, asset, callback) {
  var filePath = archive.paths.archivedSites;

  if (asset === '/index.html' || asset === '/loading.html') {
    filePath = archive.paths.siteAssets;
  }

  fs.readFile(filePath + asset, 'utf8', function(err, data) {
    callback(data);
  });
};

exports.collectData = function(request, callback) {
  var data = "";
  request.on("data", function(chunk) {
    data += chunk;
  });
  request.on("end", function() {
    callback(data);
  });
};

exports.sendResponse = function(res, obj, status) {
  status = status || 200;
  res.writeHead(status, headers);
  res.end(obj);
};

exports.sendRedirect = function(res, location, status) {
  status = status || 302;
  res.writeHead(status, {Location: location});
  res.end();
};



