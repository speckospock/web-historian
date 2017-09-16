var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

var routes = {
  index: httpHelper.serveAssets.bind(this, archive.paths.index),
  loading: httpHelper.serveAssets.bind(this, archive.paths.loading)
};

exports.handleRequest = function (req, res) {
  console.log(req.url);
  if (req.method === 'GET') {
    if (!(req.url === '/' || req.url === '/favicon.ico' || req.url === '/styles.css')) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('Page not found');
    }
    routes.index(res);
  } else if (req.method === 'POST') {
    var data;
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      data = chunk.split('=')[1];
    });
    req.on('end', () => {
      archive.isUrlArchived(data, (isArchived) => {
        if (isArchived) {
          var archivePath = path.join(archive.paths.archivedSites, data, '/index.html');
          res.writeHead(302, {
            'Content-Type': 'text/html'
          });
          console.log('original res status code: ', res.statusCode);
          httpHelper.serveAssets(archivePath, res);
        } else {
          archive.addUrlToList(data);
          routes.loading(res);
        }
        return;
      });
    });
  }
};

exports.routes = routes;
