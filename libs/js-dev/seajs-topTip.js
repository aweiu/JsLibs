define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var top_tip,
        doAfterUse=function(fuc){
            seajs.use("seajs-css",function(){
                seajs.use(assetsUrl+"css/seajs-topTip.css",fuc);
            })
        };
    doAfterUse();
    exports.show=function(tip){
        doAfterUse(function(){
            if (top_tip) {
                top_tip.innerHTML = tip;
                document.body.removeChild(top_tip);
                document.body.appendChild(top_tip);
            } else {
                top_tip = document.createElement("topTip");
                top_tip.className = "top-tip";
                top_tip.innerHTML = tip;
                document.body.appendChild(top_tip);
            }
        })
    }
});