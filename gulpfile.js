const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const isparta = require('isparta');
const karma = require('karma');

const manifest = require('./package.json');
const config = manifest.nodeBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.join(__dirname, 'dist');

// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

function createLintTask(taskName, files) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe($.plumber())
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jscs())
      .pipe($.jshint.reporter('fail'));
  });
}

// Lint our source code
createLintTask('lint-src', ['src/**/*.js'])

// Lint our test code
createLintTask('lint-test', ['test/**/*.js'])

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function() {

  // Create our output directory
  mkdirp.sync(destinationFolder);
  return gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe($.babel({ blacklist: ['useStrict'] }))
    .pipe(gulp.dest(destinationFolder));
});

// Make babel preprocess the scripts the user tries to import from here on.
require('babel/register');

gulp.task('coverage', function(done) {
  gulp.src(['src/*.js'])
    .pipe($.plumber())
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
      .pipe($.istanbul.writeReports())
      .on('end', done);
    });
});

gulp.task('test', ['lint-src', 'lint-test'], function (done) {
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
