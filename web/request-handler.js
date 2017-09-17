var path = require('path');
var archive = require('../helpers/archive-helpers.js');
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
      console.log('from handle request: ', req.url);
      var newUrl = req.url.split('/')[1];
      archive.isUrlArchived(newUrl, (archived) => {
        if (archived) {
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          var pathToFile = path.join(__dirname, '../archives/sites', req.url, '/index.html').toString();
          console.log('this is checking for file\'s existence before fs.readFile: ', fs.existsSync(archive.paths.index));
          fs.readFile(pathToFile, 'utf8', (error, data) => {
            console.log('this is the latest path related log: ', pathToFile);
            console.log('Does file exist??????: ', fs.existsSync(pathToFile));
            if (error) {
              res.writeHead(404, {
                'Content-Type': 'text/plain'
              });
              console.log('error: ', error);
              res.end('Something messed up.');
            } else {
              console.log('html content should be showing here: ', data);
              res.end(data);
            }
          });
        } else {
          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
          res.end('Page not found');
        }
      });
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
          archive.readListOfUrls();
          routes.loading(res);
        }
        return;
      });
    });
  }
};

exports.routes = routes;
