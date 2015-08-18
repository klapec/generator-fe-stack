import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gutil from 'gulp-util';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
<% if(includeLostGrid) { %>import lost from 'lost';<% } %>

const $ = gulpLoadPlugins();
const bs = browserSync.create();

const assetsPaths = {
  sass: 'sass/',
  scripts: 'scripts/',
  vendorScripts: 'scripts/vendors/'
};

function errorAlert(err) {
  gutil.log(gutil.colors.red(err.toString()));
  this.emit('end');
}

gulp.task('default', () => {
  bs.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(assetsPaths.sass + '**/*', ['styles']);
  gulp.watch(assetsPaths.scripts + '*.js', ['scripts']);
  gulp.watch(assetsPaths.vendorScripts + '*.js', ['vendorScripts']);
});

gulp.task('styles', () => {
  return gulp.src(assetsPaths.sass + 'app.scss')
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sass({
      precision: 10
    }))<% if(includeLostGrid) { %>
    .pipe($.postcss([
      lost()
    ]))<% } %>
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('scripts', () => {
  return browserify(assetsPaths.scripts + 'app.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('vendorScripts', () => {
  return gulp.src(assetsPaths.vendorScripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('build', ['styles', 'scripts', 'vendorScripts']);
