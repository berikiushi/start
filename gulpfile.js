'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
//var csso = require('postcss-csso');
var pug = require('gulp-pug');


gulp.task('sass', function () {
  return gulp.src('./src/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded', errLogToConsole: true }).on('error', sass.logError))
    .pipe(postcss([ autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }) ]))
    //.pipe( postcss([ csso() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream({match: "**/*.css"}));
});


gulp.task('html', function () {
  return gulp.src('./src/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./dist'));
});


gulp.task('image', function () {
  return gulp.src('./src/assets/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./dist/assets/images'));
});


gulp.task('js', function () {
  return gulp.src('./src/js/*js')
    .pipe(gulp.dest('./dist/js'));
});


gulp.task('fonts', function() {
  return gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'))
})


gulp.task('serve', ['sass'], function () {
  browserSync.watch(['./src/main.scss', 'src/scss/*.scss', 'src/components/**/*.scss'], function () {
    gulp.start('sass');
  });

  browserSync.watch(['./src/*.pug', 'src/components/**/*.pug'], function () {
    gulp.start('html');
  });

  browserSync.watch('./src/js/*.js', function () {
    gulp.start('js');
  });

  browserSync.watch('./src/assets/images/**/*', function () {
    gulp.start('image');
  });

  browserSync.watch('./src/assets/fonts/**/*', function () {
    gulp.start('fonts');
  });

  browserSync.watch('./dist/assets/images/**/*', function () {
    browserSync.reload();
  });

  browserSync.watch('./dist/*.html').on('change',  browserSync.reload);

  browserSync.init({
    server: './dist'
  });
});


gulp.task('dev', ['sass', 'html', 'image', 'js', 'fonts', 'serve']);

gulp.task('default', ['dev']);