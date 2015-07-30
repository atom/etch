const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const karma = require('karma');
const standard = require('gulp-standard')

const manifest = require('./package.json');
const config = manifest.nodeBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.join(__dirname, 'dist');

// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

gulp.task('standard', function () {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

// Build two versions of the library
gulp.task('build', ['standard', 'clean'], function() {

  // Create our output directory
  mkdirp.sync(destinationFolder);
  return gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({ blacklist: ['useStrict'] }))
    .pipe(gulp.dest(destinationFolder));
});

// Make babel preprocess the scripts the user tries to import from here on.
require('babel/register');

gulp.task('test', ['standard'], function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// An alias of test
gulp.task('default', ['test']);
