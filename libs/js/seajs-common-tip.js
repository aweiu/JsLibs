/*! 作者:阿伟 */
/*! git:https://github.com/aweiu/JsLibs.git */
/*! 推荐sealoader模块加载器:https://aweiu.com/documents/sealoader/ */
/*! 最后修改于 2016-04-18 11:35:42 */
define(function(require,a,b){var c=b.uri;c=c.substring(0,c.lastIndexOf("/js/"))+"/";var d=require("seajs-modal-common").newInstance(),e=document.createElement("div");e.style.cssText="text-align: center;overflow:hidden;min-width:80px;";var f=document.createElement("img");f.width=50,f.height=57,f.src=c+"imgs/seajs-common-tip-success.png";var g=document.createElement("div");g.style.cssText="margin-top:20px;color:#333333;font-size:18px;",e.appendChild(f),e.appendChild(g),d["int"]({hasBac:!1,content:e,padding:"50px 60px",hideOnClickOut:!0,hasShadow:!0,autoHide:!0,canClickOut:!0}),a.show=function(a,b){g.innerHTML=a,f.src=c+"imgs/seajs-common-tip-success.png",b===!1&&(f.src=c+"imgs/seajs-common-tip-fail.png"),d.show()},a.newInstance=function(){return a}});
