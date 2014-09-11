var gulp = require('gulp');
var paths = require('./paths');

module.exports = function() {

  gulp.watch(paths.src,  ['js']);
}
