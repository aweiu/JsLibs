/**
 * Created by awei on 2015/12/1.
 */
(function(){
    window.console = window.console || (function () {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function () {};
        return c;
    })();
    Array.prototype.indexOf = Array.prototype.indexOf||function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)return from;
        }
        return -1;
    };
    Array.prototype.forEach = Array.prototype.forEach||function (fun /*, thisp*/) {
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0,l=this.length; i < l; i++) {
            fun.call(thisp, this[i], i, this);
        }
    };
    window.HTMLElement = window.HTMLElement || Element;
    window.HTMLDocument = window.HTMLDocument || Document;
    var eventQueue={
        add:function(node,type,fuc){
            var rValue=false;
            if(!this.hasOwnProperty(node))this[node]={};
            if(!this[node].hasOwnProperty(type)){
                this[node][type]=[];
                rValue=true;
            }
            var evtArr=this[node][type];
            if(evtArr.indexOf(fuc)==-1)evtArr.push(fuc);
            return rValue;
        },
        remove:function(node,type,fuc){
            try{
                var evtArr=this[node][type];
                evtArr.splice(evtArr.indexOf(fuc), 1);
                if(evtArr.length==0)delete this[node][type];
            }catch(e){

            }
        },
        get:function(node,type){
            try{
                return this[node][type].slice();
            }catch(e){
                return [];
            }
        },
        contain:function(node,type,fuc){
            try {
                return this[node][type].indexOf(fuc)!=-1;
            }catch (e){
                return false;
            }
        }
    },
    eventHost={
        add:function(node,type,fuc,host){
            if(!this.hasOwnProperty(node))this[node]={};
            if(!this[node].hasOwnProperty(type))this[node][type]={};
            if(!this[node][type].hasOwnProperty(fuc))this[node][type][fuc]=[];
            if(this[node][type][fuc].length==0){
                this[node][type][fuc].push(host);
                return true;
            }
        },
        get:function(node,type,fuc){
            try{
                return this[node][type][fuc];
            }catch(e){
            }
        },
        remove:function(node,type,fuc){
            try{
                delete this[node][type][fuc];
            }catch(e){

            }
        }
    },
    specialEvents={
        input:[
            "focusin",
            function(e){
                return document.activeElement == e.srcElement;
            }
        ],
        blur:[
            "focusout",
            function(e){
                return document.activeElement != e.srcElement;
            }
        ],
        focus:[
            "focusin",
            function(e){
                return document.activeElement == e.srcElement;
            }
        ],
        get:function(eventType){
            if(this.hasOwnProperty(eventType))return this[eventType];
            return [];
        }
    },
    setValByJs=false;
    HTMLElement.prototype.addEventListener = HTMLElement.prototype.addEventListener || function (eventType,fuc) {
        if(typeof fuc!="function")return;
        var that = this,
            specialEvent=specialEvents.get(eventType),
            realEventType=specialEvent[0]||eventType,
            realFuc=fuc,
            eventFilter=specialEvent[1];
        if(eventType=="input"){
            var propertychangeToInput=function(e){
                var target=e.srcElement;
                if(!eventHost.get(that,"input",fuc)){
                    target.removeEventListener("propertychange",propertychangeToInput);
                }else if(e.propertyName == "value" || e.propertyName == "selectedIndex"){
                    if(!setValByJs){
                        fuc.call(target,e);
                    }else{
                        setTimeout(function(){
                            setValByJs=false;
                        },0);
                    }
                }
            };
            realFuc=function(e){
                var target=e.srcElement;
                if(target.value != null){
                    target.addEventListener("propertychange",propertychangeToInput);
                    Object.defineProperty(target,"value",{
                        set:function(val){
                            setValByJs=true;
                            this.setAttribute("value",val);
                        },
                        get:function(){
                            return this.getAttribute("value");
                        }
                    })
                }
            }
            if(!eventHost.add(this,"input",fuc,["focusin",realFuc]))return;
        }
        if(eventQueue.add(this,realEventType,realFuc)){
            this.attachEvent("on" + realEventType, function(e){
                if(!eventFilter||eventFilter(e)){
                    eventQueue.get(that,realEventType).forEach(function(m){
                        if(eventQueue.contain(that,realEventType,m)){
                            m.call(that, e);
                        }
                    });
                }
            });
        }
    };
    HTMLDocument.prototype.addEventListener = HTMLDocument.prototype.addEventListener || HTMLElement.prototype.addEventListener;
    window.addEventListener = window.addEventListener || HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.removeEventListener = HTMLElement.prototype.removeEventListener || function (eventType, fuc) {
            if(typeof fuc!="function")return;
            var realEventType=specialEvents.get(eventType)[0]||eventType,
                realFuc=eventHost.get(this,eventType,fuc)||fuc;
            if(typeof(realFuc)=="function"){
                eventQueue.remove(this,realEventType,realFuc)
            }else{
                realFuc.forEach(function (m) {
                    eventQueue.remove(this,m[0],m[1]);
                });
                eventHost.remove(this,eventType,fuc);
            }
        };
    HTMLDocument.prototype.removeEventListener = HTMLDocument.prototype.removeEventListener || HTMLElement.prototype.removeEventListener;
    window.removeEventListener = window.removeEventListener || HTMLElement.prototype.removeEventListener;
    Event.prototype.preventDefault = Event.prototype.preventDefault || function () {
            this.returnValue = false
        };
    Event.prototype.stopPropagation = Event.prototype.stopPropagation || function () {
            this.cancelBubble = true
        };
    HTMLElement.prototype.getComputedStyle = HTMLElement.prototype.getComputedStyle || function () {
            return this.currentStyle;
        };
    var getBoundingClientRectCopy = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
        getBoundingClientRectCopy.call(document.body);
        var rValue=getBoundingClientRectCopy.call(this);
        return {
            left:rValue.left,
            right:rValue.right,
            top:rValue.top,
            bottom:rValue.bottom,
            width:rValue.right-rValue.left,
            height:rValue.bottom-rValue.top
        };
    };
    window.getComputedStyle = window.getComputedStyle || function (obj) {
            var style = {
                getPropertyValue: function (key) {
                    return this[key]
                }
            };
            for (var o in obj.currentStyle) {
                try {
                    style[o] = obj.currentStyle[o];
                } catch (e) {
                    //console.log("can't support "+o);
                }
            }
            return style;
        };
    HTMLElement.prototype.hasOwnProperty=Object.prototype.hasOwnProperty;
})();
