var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var insert = require('gulp-insert');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');


var CONFIG = {
	intro:
		'(function (angular) {\n' +
		'    "use strict";\n',
	outro: '\n}(window.angular));\n'
};


gulp.task('copy-js-libs', function () {
	return gulp.src('./lib/**/*.js')
		.pipe(gulp.dest('./dist/js/lib'));
});


gulp.task('build-js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(insert.prepend(CONFIG.intro))
        .pipe(insert.append(CONFIG.outro))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    //.pipe(sass({outputStyle: 'compressed'}))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer({browsers: [
    	'last 2 versions'
    ]}))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-html', ['build-js', 'copy-js-libs', 'sass'], function () {
  var target = gulp.src('./src/index.html');
  var sources = gulp.src(['./dist/js/lib/**/*.js', './dist/js/**/*.js', './dist/css/**/*.css'], {read: false});

  return target.pipe(inject(sources, {ignorePath: '/dist/', addRootSlash: false}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function () {
  return gulp.src('./dist')
    .pipe(webserver({
      host: '0.0.0.0',
      livereload: true,
      port: 8000,
      directoryListing: false
    }));
});


gulp.task('build', ['build-html']);


gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**/*', ['build']);
});


gulp.task('default', ['build']);
