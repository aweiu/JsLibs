/**
 * Created by awei on 2015/11/18.
 */
define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var config = {};
    var ifr_code = 0;
    exports.int = function (configure) {
        config = configure;
        var uploadIpts=config.uploadIpts;
        if(uploadIpts){
            document.removeEventListener("change",changeFuc);
            var type=Object.prototype.toString.call(uploadIpts).slice(8, -1);
            if(type!="Array"&&type!="HTMLCollection")uploadIpts=[uploadIpts];
            for(var i=0,l=uploadIpts.length;i<l;i++){
                uploadIpts[i].addEventListener("change",changeFuc);
            }
        }
    };
    var getIfrCode = function () {
        while (document.getElementsByName("ifr_" + ifr_code).length > 0)ifr_code++;
        return "ifr_" + ifr_code;
    },
    clearFile = function (fIpt) {
        try{
            fIpt.file = null;
            fIpt.value = "";
            fIpt.select();
            document.selection.clear();
        }catch(e){

        }finally{
            return false;
        }    
    },
    getOffset = function (n1, n2) {
        var nr1 = n1.getBoundingClientRect();
        var nr2 = n2.getBoundingClientRect();
        return {
            left: nr1.left - nr2.left,
            top: nr1.top - nr2.top
        }
    },
    createWrapper=function(node){
        var mySuperWrapper=node.mySuperWrapper;
        if(!mySuperWrapper){
            mySuperWrapper=document.createElement("mySuperWrapper");
            node.mySuperWrapper=mySuperWrapper;
            mySuperWrapper.style.cssText="position:relative;float:left;";
        }
        node.insertBefore(mySuperWrapper,node.firstChild);
        return mySuperWrapper;
    },
    getDw=function(obj){
        var mySuperWrapper=obj.parentNode.mySuperWrapper,
            offset=getOffset(obj,obj.parentNode),
            rValue={
                l:offset.left,
                t:offset.top
            };
        if(getComputedStyle(obj).position=="fixed"){
            return rValue;
        }else{
            offset=getOffset(mySuperWrapper,mySuperWrapper.parentNode);
            return {
                l:rValue.l-offset.left,
                t:rValue.t-offset.top
            }
        }
    },
    //图片上传过渡
    showWaiting = function (img) {
        var waiting_bg;
        var fix=function(){
            var dw=getDw(img),
                imgBoundRect=img.getBoundingClientRect();
            waiting_bg.style.left = dw.l + "px";
            waiting_bg.style.top = dw.t + "px";
            waiting_bg.style.width=(imgBoundRect.right - imgBoundRect.left)+"px";
            waiting_bg.style.height=(imgBoundRect.bottom - imgBoundRect.top)+"px";
        };
        img.showWaiting=function(){
            waiting_bg=this.waiting_bg;
            if(waiting_bg){
                waiting_bg.style.display = "table";
            }else{
                waiting_bg=document.createElement("table");
                img.waiting_bg=waiting_bg;
                waiting_bg.style.cssText = "position:absolute;background-color: rgba(0, 0, 0, .5);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000,endColorstr=#7f000000);z-index:99999999999;";
                var td = document.createElement("td");
                td.style.cssText = "color:white;text-align:center;vertical-align: middle;";
                td.innerHTML = "<img src='"+assetsUrl+"/imgs/seajs-uploadImgs-loading.gif'/>";
                waiting_bg.appendChild(td);
                var mySuperWrapper=createWrapper(this.parentNode);
                mySuperWrapper.appendChild(waiting_bg);
                img.addEventListener("load", fix);
                img.hideWaiting = function () {
                    if (this.waiting_bg) {
                        this.waiting_bg.style.display = "none";
                        this.removeEventListener("load",fix);
                    }
                };
            }
            fix();
        }
    },
    checkImg = function (fileIpt) {
        var checkExt = function (ext) {
            if (fileIpt.accept) {
                var filter = fileIpt.accept.split(",");
                if (filter.indexOf(ext) == -1) {
                    alert("仅支持" + fileIpt.accept + "格式文件");
                    return false;
                }
            }
            return true;
        };
        try {
            var file = fileIpt.files[0];
            //格式筛选
            if (!checkExt(file.type)) {
                return false;
            }
            //文件大小过滤
            var this_maxFileSize = config.maxFileSize;
            if (file.size > this_maxFileSize) {
                if (this_maxFileSize < 1024) {
                    alert("文件大小不能超过" + this_maxFileSize + "字节");
                } else if (this_maxFileSize < 1048576) {
                    this_maxFileSize = this_maxFileSize / 1024;
                    alert("文件大小不能超过" + this_maxFileSize.toFixed(2) + "KB");
                } else {
                    this_maxFileSize = this_maxFileSize / 1048576;
                    alert("文件大小不能超过" + this_maxFileSize.toFixed(2) + "MB");
                }
                return false;
            }
            return true;
        } catch (e) {
            var filePath = fileIpt.value;
            var fileExt = "image/" + filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase();
            if (!checkExt(fileExt)) {
                return false;
            }
            return true;
        }
    },
    preImg = function (img, filePath) {
        showWaiting(img);
        try {
            var reader = new FileReader();
            reader.readAsDataURL(filePath);
            reader.onload =function () {
                img.src = this.result;
                img.showWaiting();
            };
        } catch (e) {
            img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + filePath + "',sizingMethod='scale')";
            img.showWaiting();
        }
    },
    changeFuc=function(e){
        var target = e.srcElement || e.target;
        if (target.type == "file") {
            var uploadUrl = target.getAttribute("uploadUrl") || config.uploadUrl;
            if (uploadUrl == null) {
                console.log("尚未设置提交地址");
                return;
            };
            try {
                target.select();
                target.blur();
                var filePath = document.selection.createRange().text;
            } catch (e) {
                filePath = target.files[0];
            }finally{
                if (!filePath)return;
                if (!checkImg(target)) {
                    return clearFile(target);
                }
                var imgTo = target.getAttribute("imgTo");
                if (imgTo) {
                    var img = document.getElementById(imgTo);
                    if (img) preImg(img, filePath);
                }
                //开始上传
                var dataForm=target.dataForm, ifr;
                if (dataForm) {
                    ifr = dataForm.ifr;
                } else {
                    var ifr_name = getIfrCode();
                    dataForm = document.createElement("form");
                    dataForm.method = "post";
                    dataForm.action = config.uploadUrl;
                    dataForm.enctype = "multipart/form-data";
                    dataForm.encoding = "multipart/form-data";
                    dataForm.encType = "multipart/form-data";
                    dataForm.target = ifr_name;
                    dataForm.style.display = "none";
                    ifr = document.createElement("iframe");
                    ifr.name = ifr_name;
                    ifr.style.display = "none";
                    ifr.addEventListener("load",function () {
                        if (this.hasSubmit) {
                            this.hasSubmit = false;
                        } else {
                            return;
                        }
                        var rs = window.frames[this.name].document.body.innerHTML;
                        rs = rs.replace(/<.+?>/gim, '');
                        try {
                            rs = eval("(" + rs + ")");
                        } catch (e) {
                            console.log(e);
                        } finally {
                            if (config.onUploadFinish)config.onUploadFinish(rs, target.getAttribute("actionName"));
                            var jsonTo = target.getAttribute("jsonTo");
                            if (jsonTo) {
                                var jsonTo_ipt = document.getElementById(jsonTo);
                                if (jsonTo_ipt) {
                                    var jsonValue = jsonTo_ipt.getAttribute("jsonValue");
                                    if (jsonValue != null) {
                                        jsonTo_ipt.value = eval("rs" + jsonValue);
                                    }
                                }
                            }
                            if(img)img.hideWaiting();
                        }
                    });
                    document.body.appendChild(dataForm);
                    dataForm.appendChild(ifr);
                    dataForm.ifr = ifr;
                    target.dataForm = dataForm;
                }
                var tmp=target.nextSibling;
                dataForm.appendChild(target);
                ifr.hasSubmit = true;
                dataForm.submit();
                tmp.parentNode.insertBefore(target,tmp);
            }
        }
    }
    document.addEventListener("change",changeFuc);
    exports.newInstance=function(){
        return exports;
    }
});