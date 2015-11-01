var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var src = {
    scss: 'src/sass/**/*.scss',
    css:  'src/css',
    html: 'src/*.html'
};


// start server and watch files
gulp.task('serve', ['sass'], function() {

    browserSync({
        server: "./src"
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.html).on('change', reload);
});

// compile sass
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe( plugins.plumber() )
        .pipe( plugins.sass( { outputStyle : 'compressed' }).on('error', plugins.sass.logError))
        .pipe( plugins.autoprefixer( {
            browsers: ['last 2 versions'],
            cascade: false
        }))        
        .pipe(gulp.dest(src.css))    
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);