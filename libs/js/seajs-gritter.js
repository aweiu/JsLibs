/*! 作者:阿伟 */
/*! git:https://github.com/328080339/JsLibs.git */
/*! 推荐sealoader模块加载器:https://www.npmjs.com/package/sealoader */
/*! 最后修改于 2016-04-06 15:39:04 */
define(function(require,a,b){var c=b.uri;c=c.substring(0,c.lastIndexOf("/js/"))+"/";var d=require("seajs-jquery"),utils=require("seajs-utils"),e=function(a){utils.use([["jquery-gritter-min",c+"css/jquery.gritter.css"]],a)};e(),a.show=function(a,b){e(function(){b!==!1&&(b=!0),d.gritter.add({title:"提示",text:a,class_name:"gritter-"+(b?"success":"error")})})},a.newInstance=function(){return a}});