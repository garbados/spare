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
        options: {},
        src: ['test/**/*.js']
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