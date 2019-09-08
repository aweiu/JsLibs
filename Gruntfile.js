module.exports=function(grunt){
    //单独压缩的js文件名
    var js="fixJsForIE8";
	grunt.initConfig({
		pkg:grunt.file.readJSON("package.json"),
		uglify:{
			options: {
                mangle: {
                  except: ['require','utils','seajs']
                },
                banner: '/*! 作者:阿伟 */\n'+
                        '/*! git:https://github.com/aweiu/JsLibs.git */\n'+
                        '/*! 推荐sealoader模块加载器:https://aweiu.com/documents/sealoader/ */\n'+
                        '/*! 最后修改于 <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
            //单个js压缩
            one: {
                src: "./libs/js-dev/"+js+".js",
                dest: "./libs/js/"+js+".js"
            },
            //js-tmp目录下所有的
            all:{
                files: [{
                    expand:true,
                    cwd:'./libs/js-dev',//js-dev目录下
                    src:'**/*.js',//所有js文件
                    dest: './libs/js'//输出到此目录下
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
            }
        }
    });
	// grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.registerTask('default', ['connect','watch']);
    grunt.registerTask('less', 'less');
    grunt.registerTask('default', 'uglify:one');
    // grunt.registerTask('default', 'uglify:all');
}
