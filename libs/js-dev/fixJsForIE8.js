/**
 * Created by awei on 2015/12/1.
 */
window.console = window.console || (function () {
        var c = {};
        c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
            = c.clear = c.exception = c.trace = c.assert = function () {
        };
        return c;
    })();
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)return from;
        }
        return -1;
    };
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}
window.HTMLElement = window.HTMLElement || Element;
window.HTMLDocument = window.HTMLDocument || Document;

HTMLElement.prototype.addEventListener = HTMLElement.prototype.addEventListener || function (eventType, fuc) {
        var expandFuc = function () {
            return true
        }, that = this;
        switch (eventType) {
            case "input":
                var onMyPropertychange = function (e) {
                    var target = e.srcElement;
                    if (that.eventQueue && that.eventQueue["mousedown"].indexOf(onMyInput) != -1) {
                        if (e.propertyName == "value" || e.propertyName == "selectedIndex") {
                            if (!target.isSetValByJs) {
                                fuc.call(that, e);
                            }
                        }
                    } else {
                        target.removeEventListener("propertychange", onMyPropertychange);
                    }
                };
                var onMyInput = function (e) {
                    var target = e.srcElement;
                    if (target.value != null) {
                        target.addEventListener("propertychange", onMyPropertychange);
                    }
                };
                if (!this.inputQueue)this.inputQueue = [];
                this.inputQueue.push(fuc);
                this.inputQueue.push(onMyInput);
                this.addEventListener("mousedown", onMyInput);
                this.addEventListener("keydown", onMyInput);
                return;
            case "blur":
                eventType = "focusout";
                expandFuc = function (e) {
                    return document.activeElement != e.srcElement;
                };
                break;
            case "focus":
                eventType = "focusin";
                expandFuc = function (e) {
                    return document.activeElement == e.srcElement;
                };
                break;
        }
        if (!this.eventQueue)this.eventQueue = {};
        if (!this.eventQueue[eventType])this.eventQueue[eventType] = [];
        var eq = this.eventQueue[eventType];
        if (eq.indexOf(fuc) != -1)return;
        eq.push(fuc);
        if (!this["my" + eventType]) {
            this["my" + eventType] = function (e) {
                try {
                    if (expandFuc.call(that, e)) {
                        var tmp = that.eventQueue[eventType].slice();
                        tmp.forEach(function (m) {
                            if (typeof m == "function" && that.eventQueue[eventType].indexOf(m) != -1)m.call(that, e);
                        })
                    }
                } catch (e) {

                }
            };
            this.attachEvent("on" + eventType, this["my" + eventType]);
        }
    };
HTMLDocument.prototype.addEventListener = HTMLDocument.prototype.addEventListener || HTMLElement.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.prototype.addEventListener;
HTMLElement.prototype.removeEventListener = HTMLElement.prototype.removeEventListener || function (eventType, fuc) {
        switch (eventType) {
            case "input":
                if (this.inputQueue) {
                    var fucIndex = this.inputQueue.indexOf(fuc);
                    if (fucIndex == -1)return;
                    if (this.eventQueue && this.eventQueue["mousedown"]) {
                        var onMyInput = this.inputQueue[fucIndex + 1];
                        this.eventQueue["mousedown"].splice(this.eventQueue["mousedown"].indexOf(onMyInput), 1);
                        this.eventQueue["keydown"].splice(this.eventQueue["keydown"].indexOf(onMyInput), 1);
                        this.inputQueue.splice(fucIndex, 2);
                    }
                }
                return;
            case "blur":
                eventType = "focusout";
                break;
        }
        if (this.eventQueue && this.eventQueue[eventType]) {
            this.eventQueue[eventType].splice(this.eventQueue[eventType].indexOf(fuc), 1);
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