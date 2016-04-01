define(function (require, exports, module){
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/libs/";
    var httpClient=require("seajs-httpClient"),
        waiting = require("seajs-waiting"),
        myUtils=require("/seajs-myUtils");
    String.prototype.replaceAll = function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    };
    HTMLElement.prototype.removeClass=function(className){
        var r=new RegExp(className+" *","g");
        this.className=this.className.replace(r,"");
    };
    HTMLElement.prototype.addClass=function(className){
        if(new RegExp(" "+className+" ","g").test(" "+this.className+" "))return;
        this.className+=(" "+className);
    };
    HTMLElement.prototype.appendNodes = function (obj) {
          var rValue=[];
          if(obj.length){
              var tmp,tmp2;
              for(var i=obj.length-1;i>=0;i--){
                tmp2=obj[i];
                rValue.splice(0,0,tmp2);
                this.insertBefore(tmp2,tmp||null);
                tmp=tmp2;
              }
          }else{
              rValue.push(obj);
              this.appendChild(obj);
          }
          return rValue;
    };
    HTMLElement.prototype.insertNodesBefore = function (insertNodes,beforeNode) {
          var rValue=[];
          if(insertNodes.length){
              var tmp,tmp2;
              for(var i=insertNodes.length-1;i>=0;i--){
                tmp2=insertNodes[i];
                rValue.splice(0,0,tmp2);
                this.insertBefore(tmp2,tmp||beforeNode||null);
                tmp=tmp2;
              }
          }else{
              rValue.push(insertNodes);
              this.insertBefore(insertNodes,beforeNode);
          }
          return rValue;
    };
    Number.prototype.plusSign=function() {
        if(this>0){
            return "+"+this;
        }else{
            return this+"";
        }
    };
    String.prototype.plusSign=Number.prototype.plusSign;
    window.addEventListener("pageshow",function(e){
        if(e.persisted){
            location.reload();
        }
    });
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };
    var loadHtml=new function(){
        var tasks={};
        this.main=function(url,fuc){
            if(tasks.hasOwnProperty(url)){
                var task=tasks[url];
                if(task.isLoading){
                    if(!task.delayDo)task.delayDo=[];
                    task.delayDo.push(fuc);
                    return;
                }
                if(task.isLoadOver){
                    if(fuc)fuc();
                    return;
                }
            }
            tasks[url]={isLoading:true};
            httpClient.get(url,function(rs){
                var div=document.createElement("div");
                div.innerHTML=rs;
                var nodeArray=document.body.appendNodes(div.childNodes);
                if(fuc)fuc(nodeArray);
                div=null;
                var task=tasks[url];
                if(task.delayDo){
                    for(var i= 0,l=task.delayDo.length;i<l;i++){
                        if(task.delayDo[i])task.delayDo[i]();
                    }
                    task.delayDo=null;
                }
                tasks[url].isLoading=false;
                tasks[url].isLoadOver=true;
            });
        };
    }();
    var newUse=function(array,fuc){
        this.num=array.length;
        this.fuc=fuc;
        this.rValue={};
        waiting.show();
        for(var i=0;i<array.length;i++){
            this.loadFile(array[i]);
        }
        waiting.hide();
    };
    newUse.prototype.loadFile=function(array){
        var that=this;
        if (typeof(array) == "string") {
            array = [array]
        }
        var tmp=array[0].split(".");
        var loadFuc=((tmp.length>1&&tmp[tmp.length-1]=="html")?loadHtml.main:seajs.use);
        if (array.length == 1) {
            loadFuc(array[0],function(o){
                that.rValue[array[0]]=o;
                if(--that.num==0){
                    if(that.fuc)that.fuc(that.rValue);
                }
            });
        } else {
            loadFuc(array[0], function (o) {
                that.rValue[array[0]]=o;
                array.shift();
                that.loadFile(array);
            })
        }
    };
    exports.use=function(array,fuc){
        seajs.use("seajs-css",function(){
            new newUse(array,fuc);
        });
    };
    exports.$id=function(id){
        return document.getElementById(id);
    };
    exports.$name=function(name){
        return document.getElementsByName(name);
    };
    exports.$tagName=function(name){
        return document.getElementsByTagName(name);
    };
    exports.go=function(url,mode){
        waiting.show();
        if(mode){
            location.replace(url);
        }else{
            location.href=url;
        }
    };
    if(sessionStorage.getItem("refresh")=="true"){
        sessionStorage.setItem("refresh",false);
        location.reload();
    };
    exports.back=function(index,mode){
        if(index===true){
            sessionStorage.setItem("refresh",true);
            history.go(-1);
            return;
        }
        if(mode){
            sessionStorage.setItem("refresh",true);
        }
        if(index){
            history.go(-Math.abs(index));
        }else{
            history.go(-1);
        }
    };
    exports.newInstance = function () {
        return exports;
    };
    exports.getParameter=function(name){
        var parametes=location.href.split("?")[1];
        if(parametes){
            parametes=parametes.split("&");
            for(var i=parametes.length-1;i>=0;i--){
                var tmp=parametes[i].split("=");
                if(tmp[0]==name){
                    return tmp[1];
                }
            }
            return null;
        }
        return null;
    };
    exports.bindClick=function(node,fuc){
        if(!node.nodeType)node=exports.$id(node);
        node.addEventListener("click",fuc);
    };
    exports.bindCopy=function(config){
        var txt=config.txt,
            onSuccess=config.onSuccess,
            node=config.node;
        if(window.clipboardData){
            exports.bindClick(node,function(){
                window.clipboardData.clearData();
                window.clipboardData.setData("Text",txt);
                if(onSuccess)onSuccess();
            })
        }else{
            seajs.use("ZeroClipboard-min",function(){
                ZeroClipboard.config( { swfPath: assetsUrl+"flash/ZeroClipboard.swf" } );
                if(!node.nodeType)node=exports.$id(node);
                node.setAttribute("data-clipboard-text",txt);
                var clip=new ZeroClipboard(node);
                clip.on("afterCopy",onSuccess);
                clip.on("error",config.onError);
            })
        }
    }
    if(myUtils.superInt)myUtils.superInt(exports);
    for(var o in myUtils){
        if(myUtils.hasOwnProperty(o)){
            exports[o]=myUtils[o];
        }else{
            break;
        }
    }
});