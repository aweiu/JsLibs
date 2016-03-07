/**
 * Created by awei on 2016/2/2.
 */
define(function (require, exports, module) {
    var countdown=require("seajs-countdown").newInstance();
    var httpClient=require("seajs-httpClient");
    var tip=require("seajs-common-tip");
    var config;
    require("seajs-validate");
    exports.setConfig=function(key,value){
        if(key=="sendBtn"){
            console.log("you can't do it");
            return;
        }
        config[key]=value;
    };
    exports.int=function(configure){
        config=configure;
        config.sendBtn.addEventListener("click",function(){
            if(config.validIpts){
                var isok=true;
                var validIpts=config.validIpts;
                if(Object.prototype.toString.call(validIpts).slice(8, -1)!="Array")validIpts=[validIpts];
                for(var i= 0,l=validIpts.length;i<l;i++){
                    var validResult = validIpts[i].validMe(false);
                    if (!validResult.isok) {
                        isok=false;
                        validIpts[i].showErrorTip(validResult.tip);
                    }
                }
                if(!isok)return;
            }
            countdown.start(this);
            httpClient.showWaitting=false;
            var callBac=function(rs){
                httpClient.showWaitting=true;
                if(rs.code!=0){
                    countdown.stop();
                    if(config.onError){
                        config.onError(rs);
                    }else{
                        tip.show(rs.msg, false);
                    }
                }else{
                    if(config.onSuccess)config.onSuccess(rs);
                }
            };
            var parameters=config.parameters;
            if(typeof(config.parameters)=="function"){
                parameters=config.parameters();
            }
            if(config.method=="post"){
                httpClient.post(config.url,parameters,callBac);
            }else{
                httpClient.get(config.url+"?"+parameters,callBac);
            }
        });
    }
    exports.newInstance = function (fuc) {
        return function () {
            fuc += "";
            if (fuc.indexOf("\nexports=this;") == -1) {
                fuc = ("0,(" + fuc + ")").replace("{", "{\nexports=this;");
            }
            return new (eval(fuc))(require,exports,module);
        }
    }(arguments.callee);
});