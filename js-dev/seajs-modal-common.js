define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var waiting_bg,
        config, timer, timer_out, wrap_content, waiting_wrap,hideOnClickOut;
    exports.int = function (configure) {
        config = configure;
    };
    var fixModal = new function () {
        var offset;
        this.setOffset = function (value) {
            offset = value;
            this.main();
        };
        this.main = function () {
            var maxHeight = document.documentElement.clientHeight * 0.95;
            wrap_content.style.maxHeight = maxHeight + offset + "px";
            if(config.hasBac===false&&config.canClickOut){
                var waiting_bg_rect=waiting_bg.getBoundingClientRect();
                waiting_bg.style.top=(document.documentElement.clientHeight-(waiting_bg_rect.bottom-waiting_bg_rect.top))/2+"px";
                waiting_bg.style.left=(document.documentElement.clientWidth-(waiting_bg_rect.right-waiting_bg_rect.left))/2+"px";
            }
        }
    }(),
    scrollCtrl = new function () {
        var overflow;
        this.enable = function () {
            if (overflow)document.getElementsByTagName("html")[0].style.overflow = overflow;
        };
        this.dis = function () {
            if(config.hasBac===false&&config.canClickOut)return;
            var html = document.getElementsByTagName("html")[0];
            if (html.style.overflow == "hidden")return;
            overflow = getComputedStyle(html).overflow;
            html.style.overflow = "hidden";
        }
    }(),
    HideOnClickOut=function(){
        var isClickOnContent = true,
            dClick=function(){
                if (isClickOnContent) {
                    isClickOnContent = false;
                } else {
                    exports.hide();
                }
            },
            wClick=function(){
                isClickOnContent = true;
            };
        this.enable=function(){
            setTimeout(function(){
                wrap_content.addEventListener("click", wClick);
                document.addEventListener("click",dClick);
            },0);
        }
        this.dis=function(){
            wrap_content.removeEventListener("click", wClick);
            document.removeEventListener("click",dClick);
        }
    };
    exports.hide = function () {
        if (waiting_bg) {
            waiting_bg.style.display = "none";
            if (timer_out)clearTimeout(timer_out);
            if (timer)clearInterval(timer);
            scrollCtrl.enable();
            if(hideOnClickOut)hideOnClickOut.dis();
        }
    }
    var autoHide = function () {
        var t = 1300;
        waiting_bg.style.opacity = 1;
        timer_out = setTimeout(function () {
            timer = setInterval(function () {
                if (waiting_bg.style.opacity <= 0) {
                    clearInterval(timer);
                    exports.hide();
                    return;
                }
                waiting_bg.style.opacity -= 1 / (t / 16);
            }, 16);
        }, 1000);
    }
    exports.show = function () {
        exports.hide();
        if (waiting_bg != null) {
            waiting_wrap.style.behavior = "url("+assetsUrl+"'htc/PIE.htc')";
            waiting_bg.style.display = "table";
            document.body.appendChild(waiting_bg);
            scrollCtrl.dis();
            if (config.afterShow)config.afterShow(wrap_content);
            if (config.autoHide)autoHide();
            if(hideOnClickOut)hideOnClickOut.enable();
            return;
        }
        if (!config.content) {
            console.log("please int me..");
            return;
        }
        waiting_bg = document.createElement("table");
        waiting_bg.style.cssText = "position:fixed;z-index:99999999999;";
        if (config.hasBac!==false){
            waiting_bg.style.cssText += ";top:0;left:0;height:100%;width:100%;background-color: rgba(0, 0, 0, .5);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000,endColorstr=#7f000000);";
        }else if(!config.canClickOut){
            waiting_bg.style.cssText += ";top:0;left:0;height:100%;width:100%;";
        }
        document.body.appendChild(waiting_bg);
        var td = document.createElement("td");
        waiting_wrap = document.createElement("div");
        td.style.cssText = "color:white;text-align:center;vertical-align: middle;";
        waiting_wrap.style.cssText = "display:inline-block;max-width:95%;";
        wrap_content = document.createElement("div");
        if (config.hideOnClickOut)hideOnClickOut=new HideOnClickOut();
        waiting_wrap.appendChild(wrap_content);
        wrap_content.style.cssText = "overflow:hidden;overflow-y:auto;";
        fixModal.setOffset(0);
        if (config.overflow) {
            wrap_content.style.overflow = config.overflow
        }
        if (config.hasWrap == null || config.hasWrap) {
            waiting_wrap.style.cssText += ";background-color: white;padding: 50px 0;border-radius: 10px;position: relative;overflow: hidden;";
            wrap_content.style.cssText += ";padding:0 90px;";
            fixModal.setOffset(-100);
            if (config.padding) {
                waiting_wrap.style.padding = config.padding;
                wrap_content.style.paddingLeft = waiting_wrap.style.paddingLeft;
                waiting_wrap.style.paddingLeft = "0";
                wrap_content.style.paddingRight = waiting_wrap.style.paddingRight;
                waiting_wrap.style.paddingRight = "0";
            }
            if (config.hasShadow)waiting_wrap.style.cssText += ";box-shadow:0px 0px 10px #666;";
            if (config.hasTitleBar) {
                //由于要给titlebar预留位置故须调整内边距
                var waiting_wrap_pad_top = waiting_wrap.style.paddingTop.replace("px", "") / 1;
                var waiting_wrap_pad_bom = waiting_wrap.style.paddingBottom.replace("px", "") / 1;
                waiting_wrap.style.paddingTop = waiting_wrap_pad_top + 45 + "px";
                fixModal.setOffset(-waiting_wrap_pad_top - waiting_wrap_pad_bom - 45);
                //生成titleBar
                var titleBar = document.createElement("div"),
                    close;
                titleBar.style.cssText = "position:absolute;left: 0;top:0;background-color:#f7f7f7;height:45px;width:100%;color:#999;line-height:43px;border-radius: 10px 10px 0px 0px;";
                if (config.title) {
                    var title = document.createElement("div");
                    title.style.cssText = "float:left;margin-left:15px;";
                    title.innerHTML = config.title;
                    titleBar.appendChild(title);
                }
                waiting_wrap.appendChild(titleBar);
            }
            if (config.hasClose) {
                close = document.createElement("div");
                close.style.cssText = "cursor: pointer;font-size:30px;margin-right:15px;";
                if (titleBar) {
                    close.style.cssText += ";float:right;";
                    titleBar.appendChild(close);
                } else {
                    close.style.cssText += ";position:absolute;color:#dadada;";
                    if (config.closePosition) {
                        close.style.cssText += (";" + config.closePosition);
                    } else {
                        close.style.cssText += ";right: 15px;top:5px";
                    }
                }
                close.innerHTML = "×";
                close.addEventListener("click", exports.hide);
                if (!titleBar)waiting_wrap.appendChild(close);
            }
        }
        if (config.textAlign)wrap_content.style.textAlign = config.textAlign;
        td.appendChild(waiting_wrap);
        waiting_bg.appendChild(td);
        try {
            wrap_content.appendChild(config.content);
        } catch (e) {
            wrap_content.innerHTML += config.content;
        } finally {
            scrollCtrl.dis();
            if (config.afterShow)config.afterShow(wrap_content);
            if (config.autoHide)autoHide();
            if (typeof(myPlaceHolder) != "undefined")myPlaceHolder.main(wrap_content);
            waiting_wrap.style.behavior = "url("+assetsUrl+"'htc/PIE.htc')";
            fixModal.main();
            window.addEventListener("resize", fixModal.main);
            if(hideOnClickOut)hideOnClickOut.enable();
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
});