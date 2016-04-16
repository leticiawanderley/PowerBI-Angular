var gulp = require('gulp-help')(require('gulp'));
var ts = require('gulp-typescript'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf'),
    runSequence = require('run-sequence'),
    merge = require('merge2'),
    karma = require('karma'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    argv = require('yargs').argv
    ;

gulp.task('build', function (done) {
    runSequence(
        'clean',
        ['compile:src', 'compile:spec'],
        done
    )
});

gulp.task('test', function (done) {
    runSequence(
        'clean',
        ['compile:src', 'compile:spec'],
        ['test:js', 'copy', 'min:js'],
        done
    )
});

gulp.task('clean', 'Cleans destination folder', function(done) {
    rimraf('./dist', done);
});

gulp.task('copy', 'Copy .d.ts file from src to dist as workaround', function () {
    return gulp.src(['./src/angular-powerbi.d.ts'])
        .pipe(gulp.dest('./dist'))
});

gulp.task('min:js', 'Creates minified JavaScript file', function() {
    return gulp.src('./dist/angular-powerbi.js')
        .pipe(sourcemaps.init({ debug: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('compile:src', 'Compile typescript for library', function() {
    return gulp.src(['./src/angular-powerbi.ts'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task('compile:spec', 'Compile typescript for tests', function () {
    var tsProject = ts.createProject('tsconfig.json');
    
    var tsResult = gulp.src(['./src/**/*.spec.ts'])
        .pipe(ts(tsProject))
        ;
        
    return tsResult.js.pipe(gulp.dest('./src'));
})

gulp.task('test:js', 'Runs unit tests', function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: argv.debug ? false : true
    }, done).start();
});