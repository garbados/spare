module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'bin/*',
        'lib/*',
        'test/*',
        'Gruntfile.js',
        'app.js'
      ],
      options: {}
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'mocha-lcov-reporter',
          captureFile: 'coverage.lcov'
        },
        src: ['tests/**/*.js']
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'mochaTest'
  ]);

};