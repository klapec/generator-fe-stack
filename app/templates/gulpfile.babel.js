import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gutil from 'gulp-util';
import babelify from 'babelify';
import browserify from 'browserify';
import watchify from 'watchify';
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

gulp.task('browserify', () => {
  return browserify(assetsPaths.scripts + 'app.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('dist/'))
    .pipe(bs.stream());
});

gulp.task('watchify', () => {
  const bundler = watchify(browserify(assetsPaths.scripts + 'app.js', watchify.args));
  bundler.transform(babelify);

  function rebundle() {
    return bundler.bundle()
      .on('error', errorAlert)
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe($.uglify())
      .pipe(gulp.dest('dist/'))
      .pipe(bs.stream());
  }

  bundler.on('update', rebundle);

  return rebundle();
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

gulp.task('default', ['watchify'], () => {
  bs.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('*.html', bs.reload);
  gulp.watch(assetsPaths.sass + '**/*', ['styles']);
  gulp.watch(assetsPaths.vendorScripts + '*.js', ['vendorScripts']);
});

gulp.task('build', ['styles', 'vendorScripts', 'browserify'], () => {
  return gulp.src([assetsPaths.sass + 'app.scss', 'package.json'], { base: './' })
    .pipe($.removeEmptyLines())
    .pipe(gulp.dest('.'));
});
