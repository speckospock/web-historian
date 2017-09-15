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
  // var index = fs.readFile(archive.paths.index, 'utf8', (err, data) => {
  //   if (err) {
  //     console.log('sorry');
  //   } else {
  //     res.writeHead(200, {
  //       'Content-Type': 'text/html'
  //     });
  //     res.end(data);
  //   }
  // });
  if (req.method === 'GET') {
    routes.index(res);
  }
};

exports.routes = routes;