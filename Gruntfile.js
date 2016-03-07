module.exports=function(grunt){
    //单独压缩的js文件名
    var js="seajs-autoPage";
	grunt.initConfig({
		pkg:grunt.file.readJSON("package.json"),
		uglify:{
			options: {
                mangle: {
                  except: ['require']
                }
            },
            //单个js压缩
            one: {
                src: "./js-dev/"+js+".js",
                dest: "./js/"+js+".js"
            },
            //js-tmp目录下所有的
            all:{
                files: [{
                    expand:true,
                    cwd:'js-dev',//js-tmp目录下
                    src:'**/*.js',//所有js文件
                    dest: './js'//输出到此目录下
                }]
            }
		},
		jshint:{
			build:""
		},
		less :{
            main:  {
                expand: true,
                cwd: './less/',
                src: ['**/*.less'],
                dest: './css/',
                ext: '.css'
            }
        },
        connect: {
          options: {
            port: 9000,
            hostname: '*', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
            livereload: 35729  //声明给 watch 监听的端口
          },
          server: {
            options: {
              open: true, //自动打开网页 http://
              base: [
                ''  //主目录
              ]
            }
          }
        },
        watch: {
            livereload: {
                options: {
                  livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },
                files: [  //下面文件的改变就会实时刷新网页
                  'html/*.html',
                  'css/*.css',
                  'js/*.js'
                ]
            },
            less:{
                files:'less/*.less',
                task:'less:main'
            }
        }
    });
	// grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
//	grunt.registerTask('default', ['connect','watch']);
    grunt.registerTask('less', 'less');
    grunt.registerTask('default', 'uglify:all');
}