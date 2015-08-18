import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';

function errorAlert(err) {
  gutil.log(gutil.colors.red(err.toString()));
  this.emit('end');
}

gulp.task('default', () => {
  gulp.watch('index.js', ['script']);
});

gulp.task('script', () => {
  return gulp.src('index.js')
    .pipe(plumber({ errorHandler: errorAlert }))
    .pipe(babel())
    .pipe(gulp.dest('app'));
});
