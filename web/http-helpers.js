var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(asset, res, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  console.log('status code is here: ', res.statusCode);
  fs.readFile(asset, 'utf8', (err, data) => {
    if (err) {
      console.log('sorry');
    } else {
      if (!res.statusCode) {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
      }
      res.end(data);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
