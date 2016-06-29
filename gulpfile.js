var gulp = require('gulp-help')(require('gulp'));
var ts = require('gulp-typescript'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    runSequence = require('run-sequence'),
    merge = require('merge2'),
    karma = require('karma'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    argv = require('yargs').argv
    ;

var package = require('./package.json');
var banner = "/*! <%= package.name %> v<%= package.version %> | (c) 2016 Microsoft Corporation <%= package.license %> */\n";

gulp.task('build', 'Build all code for distribution', function (done) {
    runSequence(
        'clean:dist',
        ['compile:src', 'compile:dts'],
        'min:js',
        'header',
        done
    )
});

gulp.task('header', 'Add header to distributed files', function () {
    return gulp.src(['!./dist/**/*.map', './dist/**/*'])
        .pipe(header(banner, { package : package }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', 'Builds all code and runs tests', function (done) {
    runSequence(
        'clean:tmp',
        ['compile:src', 'compile:spec'],
        ['test:js'],
        done
    )
});

gulp.task('clean:dist', 'Cleans destination folder', function() {
    return del(['./dist']);
});

gulp.task('clean:tmp', 'Cleans tmp folder', function() {
    return del(['./tmp']);
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

gulp.task('compile:dts', 'Generate dts files from modules', function () {
    var tsProject = ts.createProject('tsconfig.json', {
        declaration: true,
        sourceMap: false
    });

    var tsResult = gulp.src(['./typings/globals/**/*.d.ts', '!./src/**/*.spec.ts', './src/**/*.ts'])
        .pipe(ts(tsProject));
    
    return tsResult.dts
        .pipe(gulp.dest('./dist'));
});

gulp.task('compile:spec', 'Compile typescript for tests', function () {
    var unitTestProject = ts.createProject('tsconfig.json');
    var unitTestResult = gulp.src(['./typings/globals/**/*.d.ts', './src/**/*.spec.ts'])
        .pipe(ts(unitTestProject));
    var unitTestStream = unitTestResult.js.pipe(gulp.dest('./tmp'));
    
    var e2eTestProject = ts.createProject('tsconfig.json');
    var e2eTestResult = gulp.src(['./typings/globals/**/*.d.ts', './test/**/*.spec.ts'])
        .pipe(ts(e2eTestProject));
    var e2eTestStream = e2eTestResult.js.pipe(gulp.dest('./tmp'));
    
    return merge(
        [unitTestStream, e2eTestStream]
    );
});

gulp.task('test:js', 'Runs unit tests', function(done) {
    new karma.Server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: argv.watch ? false : true
    }, done);
});