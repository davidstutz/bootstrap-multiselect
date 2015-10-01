'use strict';

var gulp = require('gulp'),
  minifyJs = require('gulp-jsmin'),
  rename = require('gulp-rename'),
  minifyCss = require('gulp-minify-css'),
  runSequence = require('run-sequence'),
  del = require('del');


gulp.task('default', function(done) {
  runSequence(['buildJs', 'buildCss'], done)
});

gulp.task('buildJs',['cleanJs'], function() {
  return gulp.src('./dist/js/*.js')
    .pipe(minifyJs())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
});


gulp.task('buildCss', ['cleanCss'], function() {
  return gulp.src('./dist/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('cleanJs', function(done) {
  return del([ './dist/js/*.min.js'], done);
});

gulp.task('cleanCss', function(done) {
  return del([ './dist/css/*.min.css'], done);
});