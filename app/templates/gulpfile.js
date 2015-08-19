var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var gutil = require('gulp-util');
var browserify = require('browserify');
var bs = require('browser-sync').create();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
<% if(includeLostGrid) { %>var lost = require('lost');<% } %>

var $ = gulpLoadPlugins();

var assetsPaths = {
  sass: 'sass/',
  scripts: 'scripts/',
  vendorScripts: 'scripts/vendors/'
};

function errorAlert(err) {
  gutil.log(gutil.colors.red(err.toString()));
  this.emit('end');
}

gulp.task('default', function() {
  bs.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(assetsPaths.sass + '**/*', ['styles']);
  gulp.watch(assetsPaths.scripts + '*.js', ['scripts']);
  gulp.watch(assetsPaths.vendorScripts + '*.js', ['vendorScripts']);
});

gulp.task('styles', function() {
  return gulp.src(assetsPaths.sass + 'app.scss')
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.sourcemaps.init())
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
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('scripts', function() {
  return browserify(assetsPaths.scripts + 'app.js')
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('vendorScripts', function() {
  return gulp.src(assetsPaths.vendorScripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['styles', 'scripts', 'vendorScripts'], function() {
  return gulp.src([assetsPaths.sass + 'app.scss', 'package.json'], { base: './' })
    .pipe($.removeEmptyLines())
    .pipe(gulp.dest('.'));
});
