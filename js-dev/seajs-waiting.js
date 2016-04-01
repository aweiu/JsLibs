define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/libs/";
    var modal=require("seajs-modal-common").newInstance();
    var timer,
        div=document.createElement("div"),
        img = document.createElement("img"),
        showCount=0;
    div.style.cssText="color:#999;overflow:hidden";
    img.src=assetsUrl+"imgs/seajs-waiting-loading.gif";
    img.style.cssText="display: block;margin: 0 auto 10px auto";
    div.appendChild(img);
    var tipDiv=document.createElement("div");
    div.appendChild(tipDiv);
    modal.int(
        {
            content:div,
            padding: "10px 20px"
        }
    );
    exports.show = function (txt) {
        showCount++;
        tipDiv.innerHTML=txt||"获取数据中...";
        if(!timer)timer=setTimeout(modal.show,400);
    };
    exports.hide = function () {
        if(--showCount<=0){
            clearTimeout(timer);
            modal.hide();
            timer=null;
        }
    };
    exports.newInstance = function () {
        return exports;
    };
});