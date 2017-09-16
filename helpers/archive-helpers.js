var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var nodeUrl = require('url');
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

exports.readListOfUrls = (callback = _.identity) => {
  // read contents of archives/sites.txt
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      console.log('sorry in pulledURLs');
    } else {
      _urls = data.split('\n');
      callback(_urls);
      console.log('we ignored the callback, sorry.');
    }
  });
  // append to _url
};

exports.isUrlInList = (url, callback = _.identity) => {
  // look at cached urls
  // return boolean
  exports.readListOfUrls(() => {
    let contained = _urls.reduce((memo, el) => memo || (el === url), false);
    // console.log('hello' + callback(contained));
    return callback(contained);
  });
};

exports.addUrlToList = (url, callback = _.identity) => {
  // if isUrlInList on passed url returns false
  if (!exports.isUrlInList(url)) {
    _urls.push(url);
    console.log(JSON.stringify(_urls));
    fs.writeFile(exports.paths.list, _urls.join('\n'), (err, data) => {
      if (err) {
        console.log('sorry.  Add url.');
      } else {
        callback(url);
        console.log('Write successful.');
      }
    });
  }
  console.log('what is the order?');
  // exports.isUrlInList(url, (isContained) => {
  //   console.log("isContained: " + isContained);
  //   // if(isContained)
  //   _urls.push(isContained);
    // fs.appendFile(exports.paths.list, JSON.stringify(newUrl), (err, data) => {
    //   if (err) {
    //     console.log('sorry.  Add url.');
    //   } else {
    //     callback(url);
    //     console.log('Write successful.');
    //   }
    // });
  // });
  //   append url to array
  //   serialize/stringify then write url to archives/sites.txt
};

exports.isUrlArchived = (url, callback = _.identity) => {
  // check sites folder to see if full site has been archived
  exports.readListOfUrls((urls) => {
    callback(_.contains(fs.readdirSync(exports.paths.archivedSites), url));
  });
  // return boolean
};

exports.downloadUrls = function(urls) {
  // iterate through urls
  console.log('in downloadUrls: ', JSON.stringify(urls));
  urls.forEach((url) => {
  //   make get request on current url on index page
    url = nodeUrl.parse(url);
    console.log(url.protocol);
    if (!url.protocol) {
      url.protocol = 'http:';
      url.slashes = true;
      url.hostname = url.href;
      url.href = url.protocol + '//' + url.href;
    }
    var fullUrl = url.protocol + '//' + url.host;
    console.log('this is the full url.....: ', fullUrl);
    console.log('protocol added?: ', url.protocol);
    console.log('url object........: ', JSON.stringify(url));
    http.get(url.href, (result) => {
      result.setEncoding('utf8');
      let rawData = '';
      result.on('data', (chunk) => {
        rawData += chunk;
      });
      result.on('end', () => {
        var pathName = './archives/sites/' + nodeUrl.parse(url).hostname;
        if (!fs.existsSync(pathName)) {
          fs.mkdirSync(pathName);
        }
        pathName += '/index.html';
        fs.writeFile(pathName, rawData, (error, data) => {
          if (!error) {
            setTimeout(() => {
              console.log('we wrote!!!!.....', fs.readdirSync(exports.paths.archivedSites));
            }, 1800);
          }
        });
      });
    });
  });
  //   read through index page and make request for each asset
  //   replace all source paths with new source paths
  //   save file
  // call helper function (download worker) with list of urls


};

// exports.downloadUrls(['http://www.google.com']);
