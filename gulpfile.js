/**
 * Load node modules
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var run = require('run-sequence');
var log = plugins.util.log;

/**
 * Define build options
 */
var options = {

  // default
  default: {
    tasks: [ 'connect', 'watch' ]
  },

  // css files
  css: {
    files: 'src/css/*.css',
    file: 'src/css/style.css',
    destination: 'src/css'
  },

  // connect to local server
  connect: {
    port: 9000,
    base: 'http://localhost',
    root: 'src'
  },

  // sass
  sass: {
    files : 'src/sass/**/*.scss',
    destination : 'src/css'
  },

  //watch
  watch: {
    files: function() {
      return [
        options.sass.files
      ]
    },
    run: function() {
      return [
        [ 'compile:sass' ]
      ]
    }
  }
}


/**
 * Task list
 */

// default
gulp.task( 'default', options.default.tasks );

// connect
gulp.task( 'connect', function() {
  plugins.connect.server( {
    root: [ options.connect.root ],
    port: options.connect.port,
    base: options.connect.base,
    livereload: true
  });
});

// compile:sass
gulp.task( 'compile:sass', function() {
  gulp.src( options.sass.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.sass( { outputStyle : 'compressed' }).on('error', plugins.sass.logError))
    .pipe( plugins.autoprefixer( {
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe( gulp.dest( options.sass.destination ))
    .pipe( plugins.connect.reload() );
});

// test css
gulp.task( 'test:css', function() {
  gulp.src( options.css.file )
  .pipe( plugins.plumber() )
  .pipe( plugins.parker() )

  gulp.src( options.css.file )
  .pipe( plugins.plumber() )
  .pipe( plugins.csscss() )
});


// watch
gulp.task( 'watch', function() {
  var watchFiles = options.watch.files();

  watchFiles.forEach( function( files, index ) {
    gulp.watch( files, options.watch.run()[ index ] );
  });
});
