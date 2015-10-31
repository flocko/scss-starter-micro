/**
 * Load node modules
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var run = require('run-sequence');
var log = plugins.util.log;
var debug = require('gulp-debug');

/**
 * Define build options
 */
var options = {

  // default
  default: {
    tasks: [ 'connect', 'watch' ]
  },

  styleguide: {
    tasks: [ 'sg_connect', 'sg_watch']
  },

  // css files
  css: {
    files: 'src/css/*.css',
    file: 'src/css/style.css',
    destination: 'src/css'
  },

  // html files
  html: {
    files: 'src/*.html',
  },

  // styleguide html files
  sg_html: {
    files: 'styleguide/*.html',
  },  

  // connect to local server
  connect: {
    port: 9000,
    base: 'http://localhost',
    root: 'src'
  },

  // connect to local server
  sg_connect: {
    port: 9001,
    base: 'http://localhost',
    root: 'styleguide'
  },  

  // sass
  sass: {
    files : 'src/sass/**/*.scss',
    destination : 'src/css'
  },

  // styleguide sass
  sg_sass: {
    files : 'styleguide/sass/**/*.scss',
    destination : 'styleguide/css'
  },

  //watch
  watch: {
    files: function() {
      return [
        options.html.files,
        options.sass.files,
      ]
    },
    run: function() {
      return [
        [ 'html' ],
        [ 'compile:sass' ],
      ]
    }
  },

  // watch styleguide changes
  sg_watch: {
    files: function() {
      return [
        options.sg_html.files,
        options.sg_sass.files
      ]
    },
    run: function() {
      return [
        [ 'sg_html' ],
        [ 'compile:sg_sass']
      ]
    }
  }  
}


/**
 * Task list
 */

// default
gulp.task( 'default', options.default.tasks );

// styleguide task
gulp.task( 'styleguide', options.styleguide.tasks );

// connect
gulp.task( 'connect', function() {
  plugins.connect.server( {
    root: [ options.connect.root ],
    port: options.connect.port,
    base: options.connect.base,
    livereload: true
  });
});

// sg_connect
gulp.task( 'sg_connect', function() {
  plugins.connect.server( {
    root: [ options.sg_connect.root ],
    port: options.sg_connect.port,
    base: options.sg_connect.base,
    livereload: true
  });
});

// html
gulp.task( 'html', function() {
  gulp.src( options.html.files )
  .pipe( plugins.connect.reload() );
});

// styleguide html
gulp.task( 'sg_html', function() {
  gulp.src( options.sg_html.files )
  .pipe( plugins.connect.reload() );
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

// sg_sass: compile sass from styleguide
gulp.task( 'compile:sg_sass', function() {
  gulp.src( options.sg_sass.files )
    .pipe( plugins.plumber() )
    .pipe( plugins.sass( { outputStyle : 'compressed' }).on('error', plugins.sass.logError))
    .pipe( gulp.dest( options.sg_sass.destination ))
    .pipe( plugins.connect.reload() );
});

// watch
gulp.task( 'watch', function() {
  var watchFiles = options.watch.files();

  watchFiles.forEach( function( files, index ) {
    gulp.watch( files, options.watch.run()[ index ] );
  });
});

// watch
gulp.task( 'sg_watch', function() {
  var watchFiles = options.sg_watch.files();

  watchFiles.forEach( function( files, index ) {
    gulp.watch( files, options.sg_watch.run()[ index ] );
  });
});