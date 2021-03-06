'use strict';

module.exports = function (grunt) {
  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);


  /**
  * Set up configuration
  */
  grunt.initConfig({

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.jekyll',
            '.'
          ]
        }
      }
    },

    concat: {
      bowerJs: {
        dest: 'js/lib.js',
          src: [
            'lib/modernizr/modernizr.js',
            'lib/jquery/jquery.js',
            'lib/raphael/raphael.js'
          ]
      },
      bowerCss: {
        dest: 'css/lib.css',
          src: [
            'lib/animate.css/animate.css'
          ]
      },
    },

    "bower-install-simple": {
      options: {
        color: true,
          directory: "lib"
        },
        prod: {
          options: {
            production: true
          }
        },
        dev: {
          options: {
            production: false
          }
        }
    },

    sync: {
      less: {
        files: [
          { src: [
              'css/app.css',
            ],
            dest: ".jekyll"
          }
        ],
        verbose: true,
      },
      coffee: {
        files: [
          { src: [
              'js/app.js',
            ],
            dest: ".jekyll"
          }
        ],
        verbose: true,
      }
    },

    clean: {
      all: [
        //clean all generated files
        "css/app.css",
        "css/lib.css",
        "js/lib.js",
        "js/app.js",
        "lib"
      ],
    },

    watch: {
      less: {
        files: [
          'css/**/*.less'
        ],
        tasks: [
          'less:compile',
          'sync:less'
        ]
      },
      coffee: {
        files: [
          'coffee/**/*.coffee'
        ],
        tasks: [
          'coffee:compile',
          'sync:coffee'
        ]
      },
      jekyll: {
        files: [
          '**/*.{html,csv,yml,md,mkd,markdown,js,css,png,jpg,jpeg,ico}',
          'js/assets.coffee',
          '!**/app.js',
          '!**/app.css'
        ],
        tasks: ['jekyll:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.jekyll/**/*.html',
          '.jekyll/css/*.css',
          '.jekyll/js/*.js'
        ]
      }
    },

    less: {
      compile: {
        files: [{
          'css/app.css': 'css/app.less',
        }]
      }
    },

    coffee: {
      compile: {
        files: {
          'js/app.js': 'coffee/**/*.coffee' // concat then compile into single file
        }
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        src: '.'
      },
      server: {
        options: {
          config: '_config.yml',
          dest: '.jekyll'
        }
      }
    },

    concurrent: {
      server: [
        'less:compile',
        'coffee:compile',
        'jekyll:server',
      ],
    }

  });

  /**
  * Define tasks
  */
  grunt.registerTask('serve', function () {
    grunt.task.run([
      'bower-install-simple:prod',
      'concat:bowerJs',
      'concat:bowerCss',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', function () {
    grunt.task.run([
      'bower-install-simple:prod',
      'concat:bowerJs',
      'concat:bowerCss',
      'less:compile',
      'coffee:compile'
    ]);
  });

}