var browser = require('browser-sync');
var log = require('gulp-log');
var paths = require('./paths');

module.exports = function() {

  var files = [
    '*/*.html',
    '*/*.js',
    '*/*.css'
  ];

  var config = {
    files: files,
    debugInfo: false,
    notify: false,
    open: false,
    server: {
      baseDir: paths.dest
    }
  };

  browser(config,
  function(err, bs) {
    log('BrowserSync local on', bs.options.urls.local);
    log('BrowserSync external on', bs.options.urls.external);
  });
}
