var error = require('gulp-error');
var gulp = require('gulp');
var paths = require('./paths');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

module.exports = function() {

  return gulp.src(paths.src)
    .pipe(error(uglify({mangle:true, preserveComments:'some'})))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(paths.dest));
}
