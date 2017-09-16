var archive = require('../helpers/archive-helpers.js');
var queue = [];


archive.readListOfUrls((urls) => {
  if (urls.length) {
    urls.forEach((url) => {
      archive.isUrlArchived(url, (archived) => {
        if (!archived) {
          archive.downloadUrls([url]);
        }
      });
    });
  }
});
console.log('from htmlfetcher:', queue);
// pass array of urls archive helpers'
// archive.urls.forEach((url) => {
//   archive.isUrlArchived(url, (archived) => {
//     if (!archived) {
//       archive.downloadUrls([url]);
//     }
//   });
// });

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
// read list of urls
// push urls into queue
// filter queue
//   is url archived and see if index file exists
//    if not, queue urls (push to list of urls to download)
// pass queue into downloadUrls
