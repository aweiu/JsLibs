define(function (require, exports, module) {
    var httpClient = require("seajs-httpClient"),
        tip = require("seajs-gritter"),
        table, config, row,tableColumn,tbody;
    var setTBodyInnerHTML=function(tbody, html) {
        try {
            tbody.innerHTML=html;
        }catch (e){
            var children=tbody.childNodes;
            for(var l=children.length,i=l-1;i>=0;i--){
                tbody.removeChild(children[i]);
            }
            if(html.replace(/ /g,"")=="")return;
            var div=document.createElement("div");
            div.innerHTML="<table>"+html+"</table>";
            var dTbodyChildren=div.getElementsByTagName("tbody")[0].childNodes;
            for(l=dTbodyChildren.length,i=l-1;i>=0;i--){
                tbody.insertBefore(dTbodyChildren[i],tbody.firstChild);
            }
        }
    },
    drawTable = function (data, page) {
        setTBodyInnerHTML(tbody,"");
        try {
            var dataJson = config.dataKey?eval("data." + config.dataKey):data;
        } catch (e) {
            console.log(e);
        } finally {
            if (dataJson == null || dataJson.length == 0) {
                if (row != null) {
                    table.parentNode.removeChild(row);
                    row = null
                }
                tip.show("暂无数据", false)
                return;
            }
        }
        for (var i = 0; i < dataJson.length; i++) {
            var tr = document.createElement("tr");
            for (var k = 0; k < tableColumn; k++) {
                var td = document.createElement("td");
                var valueTmp = config.data[k];
                if (typeof (valueTmp) == "function") {
                    var vResult=valueTmp(dataJson[i]);
                } else if (valueTmp.substring(0, 1) == "$") {
                    vResult = valueTmp.substring(1, valueTmp.length) / 1 + i;
                } else {
                    vResult =valueTmp.replace(/\{(.*?)\}/g,function($0,$1){
                        var evalue=eval("dataJson[i]." + $1);
                        if(evalue!=null){
                            return evalue;
                        }else{
                            return "-";
                        }
                    });
                }
                if (typeof (vResult) != "object") {
                    td.innerHTML = vResult;
                } else {
                    td.appendChild(vResult);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        var pageTotal = eval("data." + config.pageTotalKey);
        createPagination(pageTotal, page);
        var onfinish=config.onfinish||exports.onfinish;
        if (onfinish)onfinish(data);
    };
    var createPagination = function (totalPage, nowPage) {
        if (row != null) {
            table.parentNode.removeChild(row);
            row = null
        }
        if (totalPage == null || totalPage < 2) {
            return
        }
        row = document.createElement("div");
        row.className = "row";
        var col_sm_5 = document.createElement("div");
        col_sm_5.className = "col-sm-5";
        var dataTables_info = document.createElement("div");
        dataTables_info.className = "dataTables_info";
        dataTables_info.innerHTML = "第 ";
        var nowPage_info = document.createElement("span");
        nowPage_info.innerHTML = nowPage;
        var span = document.createElement("span");
        span.innerHTML = " 页 ( 总共 " + totalPage + " 页 )";
        dataTables_info.appendChild(nowPage_info);
        dataTables_info.appendChild(span);
        col_sm_5.appendChild(dataTables_info);
        row.appendChild(col_sm_5);
        var col_sm_7 = document.createElement("div");
        col_sm_7.className = "col-sm-7";
        var dataTables_paginate = document.createElement("div");
        dataTables_paginate.className = "dataTables_paginate paging_simple_numbers";
        col_sm_7.appendChild(dataTables_paginate);
        row.appendChild(col_sm_7);
        var pagination = document.createElement("ul");
        pagination.className = "pagination";
        dataTables_paginate.appendChild(pagination);
        for (var i = 0; i <= totalPage + 1; i++) {
            var paginate_button = document.createElement("li");
            paginate_button.style.cursor = "pointer";
            paginate_button.onclick = function () {
                if (this.className != "disabled") {
                    if (this.innerHTML.indexOf("上一页")!=-1) {
                        exports.run(--nowPage);
                    } else if (this.innerHTML.indexOf("下一页")!=-1) {
                        exports.run(++nowPage);
                    } else {
                        exports.run(this.childNodes[0].innerHTML);
                    }
                }
            };
            pagination.appendChild(paginate_button);
            if (i == 0) {
                paginate_button.innerHTML = "<a>上一页</a>";
                if (nowPage == 1) {
                    paginate_button.className = "disabled";
                }
            } else if (i == totalPage + 1 || i == 8) {
                paginate_button.innerHTML = "<a>下一页</a>";
                if (nowPage == totalPage) {
                    paginate_button.className = "disabled";
                }
                break;
            } else {
                paginate_button.innerHTML = "<a>" + i + "</a>";
            }
        }
        if (totalPage > 7) {
            var more1 = pagination.childNodes[2];
            var more2 = pagination.childNodes[6];
            var more = function (obj) {
                obj.childNodes[0].innerHTML = "…";
                obj.className = "disabled";
            };
            pagination.childNodes[7].innerHTML = "<a>" + totalPage + "</a>";
            if (nowPage < 5) {
                more(more2);
                pagination.childNodes[nowPage].className = "active";
            } else if (nowPage > totalPage - 4) {
                more(more1);
                for (var i = totalPage - 4; i <= totalPage; i++) {
                    var tmp = pagination.childNodes[7 - totalPage + i];
                    if (i == nowPage) {
                        tmp.className = "active"
                    }
                    tmp.innerHTML = "<a>" + i + "</a>";
                }
            } else {
                more(more1);
                more(more2);
                pagination.childNodes[4].className = "active";
                for (var i = nowPage - 1; i <= nowPage / 1 + 1; i++) {
                    pagination.childNodes[4 - nowPage + i].innerHTML = "<a>" + i + "</a>";
                }
            }
        } else {
            pagination.childNodes[nowPage].className = "active";
        }
        table.parentNode.insertBefore(row, table.nextSibling);
    }
    exports.int = function (configure) {
        config = configure;
        table = document.getElementById(config.table);
        tableColumn = table.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th").length;
        tbody = table.getElementsByTagName("tbody")[0];
        exports.run(config.pageNow);
    };
    exports.run = function (page) {
        if (page == null) {
            exports.nowPage = 1;
            page = (config.pageNow == null ? "" : config.pageNow.split("=")[0] + "=1");
        } else if ((page += "").indexOf("=") == -1) {
            exports.nowPage = page;
            page = config.pageNow.split("=")[0] + "=" + page;
        } else {
            exports.nowPage = config.pageNow.split("=")[1];
        }
        var url = config.url;
        if (config.pageSize != null) {
            url += ((config.url.indexOf("?") != -1 ? "&" : "?") + page + "&" + config.pageSize);
        }
        if (config.method == "post") {
            var urlA = url.split("?");
            httpClient.post(urlA[0], urlA[1], function(rs){
                drawTable(rs, exports.nowPage);
            });
        } else {
            httpClient.get(url, function(rs){
                drawTable(rs, exports.nowPage);
            });
        }
    };
    exports.setConfig = function (key, value) {
        eval("config." + key + "='" + value + "'");
    };
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