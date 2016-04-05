/*! 作者:阿伟 */
/*! git:https://github.com/328080339/JsLibs.git */
/*! 推荐sealoader模块加载器:https://www.npmjs.com/package/sealoader */
/*! 最后修改于 2016-04-05 13:39:40 */
define(function(require,a,b){var c=b.uri;c=c.substring(0,c.lastIndexOf("/js/"))+"/";var d=require("seajs-jquery"),e=require("seajs-utils"),f=function(a){e.use([["jquery-gritter-min",c+"css/jquery.gritter.css"]],a)};f(),a.show=function(a,b){f(function(){b!==!1&&(b=!0),d.gritter.add({title:"提示",text:a,class_name:"gritter-"+(b?"success":"error")})})},a.newInstance=function(){return a}});