let gulp      = require('gulp'),
    sass        = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync');

gulp.task('scss', function(){
    return gulp.src('app/scss/main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
    return gulp.src(['app/js/index.js'])
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});


gulp.task('watch', function() {
    gulp.watch('app/scss/*.scss', gulp.parallel('scss'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/index.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});
gulp.task('default', gulp.parallel('scss', 'scripts', 'browser-sync', 'watch'));
