module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['modules/tests/*.js']
            }
        },

        less: {
            development: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "public/css/main.css" : "public/less/main.less"
                }
            }
        },

        watch: {
            less: {
                files: "public/less/*.less",
                tasks: ["less"],
                options: {
                    interrupt: true
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ["public/css/main.css"]
            }
        }

    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['mochaTest']);
};
