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
var paths = {
 scripts: ['bower_components/**/**/*.js'],
 css: ['bower_components/**/**/*.css'],
 dist: 'dist/'
};
var nodemon= require('gulp-nodemon');
var vendor = require('gulp-concat-vendor');
var mainBowerFiles = require('main-bower-files');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});
var dest = 'public/dist/'
// Lint Task
gulp.task('lint', function() {
  return gulp.src('js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('**/**/scss/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('dist/css'));
});
gulp.task('css', function() {
  gulp.src('bower_components/**/css/*.css')
  .pipe(concat('main.css'))
  .pipe(gulp.dest('dist'))
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
  gulp.src(['bower_components/**/js/*.js','bower_components/jQuery/jquery.min.js'])
  .pipe(concat('all.js'))
  .pipe(gulp.dest('dist'))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('js', function() {

  var jsFiles = ['bower_components/**/js/*'];

  gulp.src(plugins.mainBowerFiles().concat(jsFiles))
  .pipe(plugins.filter('*.js'))
  .pipe(plugins.concat('main.js'))
  .pipe(plugins.uglify())
  .pipe(gulp.dest(dest + 'js'));

});

// gulp.task('',function(){
//   return gulp.src(paths.scripts.concat(paths.css))
//   .pipe(gulp.dest(paths.dist));

// })
//  gulp.task('css', function() {

//   var cssFiles = ['src/css/*'];
//   var dest = '/public/';

//   gulp.src(plugins.mainBowerFiles().concat(cssFiles))
//     .pipe(plugins.filter('*.css'))
//     .pipe(plugins.concat('main.css'))
//     .pipe(plugins.uglify())
//     .pipe(gulp.dest(dest + 'css'));

// });

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['lint', 'scripts']);
  gulp.watch('scss/*.scss', ['sass']);
});


gulp.task('start', function () {
  nodemon({
    script: './bin/www',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' },
  })
})


// gulp.task("connect", function () {
//   connect.server({
//     root: ["app"],
//     livereload: true,
//     port: 8034,
//     middleware: function (connect) {
//       return [connect().use("/bower", connect.static("bower"))];
//     }
//   });
// });

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      // open: true
    }));
});
// Default Task
gulp.task('default', ['js','css','scripts','sass','watch','start']);
// gulp.task('default', ['lint', 'sass','templates','scripts','js','css', 'watch','start','webserver']);
