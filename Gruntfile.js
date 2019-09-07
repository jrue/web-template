module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    'dart-sass': {
      target: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          './dist/css/style.css': './src/scss/bootstrap_variables.scss'
        }
      }
    },


    googlefonts: {
      build: {
        options: {
          fontPath: 'src/fonts/',
          httpPath: '../fonts/',
          cssFile: 'src/fonts/fonts.css',
          fonts: [
            {
              family: 'Raleway',
              styles: [
                400, 700, 900
              ]
            },
            {
              family: 'Open Sans',
              styles: [
                400
              ]            
            }
          ]
        }
      }
    },


    clean:{
      dist: ['dist/**/*']
    },


    copy: {
      js: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.js'], 
        dest: 'dist/' 
      },
      fonts:{
        expand: true,
        cwd: 'src/',
        src: ['fonts/**/*'], 
        dest: 'dist/'
      },
      assets: {
        expand: true,
        cwd: 'src/',
        src: ['assets/**/*'],
        dest: 'dist/'      
      }
    },


    watch: {
      options: {
        spawn: false,
        event: ['all'],
        livereload: true,
        cwd: 'src/'
      },
      scripts: {
        files: '**/*.js',
        tasks: ['copy:js']
      },
      styles: {
        files: ['css/**/*', 'src/scss/**/*'],
        tasks: ['dart-sass']
      },
      html: {
        files: '**/*.html',
        tasks: ['process']
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['copy:assets']
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          livereload: true,
          //keepalive: true,
          base: "./dist"
        }
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-dart-sass');
  grunt.loadNpmTasks('grunt-google-fonts');

  grunt.registerTask('process', 'Run HTML file through template process and copy to dist folder', () => {

    //read project.json
    let data = {data: grunt.file.readJSON('project.json') };

    //run include functions in template tags, and fetch respective partials
    data.include = function(file){
      let f = grunt.file.read('src/' + file);
      return f;
    }

    //read primary index file and process template tags
    let file = grunt.file.read('src/index.html');
    let processed = grunt.template.process(file, {data:data});

    //write to dist folder
    let finished = grunt.file.write('dist/index.html', processed, {encoding:'utf8'});

  })

  grunt.registerTask('setup', ['clean', 'googlefonts', 'copy:fonts', 'copy:assets', 'copy:js', 'dart-sass','process','connect', 'watch']);

  grunt.registerTask('default', ['copy:assets','copy:js','dart-sass','process','connect','watch']);

};