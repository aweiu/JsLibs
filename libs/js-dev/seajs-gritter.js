define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var $=require("seajs-jquery"),jQuery=$,
        utils=require("seajs-utils");
    var doAfterUse=function(fuc){
    	utils.use([
            [
                "jquery-gritter-min",
                assetsUrl+"css/jquery.gritter.css"
            ]
        ],fuc);
    }
    doAfterUse();
    exports.show=function(text,type){
    	doAfterUse(function(){
           if(type!==false)type=true;
           $.gritter.add({
                title: "提示",
                text: text,
                class_name: 'gritter-' + (type?"success":"error")
            }); 
        });
    }
    exports.newInstance=function(){
        return exports;
    }
});