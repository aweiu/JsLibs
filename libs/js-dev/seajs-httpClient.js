define(function (require, exports, module) {
    var testUrl = "",
        waiting = require("seajs-waiting"),
        config=require("/seajs-httpClientConfig");
    var onchange = function (xmlhttp,onSuccess,onError,redo) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if(exports.showWaitting) {
                    waiting.hide();
                }
                if (this.status == 200) {
                    try {
                        var isEvalError=true,
                            rs = eval("(" + this.responseText + ")");
                        isEvalError=false;
                        if(config.onSuccess){
                            config.onSuccess(onSuccess,rs,this.responseText,redo);
                        }else if(onSuccess){
                            onSuccess(rs,this.responseText);
                        }
                    } catch (e) {
                        if(isEvalError){
                            if(config.onSuccess){
                                config.onSuccess(onSuccess,this.responseText,this.responseText,redo);
                            }else if(onSuccess){
                                onSuccess(this.responseText,this.responseText);
                            }
                        }else{
                            throw e;
                        }
                    }
                } else{
                    if(onError){
                        onError(this.status);
                    }else if(config.onError){
                        config.onError(this.status);
                    }else{
                        seajs.use("seajs-common-tip",function(tip){
                            tip.show("抱歉!服务器异常",false);
                        })
                    }
                }
            }
        }
    };
    exports.showWaitting=true;
    var creathttp = function () {
        if(exports.showWaitting)waiting.show();
        return (window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP"));
    };
    exports.get = function (url,onSuccess,onError) {
        if (url.substring(0, 1) == "/") {
            url = testUrl + url;
        }
        var xmlhttp = creathttp();
        onchange(xmlhttp,onSuccess,onError,function(){exports.get(url,onSuccess,onError)});
        xmlhttp.open("get", url, true);
        xmlhttp.setRequestHeader("Content-type", "text/html;charset=utf-8");
        xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
        xmlhttp.setRequestHeader("If-Modified-Since","0");
        xmlhttp.send();
    };
    exports.post = function (url, data, onSuccess,onError) {
        if (url.substring(0, 1) == "/") {
            url = testUrl + url;
        }
        var xmlhttp = creathttp();
        onchange(xmlhttp,onSuccess,onError,function(){exports.post(url, data, onSuccess,onError)});
        xmlhttp.open("post", url, true);
        xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("If-Modified-Since","0");
        xmlhttp.send(data);
    };
    exports.syncGet = function (url) {
        if (url.substring(0, 1) == "/") {
            url = testUrl + url;
        }
        var xmlhttp = creathttp();
        xmlhttp.open("get", url, false);
        xmlhttp.setRequestHeader("Content-type", "text/html;charset=utf-8");
        xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
        xmlhttp.setRequestHeader("If-Modified-Since","0");
        xmlhttp.send();
        exports.rs = xmlhttp.responseText;
        if(exports.showWaitting) {
            waiting.hide();
        }
    };
    exports.syncPost = function (url, data) {
        if (url.substring(0, 1) == "/") {
            url = testUrl + url;
        }
        var xmlhttp = creathttp();
        xmlhttp.open("post", url, false);
        xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("If-Modified-Since","0");
        xmlhttp.send(data);
        exports.rs = xmlhttp.responseText;
        if(exports.showWaitting) {
            waiting.hide();
        }
    }
    exports.formatData=function(data){
        var rs="";
        for(var m in data){
            if(data.hasOwnProperty(m))rs+=(m+"="+data[m]+"&");
        }
        return rs.substring(0,rs.length-1);
    }
    exports.newInstance=function(){
        return exports;
    }
});