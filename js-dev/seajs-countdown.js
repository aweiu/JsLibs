define(function (require, exports, module) {
    var obj;var objbc;var objc;var timer;
    exports.start=function(btn,secs){
        obj=btn;
        obj.setAttribute("disabled","true");
        objbc=obj.style.backgroundColor;
        objc=obj.style.color;
        var t=(secs==null?60:secs);
        obj.style.backgroundColor="#f4f4f4";
        obj.style.color="#999999";
        var objRect=obj.getBoundingClientRect();
        obj.style.width=(objRect.right-objRect.left)+"px";
        obj.innerHTML=t+"s";
        timer=setInterval(function(){
            obj.innerHTML=(--t)+"s";
            if(t<=0){
                exports.stop();
            }
        },1000);
    }
    exports.stop=function(){
        clearInterval(timer);
        obj.removeAttribute("disabled");
        obj.style.backgroundColor=objbc;
        obj.style.color=objc;
        obj.innerHTML="重新获取";
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
