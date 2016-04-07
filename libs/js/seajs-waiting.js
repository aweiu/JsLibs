/*! 作者:阿伟 */
/*! git:https://github.com/328080339/JsLibs.git */
/*! 推荐sealoader模块加载器:https://www.npmjs.com/package/sealoader */
/*! 最后修改于 2016-04-06 15:39:04 */
define(function(require,a,b){var c=b.uri;c=c.substring(0,c.lastIndexOf("/js/"))+"/";var d,e=require("seajs-modal-common").newInstance(),f=document.createElement("div"),g=document.createElement("img"),h=0;f.style.cssText="color:#999;overflow:hidden",g.src=c+"imgs/seajs-waiting-loading.gif",g.style.cssText="display: block;margin: 0 auto 10px auto",f.appendChild(g);var i=document.createElement("div");f.appendChild(i),e["int"]({content:f,padding:"10px 20px"}),a.show=function(a){h++,i.innerHTML=a||"获取数据中...",d||(d=setTimeout(e.show,400))},a.hide=function(){--h<=0&&(clearTimeout(d),e.hide(),d=null)},a.newInstance=function(){return a}});