var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

var _urls = [];
// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // read contents of archives/sites.txt
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      console.log('sorry in pulledURLs');
    } else {
      _urls = data.split('\n');
      console.log('we ignored the callback, sorry.');
    }
  });
  // append to _url
};

exports.isUrlInList = (url, callback = _.identity) => {
  // look at cached urls
  // return boolean
  exports.readListOfUrls();
  let contained = _urls.reduce((memo, el) => memo || (el === url), false);
  return callback(contained);
  // return true;
  // if (contained) {
  //   callback(url);
  //   return true;
  // } else {
  //   return false;
  // }
};

exports.addUrlToList = (url, callback = _.identity) => {
  // if isUrlInList on passed url returns false
  exports.isUrlInList(url, (newUrl) => {
    _urls.append(newUrl);
    fs.appendFile(exports.paths.list, JSON.stringify(newUrl), (err, data) => {
      if (err) {
        console.log('sorry.  Add url.');
      } else {
        callback(url);
        console.log('Write successful.');
      }
    });
  });
  //   append url to array
  //   serialize/stringify then write url to archives/sites.txt
};

exports.isUrlArchived = function(url, callback) {
  // check sites folder to see if full site has been archived
  // return boolean
};

exports.downloadUrls = function(urls) {
  // call helper function (download worker) with list of urls
};
