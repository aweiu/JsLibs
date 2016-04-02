/**
 * Created by awei on 2016/2/17.
 */
define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var config, selectNum = 0, ifr_code = 0, removeIndex = [],imgArray;
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
        loadStyle=function(node,style){
            for(var o in style){
                if(style.hasOwnProperty(o)){
                    node.style[o]=style[o]
                }else{
                    break;
                }
            }
        },
        addRemoveBtn = function (img, index) {
            var removeBtn=img.removeBtn;
            var main = function () {
                var dw=getDw(img),
                    imgRect=img.getBoundingClientRect();
                removeBtn.style.left = (dw.l-7+imgRect.right-imgRect.left) + "px";
                removeBtn.style.top = (dw.t-7) + "px";
            };
            if (removeBtn) {
                removeBtn.style.display = "block";
            } else {
                var mySuperWrapper=createWrapper(img.parentNode);
                removeBtn = document.createElement("uploadImgsNode");
                img.removeBtn=removeBtn;
                mySuperWrapper.appendChild(removeBtn);
                removeBtn.innerHTML = "×";
                removeBtn.style.cssText = "width:" + 14 + "px;height:" + 14 + "px;position:absolute;z-index:99999999999;background-color:#e8464a;color:white;line-height:14px;text-align:center;font-weight:bold;cursor: pointer;border-radius:50%;";
                loadStyle(removeBtn,config.removeBtnStyle);
                img.addEventListener("load", main);
                removeBtn.addEventListener("click", function () {
                    if (config.removeFuc)config.removeFuc(index);
                    img.hideWaiting();
                    removeBtn.style.display = "none";
                    img.style.filter = "";
                    img.src = "";
                    selectNum--;
                    img.dataForm.ifr.hasSubmit = false;
                    removeIndex.push(index);
                    removeIndex.sort();
                });
            }
            main();
        },
        getNextImg = function () {
            var index = selectNum++;
            if (removeIndex[0] != null) {
                index = removeIndex[0];
                removeIndex.splice(0, 1);
            }
            return imgArray[index];
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
                reader.onload = function (index) {
                    return function () {
                        img.src = this.result;
                        img.showWaiting();
                        if (config.hasRemoveBtn !== false)addRemoveBtn(img, index);
                    }
                }(selectNum - 1);
            } catch (e) {
                img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + filePath + "',sizingMethod='scale')";
                img.showWaiting();
                if (config.hasRemoveBtn !== false)addRemoveBtn(img, selectNum - 1);
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
                    loadStyle(waiting_bg,config.loadingStyle);
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
        changeFuc = function () {
            try {
                this.select();
                this.blur();
                var filePath = document.selection.createRange().text;
            } catch (e) {
                filePath = this.files[0];
            } finally {
                if (!filePath)return;
                if (!checkImg(this)) {
                    return clearFile(this);
                }
                var img = getNextImg();
                preImg(img, filePath);
                //开始上传
                var dataForm, ifr;
                if (img.dataForm) {
                    dataForm = img.dataForm;
                    ifr = img.dataForm.ifr;
                    dataForm.removeChild(dataForm.lastChild);
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
                    ifr.addEventListener("load",function (index) {
                        return function () {
                            if (this.hasSubmit) {
                                this.hasSubmit = false;
                            } else {
                                return;
                            }
                            img.uploadImgCode--;
                            var rs = window.frames[this.name].document.body.innerHTML;
                            rs = rs.replace(/<.+?>/gim, '');
                            try {
                                rs = eval("(" + rs + ")");
                            } catch (e) {
//                                console.log(e);
                            } finally {
                                if (config.onUploadFinish)config.onUploadFinish(rs, index);
                                img.hideWaiting();
                            }
                        };
                    }(selectNum - 1));
                    document.body.appendChild(dataForm);
                    dataForm.appendChild(ifr);
                    dataForm.ifr = ifr;
                    img.dataForm = dataForm;
                }
                this.removeEventListener("click", clickFuc);
                this.removeEventListener("change", changeFuc);
                delete this.myclick;
                delete this.mychange;
                delete this.eventQueue;
                var fileIpt = this.cloneNode();
                fileIpt.addEventListener("click", clickFuc);
                fileIpt.addEventListener("change", changeFuc);
                this.parentNode.insertBefore(fileIpt, this);
                this.removeAttribute("id");
                this.name = img.name || config.name;
                dataForm.appendChild(this);
                ifr.hasSubmit = true;
                dataForm.submit();
                if(!img.hasOwnProperty("uploadImgCode")){
                    img.uploadImgCode=1
                }else{
                    img.uploadImgCode++;
                }
            }
        },
        clickFuc = function (e) {
            var uploadUrl = config.uploadUrl;
            if (uploadUrl == null) {
                console.log("尚未设置提交地址");
                e.preventDefault();
                return;
            }
            var alength;
            if (imgArray && (alength = imgArray.length, alength > 0)) {
                if (selectNum >= alength) {
                    alert("最多可上传" + alength + "张图片");
                    e.preventDefault();
                }
            } else {
                console.log("请设置正确的图片数组");
                e.preventDefault();
            }
        };
    exports.isBusy=function(img){
        return img.uploadImgCode==0?true:false;
    };
    exports.int = function (configure) {
        config = configure;
        var subBtn = config.subBtn;
        if (!subBtn || subBtn.type != "file") {
            console.log("错误的上传按钮");
            return;
        }
        imgArray=config.imgArray;
        if(Object.prototype.toString.call(imgArray).slice(8, -1)=="HTMLCollection"){
            var tmp=[];
            for(var i=0,l=imgArray.length;i<l;i++){
                tmp.push(imgArray[i]);
            }
            imgArray=tmp;
        }
        subBtn.addEventListener("click", clickFuc);
        subBtn.addEventListener("change", changeFuc);
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