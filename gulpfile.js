// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var webserver = require('gulp-webserver');
var nodemon= require('gulp-nodemon');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

 
// gulp.task('templates', function() {
//   var YOUR_LOCALS = {'views': '/views'};
 
//   gulp.src('./lib/*.jade')
//     .pipe(jade({
//       locals: YOUR_LOCALS
//     }))
//     .pipe(gulp.dest('./dist/'))
// });
gulp.task('start', function () {
  nodemon({
    script: './bin/www'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' },
  open: true
  })
})

 
// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe(webserver({
//       livereload: true,
//       directoryListing: true,
//       open: true
//     }));
// });
// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch','start']);
