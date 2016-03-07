/**
 * Created by awei on 2015/12/31.
 */
define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var utils=require("seajs-utils"),
        hasInt=false,
        wrap,passwordTxt="",passwords,
        beforeInt=function(fuc){
            utils.use([
                assetsUrl+"css/seajs-passwordWidget.css",
                assetsUrl+"html/seajs-passwordWidget.html"
            ],function(){
                if(!hasInt)int();
                if(fuc)fuc();
            });
        };
    var clearLast=function(){
        passwordTxt="";
        for(var i= 0,l=passwords.length;i<l;i++){
            passwords[i].innerHTML="";
        }
    };
    exports.show=function(onFinish){
        beforeInt(function(){
            wrap.style.display="block";
            clearLast();
            if(onFinish)exports.onFinish=onFinish;
        });
    };
    exports.hide=function(){
        beforeInt(function(){
            wrap.style.display="none";
        });
    };
    exports.setTitle=function(ss,index){
        if(index!=0&&index!=1)return;
        beforeInt(function(){
            utils.$id("password_widget_title"+index).innerHTML=ss;
        });
    };
    exports.setRegetPasswordUrl=function(url){
        beforeInt(function(){
            utils.$id("password_widget_forget").href=url;
        });
    };
    function int(){
        wrap=utils.$id("password_widget_wrap"),
            passwords=utils.$id("password_widget_passwords").getElementsByTagName("div"),
            utils.$id("password_widget_keyboard").addEventListener("touchend",function(e){
                e.preventDefault();
                var target= e.srcElement|| e.target;
                if(target.tagName=="IMG")target=target.parentNode;
                if(target.tagName=="BUTTON"&&target.innerHTML!=""){
                    if(target.className!="password-widget-greyKey"){
                        if(passwordTxt.length<6){
                            passwords[passwordTxt.length].innerHTML="●";
                            passwordTxt+=target.innerHTML;
                        }
                    }else if(passwordTxt.length>0){
                        passwords[passwordTxt.length-1].innerHTML = "";
                        passwordTxt=passwordTxt.substring(0,passwordTxt.length - 1);
                    }
                    if(passwordTxt.length==6){
                        exports.hide();
                        if(exports.onFinish)exports.onFinish(passwordTxt);
                    }
                }
            });
        utils.$id("password_widget_close").addEventListener("click",function(){
            exports.hide();
        })
        hasInt=true;
    }
    exports.newInstance = function () {
       return exports;
    };
});