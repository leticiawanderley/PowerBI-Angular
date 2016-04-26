var argv = require('yargs').argv;

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            './node_modules/jquery/dist/jquery.js',
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './node_modules/powerbi-client/dist/powerbi.js',
            './dist/angular-powerbi.js',
            './src/**/*.spec.js',
            './test/**/*.spec.js'
        ],
        exclude: [],
        reporters: argv.debug ? ['spec'] : ['spec', 'coverage'],
        autoWatch: true,
        browsers: [argv.debug ? 'Chrome' : 'PhantomJS'],
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],
        preprocessors: {
            './dist/angular-powerbi.js': ['coverage'],
            './src/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            prependPrefix: "/",
            moduleName: "templates"
        },
        coverageReporter: {
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        logLevel: argv.debug ? config.LOG_DEBUG : config.LOG_INFO
    });
};
