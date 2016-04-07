/*! 作者:阿伟 */
/*! git:https://github.com/328080339/JsLibs.git */
/*! 推荐sealoader模块加载器:https://www.npmjs.com/package/sealoader */
/*! 最后修改于 2016-04-06 15:39:04 */
define(function(require,a,b){var c=b.uri;c=c.substring(0,c.lastIndexOf("/js/"))+"/";var d,e=function(a){seajs.use("seajs-css",function(){seajs.use(c+"css/seajs-topTip.css",a)})};e(),a.show=function(a){e(function(){d?(d.innerHTML=a,document.body.removeChild(d),document.body.appendChild(d)):(d=document.createElement("topTip"),d.className="top-tip",d.innerHTML=a,document.body.appendChild(d))})}});