// Karma configuration
// Generated on Wed Aug 17 2016 00:01:09 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function(config) {
    var configuration = {

      // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',

      // plugins starting with karma- are autoloaded
      plugins: ['karma-chrome-launcher', 'karma-jasmine'],

      // frameworks to use
      // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      frameworks: ['jasmine'],

      // list of files / patterns to load in the browser
      files: [
        '../docs/js/jquery-2.1.3.min.js', // dirty hack for including jQuery
        'http://knockoutjs.com/downloads/knockout-3.4.0.debug.js',
        '../dist/js/bootstrap-multiselect.js',
        'spec/*.js'
      ],

      // list of files to exclude
      exclude: [
      ],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
      },

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress'],

      // web server port
      port: 9876,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,

      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Opera', 'IE'],

      // e.g see https://swizec.com/blog/how-to-run-javascript-tests-in-chrome-on-travis/swizec/6647
      customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },

      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
}
