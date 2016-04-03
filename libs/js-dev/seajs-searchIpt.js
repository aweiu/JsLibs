/**
 * Created by awei on 15/9/11.
 */
define(function (require, exports, module) {
    var httpClient=require("seajs-httpClient");
    httpClient.showWaitting=false;
    var config;var ipt;var searchRecord={};var requestCount=0;
    var timer;var searchRecord_max=20;
    var searchRecordNum=0;var searchRecord_cacheKey;
    exports.int = function (configure) {
        config=configure;
        ipt=config.iptNode||document.getElementById(config.iptId);
        ipt.addEventListener("input",function(){
            if(timer)clearTimeout(timer);
            var iptValue=this.value.replace(/\s/g,"");
            if(iptValue=="")return;
            if(config.filter&&!config.filter(iptValue)){return}
            timer=setTimeout(function(){
                search(iptValue);
            },300);
        })
    }
    exports.setConfig = function (key, value) {
        config[key]=value;
    }
    var draw=function(rs) {
        if(rs){
            config.draw(rs);
        }
    }
    var search=function(key){
        var code=++requestCount;
        var url = config.url;
        var parameters=config.parameters;
        if(parameters){
            if(typeof(parameters)=="function"){
                parameters=config.parameters();
            }
        }else{
            parameters=config.searchKey+"="+key;
        }
        url += ((config.url.indexOf("?") != -1 ? "&" : "?") + parameters);
        var httpCallBac=function(rs){
            if(rs!=null){
                searchRecord[url]=rs;
                if(code==requestCount){
                    if(config.dataKey){
                        draw(eval("rs." + config.dataKey));
                    }else{
                        draw(rs);
                    }
                }
            }
        }
        var searchRecordRs=searchRecord[url];
        if(searchRecordRs!=null){
            httpCallBac(searchRecordRs);
            return;
        }
        if(++searchRecordNum==searchRecord_max){
            delete searchRecord[searchRecord_cacheKey];
        }
        searchRecord_cacheKey=url;
        if(config.method=="post"){
            var urlA = url.split("?");
            httpClient.post(urlA[0], urlA[1], httpCallBac);
        }else {
            httpClient.get(url, httpCallBac);
        }
    };
    exports.newInstance = function (fuc) {
        return function () {
            fuc += "";
            if (fuc.indexOf("\nexports=this;") == -1) {
                fuc = ("0,(" + fuc + ")").replace("{", "{\nexports=this;");
                var p = /([\s;=]+require\s*\([\s\S]*?\))/g;
                fuc = fuc.replace(p, "$1.newInstance()");
                p = /( *\. *newInstance *\( *\)){2}/g;
                fuc = fuc.replace(p, ".newInstance()");
            }
            return new (eval(fuc))(require,exports,module);
        }
    }(arguments.callee);
})