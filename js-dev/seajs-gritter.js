define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var $=require("seajs-jquery"),jQuery=$,
        utils=require("seajs-utils");
    exports.show=function(text,type){
        utils.use([
            [
                "jquery.gritter.min",
                "seajs-css",
                assetsUrl+"css/jquery.gritter.css"
            ]
        ],function(){
           if(type!==false)type=true;
           $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: "提示",
                // (string | mandatory) the text inside the notification
                text: text,
                class_name: 'gritter-' + (type?"success":"error")
            }); 
        });
    }
});