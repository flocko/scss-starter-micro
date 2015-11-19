/**
 * ---------------------------
 * Available Tasks
 * ---------------------------
 * gulp exec  - install bower components and copy files
 * gulp       - start local dev server and watch for file changes
 * gulp build - copy src content to app/ for release
 * gulp test  - html/js/css testing
 */


/**
 * ---------------------------
 * Plugins
 * ---------------------------
 * gulp
 * gulp-autoprefixer
 * gulp-load-plugins
 * gulp-plumber
 * gulp-sass
 * gulp-html-replace
 * run-sequence
 * gulp-uglify
 * gulp-concat
 * gulp-jshint
 * gulp-parker
 * gulp-imagemin
 * gulp-bower
 * gulp-filter
 * main-bower-files
 */

var gulp           = require('gulp');
var plugins        = require('gulp-load-plugins')();
var browserSync    = require('browser-sync');
var reload         = browserSync.reload;
var htmlreplace    = require('gulp-html-replace');
var runSequence    = require('run-sequence');
var mainBowerFiles = require('main-bower-files');

/**
 * ---------------------------
 * ENV Variables
 * ---------------------------
 */

// Ruby installed on machine
// if needed get from
// https://www.ruby-lang.org
var ENV_RUBY = false;

// ruby gem csscss: gem install csscss
var ENV_CSSCSS = false;



/**
 * ---------------------------
 * Paths and Options
 * ---------------------------
 */

var path = {
  build : 'app/',
  dev   : 'src/'
}

var options = {
  sass  : {
    files : 'sass/**/*.scss',
    file  : 'sass/style.scss',
    dest  : 'sass/'
  },
  css   : {
    files : 'css/**/*.css',
    file  : 'style.css',
    dest  : 'css/'
  },
  html  : {
    files : '*.html',
    file  : 'index.html'
  },
  js    : {
    files : 'js/**/*.js',
    file  : 'app.js',
    dest  : 'js/'
  },
  img   : {
    files : 'img/**.*',
    dest  : 'img/',
  },
  fonts : {
    dest : 'fonts/'
  }
}

/**
 * ---------------------------
 * Main tasks
 * ---------------------------
 */

gulp.task('default', ['dev']);
gulp.task('test', ['test:js', 'test:css']);

// run-sequence until gulp 4.0
gulp.task('build', function(done) {
  runSequence('sass', ['copy:style','copy:html', 'copy:img', 'minify:js'], 'html:replace', done);
});

gulp.task('exec', function(done) {
  runSequence('bower:install', 'bower:copy', done);
});

/**
 * ---------------------------
 * Development Tasks
 * ---------------------------
 */

// start dev server and watch for file changes
gulp.task('dev', ['sass'], function() {
  browserSync({
    server: "./src"
  });

  gulp.watch(path.dev + options.sass.files, ['sass']);
  gulp.watch(path.dev + options.html.files).on('change', reload);
  gulp.watch(path.dev + options.js.files).on('change', reload);
});

// compile sass
gulp.task('sass', function() {
  gulp.src( path.dev + options.sass.files )
  .pipe( plugins.plumber() )
  .pipe( plugins.sass( { outputStyle : 'compressed' }).on('error', plugins.sass.logError))
  .pipe( plugins.autoprefixer( {
    browsers: ['last 2 versions'],
      cascade: false
    }))
  .pipe(gulp.dest( path.dev + options.css.dest ))
  .pipe(reload({stream: true}));
});


/**
 * ---------------------------
 * Build Tasks
 * ---------------------------
 **/

// concat all js files for build
gulp.task('minify:js', function() {
  return gulp.src(path.dev + options.js.files)
  .pipe( plugins.plumber() )
  .pipe( plugins.concat( options.js.file ) )
  .pipe( plugins.uglify() )
  .pipe( gulp.dest( path.build + options.js.dest ) );
});

// replace links for build
gulp.task('html:replace', function() {
  gulp.src( path.build + options.html.files )
  .pipe( plugins.plumber() )
  .pipe( htmlreplace({
    'css' : options.css.dest + options.css.file,
    'js'  : options.js.dest + options.js.file
  }))
  .pipe(gulp.dest( path.build ));
});

// copy images and perform minification
gulp.task('copy:img', function() {
  return gulp.src( path.dev + options.img.files )
  .pipe( plugins.plumber() )
  .pipe( plugins.imagemin({
    progressive: true
  }) )
  .pipe( gulp.dest( path.build + options.img.dest ) );
});

// copy files to app folder
gulp.task('copy:style', function() {
  return gulp.src( path.dev + options.css.dest + options.css.file )
  .pipe( gulp.dest( path.build + options.css.dest ) );
});

// copy html files to app folder
gulp.task('copy:html', function() {
  return gulp.src( path.dev + options.html.files )
  .pipe( gulp.dest( path.build ) );
});


/**
 * ---------------------------
 * Testing Tasks
 * ---------------------------
 **/

// test js files with jshint
gulp.task('test:js', function() {
  gulp.src( path.dev + options.js.files )
  .pipe( plugins.plumber() )
  .pipe( plugins.jshint() )
  .pipe( plugins.jshint.reporter( 'default' ) );
});

// css details
gulp.task('test:css', function() {
  gulp.src( path.dev + options.css.dest + options.css.file )
  .pipe( plugins.plumber() )
  .pipe( plugins.parker() );

  if (ENV_RUBY && ENV_CSSCSS) {
    gulp.src( path.dev + options.css.dest + options.css.file )
    .pipe( plugins.plumber() )
    .pipe( plugins.csscss() );
  }
});


/**
 * ---------------------------
 * Exec Tasks
 * ---------------------------
 **/

// install bower components
gulp.task('bower:install', function() {
  return plugins.bower({ cmd: 'install'});
});

// copy bower files
gulp.task('bower:copy', function() {
  var jsFilter   = plugins.filter('*.js');
  var fontFilter = plugins.filter(['*.eot', '*.woff', '*.svg', '*.ttf']);

  return gulp.src( mainBowerFiles({includeDev:true}) )
  .pipe( plugins.plumber() )
  .pipe( fontFilter )
  .pipe( gulp.dest( path.dev + options.fonts.dest ) );
});