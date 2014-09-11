var gulp = require('gulp');

gulp.task('js', require('./tasks/js'));
gulp.task('sync', require('./tasks/sync'));
gulp.task('watch', require('./tasks/watch'));
gulp.task('default', ['sync', 'watch']);
