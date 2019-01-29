var gulp          = require('gulp'),
  sass          = require('gulp-sass'),
  cleanCSS      = require('gulp-clean-css'),
  autoprefixer  = require('gulp-autoprefixer'),
  rename        = require('gulp-rename'),
  inject        = require('gulp-inject'),
  uglify        = require('gulp-uglify'),
  concat        = require('gulp-concat'),
  plumber       = require('gulp-plumber'),
  babel         = require('gulp-babel'),
  browserify    = require('gulp-browserify'),
  clean         = require('gulp-clean'),
  sourcemaps    = require('gulp-sourcemaps'),
  htmlmin       = require('gulp-html-minifier'),
  browserSync   = require('browser-sync');

var src           = './src/',
    dist          = './dist/';

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function(){
  return gulp.src([src + 'scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({ basename: 'style'}))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + 'assets/css'))
    .pipe(browserSync.stream());
})

// Taskname 'JS'
gulp.task('js',function(){
  gulp.src(src + 'js/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('global.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/assets/js/'))
    .pipe(browserSync.stream());
});

// Move the bootstrap javascript files into our /dist/js folder
gulp.task('btsjs', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'
    ,'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest(dist + 'assets/js'))
    .pipe(browserSync.stream());
})

// Move the html files into our /dist/js folder
gulp.task('html', function(){
  return  gulp.src(src + '*.html')
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
})


//Static Server + watching scss/html files
gulp.task('serve', ['sass'], function(){
  browserSync.init({
    server: "./dist"
  })
  //gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss'],['src/scss/*.scss']);
  //gulp.watch('src/scss/*.scss', ['sass']);
  //gulp.watch('src/*.html' , ['html']).on('change',browserSync.reload);


  gulp.watch([src + 'scss/**/*.scss'],['sass']);
  gulp.watch([src + 'js/*.js'],['js']);
  gulp.watch([src + '*.html'],['html']).on('change',browserSync.reload);
})

gulp.task('default', ['js', 'btsjs','serve', 'html']);