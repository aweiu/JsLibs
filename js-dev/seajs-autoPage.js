/**
 * Created by awei on 15/8/24.
 */
define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var httpClient = require("seajs-httpClient");
    var config, loadding, tipFuc, drawFuc, dataCont, requestCount = 0, loadMode,isScrollBottom,
        loadingImg = document.createElement("img");
    loadingImg.src = assetsUrl+"imgs/seajs-autoPage-loading.gif";
    loadingImg.style.cssText = "width: 15px; height: 15px;vertical-align: middle;";
    exports.int = function (configure) {
        config = configure;
        var pageCont = document.getElementById(config.contId);
        dataCont = document.createElement("div");
        pageCont.appendChild(dataCont);
        loadding = document.createElement("table");
        loadding.style.cssText = "width:100%;height: 15px;margin: 10px auto;clear: both;text-align: center;float:left;";
        if (config.autoRun !== false) {
            exports.update(config.pageNow);
        }
    }
    exports.setConfig = function (key, value) {
        config[key]=value;
    }
    exports.getConfig = function (key) {
        return eval("config." + key);
    }
    exports.update = function (page) {
        httpClient.showWaitting = true;
        dataCont.innerHTML = "";
        loadding.innerHTML = "";
        loadding.appendChild(loadingImg);
        loadding.innerHTML += "<span style='font-size:15px;color:#999999;'>正在加载...</span>";
        var scrollCont = document.getElementById(config.contId);
        if(dataCont.parentNode!=scrollCont)scrollCont.appendChild(dataCont);
        while(true){
            if(getComputedStyle(scrollCont).overflowY!="hidden")break;
            if(scrollCont==document.body){
                console.log("没有发现可能出现滚动条的容器,请检查样式!");
                return;
            }
        }
        if(scrollCont==document.body){
            isScrollBottom=function(){
                return scrollCont.scrollTop >= (document.body.scrollHeight - document.documentElement.clientHeight);
            }
        }else{
            isScrollBottom=function(){
                return scrollCont.scrollTop >= (scrollCont.scrollHeight -scrollCont.getBoundingClientRect().height);
            }
        }
        drawFuc = vT("draw");
        tipFuc = (typeof(config.emptyTip) == "string" ? function () {
            return config.emptyTip
        } : config.emptyTip);
        loadMode = {
            onScroll: function () {
                if ((dataCont.lastChild != loadding) && isScrollBottom()) {
                    dataCont.appendChild(loadding);
                    run(++exports.pageNow);
                }
            },
            start: function () {
                scrollCont.addEventListener("scroll", this.onScroll);
            },
            end: function () {
                scrollCont.removeEventListener("scroll", this.onScroll);
            }
        };
        loadding.onclick = null;
        if (config.loadMode == 1) {
            var loadMore=loadding.cloneNode(false);
            loadMore.innerHTML="<span style='font-size:15px;color:#999999;cursor:pointer;'>点击加载更多</span>";
            loadMore.onclick = function () {
                dataCont.removeChild(loadMore);
                dataCont.appendChild(loadding);
                run(++exports.pageNow);
            };
            loadMode = {
                start: function () {
                    dataCont.appendChild(loadMore);
                },
                end: function () {
                    loadMore=null;
                }
            };
        }
        run(page);
    };
    exports.formatData = function (baseData, itemJson) {
        return baseData.replace(/\{(.*?)\}/g, function ($0, $1) {
            var evalue = eval("itemJson." + $1);
            if (evalue != null) {
                return evalue;
            } else {
                return "";
            }
        })
    }
    var isFull = function (dataCont) {
        var start = function (child) {
            if(!child)return false;
            if (child.getBoundingClientRect().bottom > document.documentElement.clientHeight)return true;
            var childs = child.children;
            for (var i = 0, l = childs.length; i < l; i++) {
                if (start(childs[i]))return true;
            }
            return false;
        };
        return start(dataCont.lastElementChild);
    };
    var draw = function (rs,baseRs) {
        removeLoading();
        if (rs) {
            for (var i = 0; i < rs.length; i++) {
                var output = drawFuc(rs[i]);
                if (typeof (output) != "object") {
                    dataCont.innerHTML += exports.formatData(output, rs[i]);
                } else {
                    dataCont.appendChild(output);
                }
            }
            if (config.onFinishDraw)config.onFinishDraw(rs);
        }
        var isLessPageSize=(!rs || rs.length < config.pageSize.split("=")[1] / 1);
        if (isLessPageSize&&dataCont.innerHTML == "" && config.emptyTip) {
                var output = tipFuc();
                if (typeof (output) != "object") {
                    dataCont.innerHTML = output;
                } else {
                    dataCont.appendChild(output);
                }
        }else if(isLessPageSize||(config.isLoadOver&&config.isLoadOver(baseRs))){
            console.log("已显示全部");
            if (loadMode.end)loadMode.end();
            loadding.innerHTML = "<span style='font-size: 15px;color:#999999;'>已显示全部</span>";
            dataCont.appendChild(loadding);
        } else if (!isFull(dataCont)) {
            httpClient.showWaitting = true;
            console.log("没有填满继续加载");
            run(++exports.pageNow);
        }else{
            console.log("开启下拉加载");
            httpClient.showWaitting = false;
            if (loadMode.start)loadMode.start();
        }
    };
    function run(page) {
        var code = ++requestCount;
        if (page == null) {
            exports.pageNow = 1;
            page = (config.pageNow == null ? "" : config.pageNow.split("=")[0] + "=1");
        } else if ((page += "").indexOf("=") == -1) {
            exports.pageNow = page;
            page = config.pageNow.split("=")[0] + "=" + page;
        } else {
            exports.pageNow = config.pageNow.split("=")[1];
        }
        var url = config.url;
        if (config.pageSize != null) {
            url += ((config.url.indexOf("?") != -1 ? "&" : "?") + page + "&" + config.pageSize);
        }
        var httpCallBac = function (rs) {
            if (code == requestCount) {
                if (config.dataKey) {
                    draw(eval("rs." + config.dataKey),rs);
                } else {
                    draw(rs,rs);
                }
            }
        };
        if (config.method == "post") {
            var urlA = url.split("?");
            httpClient.post(urlA[0], urlA[1], httpCallBac);
        } else {
            httpClient.get(url, httpCallBac);
        }
    }

    function removeLoading() {
        if (dataCont.lastChild == loadding)dataCont.removeChild(loadding);
    }

    function vT(key) {
        return (typeof(config[key]) == "string" ? function (itemJson) {
            return exports.formatData(config[key], itemJson)
        } : config[key]);
    }

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
            return new (eval(fuc))(require,exports, module);
        }
    }(arguments.callee);
});