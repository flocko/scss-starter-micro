/**
 * Available Tasks
 * gulp       - Starts local dev server and watches for file changes
 * gulp build - copy src content to app/ for release
 * gulp test  - html/js/css testing
 */


/**
 * Plugins
 * gulp
 * gulp-autoprefixer
 * gulp-load-plugins
 * gulp-plumber
 * gulp-sass
 * gulp-html-replace
 * run-sequence
 * gulp-uglify
 * gulp-concat
 */
var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');

/**
 * Options
 */
var src = {
  path : 'src/',
  scss : 'src/sass/**/*.scss',
  css  : 'src/css/',
  html : 'src/*.html',
  js   : 'src/js/**/*.js'
};

var build = {
  path : 'app/',
  css  : 'app/css/',
  html : 'app/*.html'
}

/**
 * Main tasks
 */
gulp.task('default', ['dev']);

// run-sequence until gulp 4.0
gulp.task('build', function() {
  runSequence('sass', ['copy:style','copy:html', 'minify:js'], 'html:replace');
});


/**
 * Sub tasks
 */
// start dev server and watch for file changes
gulp.task('dev', ['sass'], function() {
  browserSync({
    server: "./src"
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.html).on('change', reload);
  gulp.watch(src.js).on('change', reload);
});

// compile sass
gulp.task('sass', function() {
  gulp.src(src.scss)
  .pipe( plugins.plumber() )
  .pipe( plugins.sass( { outputStyle : 'compressed' }).on('error', plugins.sass.logError))
  .pipe( plugins.autoprefixer( {
    browsers: ['last 2 versions'],
      cascade: false
    }))        
  .pipe(gulp.dest(src.css))    
  .pipe(reload({stream: true}));
});

// concat all js files for build
gulp.task('minify:js', function() {
  return gulp.src(src.js)
  .pipe( plugins.plumber() )
  .pipe( plugins.concat('app.js') )
  .pipe( plugins.uglify() )
  .pipe( gulp.dest( build.path + 'js/') );
});

// replace links for build
gulp.task('html:replace', function() {
  gulp.src( build.html )
  .pipe( plugins.plumber() )
  .pipe( htmlreplace({
    'css' : 'css/style.css',
    'js'  : 'js/app.js'
  }))
  .pipe(gulp.dest( build.path ));
});

// copy files to app folder
gulp.task('copy:style', function() {
  return gulp.src( src.css + 'style.css' )
  .pipe( gulp.dest( build.css ) );
});

// copy html files to app folder
gulp.task('copy:html', function() {
  return gulp.src(src.path + '**/*.html')
  .pipe( gulp.dest( build.path ) );
});
