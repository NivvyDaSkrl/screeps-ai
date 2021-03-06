module.exports = function(grunt) {
    let config = require('./.screeps.json');

    let branch = grunt.option('branch') || config.branch;
    let email = grunt.option('email') || config.email;
    let password = grunt.option('password') || config.password;
    let ptr = grunt.option('ptr') ? true : config.ptr;

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-append');

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        // Remove all files from the dist folder.
        clean: {
            'dist': ['dist']
        },

        // Copy all source files into the dist folder, flattening the folder structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before being sent to the Screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g, '.');
                    }
                }]
            }
        },

        // Add version variable using current timestamp.
        file_append: {
            version: {
                files: [
                    {
                        append: "\nglobal.SCRIPT_VERSION = " + new Date().getTime() + "\n",
                        input: 'dist/version.js'
                    }
                ]
            }
        }
    })

    grunt.registerTask('default',  ['clean', 'copy:screeps', 'file_append:version', 'screeps']);
}