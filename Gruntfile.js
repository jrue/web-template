const path = require('path');
const _ = require('lodash');
const ghpages = require('gh-pages');


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


    //we process the sass files from bootstrap, giving us the ability to modify 
    //the templates (for example, using a different grid layout, or adjusting gutters, or default fonts)
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


    //Download local copies of Google fonts, this way we don't rely on Google's servers
    //and have better privacy. Google's license allows for local copies. 
    // https://developers.google.com/fonts/faq
    googlefonts: {
      build: {
        options: {
          fontPath: 'src/fonts/',
          httpPath: '../fonts/',
          cssFile: 'src/fonts/fonts.css',
          fonts: [

            //add additional fonts here if you wish
            {
              family: 'Lato',
              styles: [
                100, 400, 700, 900
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

    //remove the dist (build) folder and start over.
    clean:{
      dist: ['dist/**/*']
    },

    //copy the fonts, js and assets folder (no css, because we process sass first)
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


    //watch for changes, and do a different action depending on situation
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
        files: ['css/**/*.css', 'scss/**/*.scss'],
        tasks: ['dart-sass']
      },
      html: {
        files: ['**/*.html','../data/**/*.yml'],
        tasks: ['process']
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['copy:assets']
      }
    },

    //make a webserver on the dist folder
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          livereload: true,
          base: "./dist"
        }
      }
    }


  });

  grunt.registerTask('publish', 'Publish project to gh-pages', ()=>{

    ghpages.publish('dist',  {push: false}, function(err){
      grunt.log.writeln(err);
    });

  });


  //process template tags that look like this <%= data.seo.title %>
  grunt.registerTask('process', 'Run HTML file through template process and copy to dist folder', () => {

    //will hold all data
    var data = {};

    //add custom delimiters for loop template tags.
    grunt.template.addDelimiters('loop', '{%', '%}');

    //read all of the files in the data folder
    var files_in_data_folder = grunt.file.expand({filter: 'isFile', cwd:'data/'}, ["*"]);

    //iterate through each file, storing it in data variable, using filename as property
    files_in_data_folder.forEach((file, index) => {

      //get the name of file without the extension, use that as propery for template tags.
      let basename = path.parse(files_in_data_folder[index], '.yml').name;

      data[basename] = grunt.file.readYAML('data/' + file, {encoding:'utf8'});

    });


    //This will run include() functions found in template tags, and fetch respective partials
    data.include = function(file){
      let f = grunt.file.read('src/' + file);
      return f;
    }


    data.loop = function(loop_data, loop_tags){

      if(arguments.length > 1){

        let loop_return = [];

        loop_data.forEach(function(d){

          //https://lodash.com/docs/4.17.15#template
          let template_tags = _.template(loop_tags);
          loop_return.push(template_tags(d));

        });

        return loop_return.slice(',').join('\n');
      }
    }

    //read all found htmls files and process template tags
    let html_files_in_src = grunt.file.expand({filter: 'isFile', cwd:'src/'}, ['**/*.html', '!partials/*']);

    html_files_in_src.forEach((file,index)=>{

      let f = grunt.file.read('src/' + file);
      let processed = grunt.template.process(f, {data:data});
      let finished = grunt.file.write('dist/' + file, processed, {encoding:'utf8'});

    });

  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-dart-sass');
  grunt.loadNpmTasks('grunt-google-fonts');

  //intial setup, really only need to run this once unless adding new Google Fonts
  grunt.registerTask('setup', ['clean', 'googlefonts', 'copy:fonts', 'default']);

  //create build folder and run watch task
  grunt.registerTask('default', ['copy:assets','copy:js','dart-sass','process','connect','watch']);

};