var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify-es').default;

const paths = {
    pages: [
        'test/server/*.html',
        'test/server/testweb.ts'
    ],
    starfish: 'src/**/*.ts'
};

gulp.task('copy-library', function () {
    return gulp.src(paths.starfish)
        .pipe(gulp.dest('dist/starfish'));
});

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', gulp.series(gulp.parallel(['copy-html', 'copy-library']), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['dist/testweb.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .on('error', gutil.log)
    .pipe(source('testwebBundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/node'))
}));

// Rerun the dev task when a file changes
gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', gulp.parallel('dev'));
});

gulp.task('build', gulp.parallel('dev'));

// an alias.
gulp.task('default', gulp.parallel('build'));
