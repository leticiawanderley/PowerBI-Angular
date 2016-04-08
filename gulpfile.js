var gulp = require('gulp-help')(require('gulp'));
var ts = require('gulp-typescript'),
    rename = require('gulp-rename'),
    merge = require('merge2'),
    karma = require('karma'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    argv = require('yargs').argv
    ;
    
gulp.task('compile', 'Compile typescript', ['copy'], function() {
    return gulp.src(['./src/angular-powerbi.ts'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy', 'Copy .d.ts file from src to dist as workaround', function () {
    return gulp.src(['./src/angular-powerbi.d.ts'])
        .pipe(gulp.dest('./dist'))
});

gulp.task('test', 'Runs unit tests', ['compile'], function(done) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: argv.debug ? false : true
    }, done).start();
});