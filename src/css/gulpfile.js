'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
function clean(cb) {
  // body omitted
  cb();
}

function compile(cb) {
  gulp.src('./src/index.less')
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['ie > 9', 'last 2 versions'],
    cascade: false
  }))
  .pipe(cssmin())
  .pipe(gulp.dest('./src'));
  cb();
}
function combine(cb) {
  gulp.src(['src/theme-chalk/index.css','src/index.css'])
  .pipe(concat('index.css'))
  .pipe(gulp.dest('./lib'));
  cb();
}

function copyfont(cb) {
  gulp.src(['./src/fonts/**','./src/theme-chalk/fonts/**'])
  .pipe(cssmin())
  .pipe(gulp.dest('./lib/fonts'));
  cb();
}

exports.build = gulp.series(clean, gulp.parallel(compile, copyfont,combine));