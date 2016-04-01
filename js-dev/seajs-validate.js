define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    seajs.use("seajs-css",function(){
        seajs.use(assetsUrl+"css/seajs-validate.css");
    });
    // 身份证验证
    function clsIDCard(CardNo) {
        this.Valid = false;
        this.ID15 = '';
        this.ID18 = '';
        this.Local = '';
        if (CardNo != null)
            this.SetCardNo(CardNo);
    }
    // 设置身份证号码，15位或者18位
    clsIDCard.prototype.SetCardNo = function (CardNo) {
        this.ID15 = '';
        this.ID18 = '';
        this.Local = '';
        CardNo = CardNo.replace(" ", "");
        var strCardNo;
        if (CardNo.length == 18) {
            pattern = /^\d{17}(\d|x|X)$/;
            if (pattern.exec(CardNo) == null)
                return;
            strCardNo = CardNo.toUpperCase();
        } else {
            pattern = /^\d{15}$/;
            if (pattern.exec(CardNo) == null)
                return;
            strCardNo = CardNo.substr(0, 6) + '19' + CardNo.substr(6, 9)
            strCardNo += this.GetVCode(strCardNo);
        }
        //只要18位身份证
        if (CardNo.length != 18) {
            this.Valid = false;
        } else {
            this.Valid = this.CheckValid(strCardNo);
        }
    };
    // 校验身份证有效性
    clsIDCard.prototype.IsValid = function () {
        return this.Valid;
    }
    // 返回生日字符串，格式如下，1981-10-10
    clsIDCard.prototype.GetBirthDate = function () {
        var BirthDate = '';
        if (this.Valid)
            BirthDate = this.GetBirthYear() + '-' + this.GetBirthMonth() + '-'
                + this.GetBirthDay();
        return BirthDate;
    }
    // 返回生日中的年，格式如下，1981
    clsIDCard.prototype.GetBirthYear = function () {
        var BirthYear = '';
        if (this.Valid)
            BirthYear = this.ID18.substr(6, 4);
        return BirthYear;
    }
    // 返回生日中的月，格式如下，10
    clsIDCard.prototype.GetBirthMonth = function () {
        var BirthMonth = '';
        if (this.Valid)
            BirthMonth = this.ID18.substr(10, 2);
        if (BirthMonth.charAt(0) == '0')
            BirthMonth = BirthMonth.charAt(1);
        return BirthMonth;
    }
    // 返回生日中的日，格式如下，10
    clsIDCard.prototype.GetBirthDay = function () {
        var BirthDay = '';
        if (this.Valid)
            BirthDay = this.ID18.substr(12, 2);
        return BirthDay;
    }
    // 返回性别，1：男，0：女
    clsIDCard.prototype.GetSex = function () {
        var Sex = '';
        if (this.Valid)
            Sex = this.ID18.charAt(16) % 2;
        return Sex;
    }

    // 返回15位身份证号码
    clsIDCard.prototype.Get15 = function () {
        var ID15 = '';
        if (this.Valid)
            ID15 = this.ID15;
        return ID15;
    }

    // 返回18位身份证号码
    clsIDCard.prototype.Get18 = function () {
        var ID18 = '';
        if (this.Valid)
            ID18 = this.ID18;
        return ID18;
    }

    // 返回所在省，例如：上海市、浙江省
    clsIDCard.prototype.GetLocal = function () {
        var Local = '';
        if (this.Valid)
            Local = this.Local;
        return Local;
    }

    clsIDCard.prototype.GetVCode = function (CardNo17) {
        var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        var Ai = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardNoSum = 0;
        for (var i = 0; i < CardNo17.length; i++)
            cardNoSum += CardNo17.charAt(i) * Wi[i];
        var seq = cardNoSum % 11;
        return Ai[seq];
    }

    clsIDCard.prototype.CheckValid = function (CardNo18) {
        if (this.GetVCode(CardNo18.substr(0, 17)) != CardNo18.charAt(17))
            return false;
        if (!this.IsDate(CardNo18.substr(6, 8)))
            return false;
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (aCity[parseInt(CardNo18.substr(0, 2))] == null)
            return false;
        this.ID18 = CardNo18;
        this.ID15 = CardNo18.substr(0, 6) + CardNo18.substr(8, 9);
        this.Local = aCity[parseInt(CardNo18.substr(0, 2))];
        return true;
    }
    clsIDCard.prototype.IsDate = function (strDate) {
        var r = strDate.match(/^(\d{1,4})(\d{1,2})(\d{1,2})$/);
        if (r == null)
            return false;
        var d = new Date(r[1], r[2] - 1, r[3]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[2] && d
            .getDate() == r[3]);
    };
    var isHidden=function(node){
            var nodeS=getComputedStyle(node);
            if(node.type=="hidden"||nodeS.display=="none"||nodeS.visibility=="hidden"){
                return true;
            }else{
                var oldCss=node.style.cssText;
                setStyleImportant(node,"height:10px");
                var nodeR=node.getBoundingClientRect();
                node.style.cssText=oldCss;
                if(nodeR.right-nodeR.left==0&&nodeR.bottom-nodeR.top==0){
                    return true;
                }else{
                    return false;
                }
            }
        },
        isOverflow=function(node){
            var nP=node.parentNode,
                check=function(dir,other){
                    var sign={
                        left:"<",
                        right:">",
                        top:"<",
                        bottom:">"
                    };
                    other=other||[];
                    for(var i= 0,l=dir.length;i<l;i++){
                        var m=dir[i];
                        if(eval("nR[m]"+sign[m]+"(other[i]||nPR[m])"))return {by:nP,dir:m};
                    }
                };
            while (true){
                var cs=getComputedStyle(nP),
                    nR=node.getBoundingClientRect(),
                    nPR=nP.getBoundingClientRect();
                if(cs.overflow=="hidden"||nP==document.body){
                    var checkResult=check(["left","right","top","bottom"],nP==document.body?[0,document.documentElement.clientWidth,0]:null);
                    if(checkResult)return checkResult;
                    break;
                }
                if(cs.overflowX=="hidden"){
                    checkResult=check(["left","right"]);
                    if(checkResult)return checkResult;
                }
                if(cs.overflowY=="hidden"){
                    checkResult=check(["top","bottom"]);
                    if(checkResult)return checkResult;
                }
                nP=nP.parentNode;
            }
            return false;
        },
        setStyleImportant=function(node,cssText){
            var style=cssText.split(";");
            for(var i=0,l=style.length;i<l;i++){
                node.style.cssText+=";"+style[i]+" !important";
            }
        };
    //校验代码
    var errorNum = 0;
    var iptType=["INPUT","TEXTAREA","SELECT"];
    var getIptWrapper=function(target){
            var tPare=target.parentNode,vMyWrapper;
            if((vMyWrapper=target.getAttribute("vMyWrapper"),vMyWrapper)&&(vMyWrapper=document.getElementById(vMyWrapper),vMyWrapper)){
                return vMyWrapper;
            }else if(tPare.className.indexOf("vic")!=-1||tPare.getAttribute("vIptWrapper")=="true"){
                return tPare;
            }else {
                return target;
            }
        },getOffset=function(n1,n2){
            var nr1=n1.getBoundingClientRect(),
                nr2=n2.getBoundingClientRect();
            return {
                left:nr1.left-nr2.left,
                top:nr1.top-nr2.top
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
        getTextRect=new function(){
            this.main=function(node,os){
                var spanHtml=node.value||node.placeholder;
                if(spanHtml!=""){
                    var spanTmp=this.spanTmp;
                    if(!spanTmp){
                        spanTmp=document.createElement("validnode");
                        this.spanTmp=spanTmp;
                    }
                    setStyleImportant(spanTmp,"font-size:"+os.fontSize+
                        ";font-family:"+os.fontFamily+
                        ";padding:0;visibility:hidden;white-space:nowrap;position:absolute;width:auto;height:auto;line-height:normal");
                    spanTmp.innerHTML=spanHtml;
                    node.parentNode.appendChild(spanTmp);
                    var sr=spanTmp.getBoundingClientRect(),
                        nr=node.getBoundingClientRect();
                    node.parentNode.removeChild(spanTmp);
                    var h=sr.bottom-sr.top;
                    return {
                        h:h,
                        w:sr.right-sr.left,
                        t:(nr.bottom-nr.top-h)/2-toInt(os.paddingTop),
                    }
                }else{
                    return {h:0,w:0,t:0}
                }
            };
        }(),
        toInt=function(s){
            var rValue=parseInt(s);
            if(isNaN(rValue))rValue=0;
            return rValue;
        },
        fixedTip=function(target,tipNode){
            var zIndex=target.getAttribute("vpopzindex");
            if(zIndex)setStyleImportant(tipNode,"z-index:"+zIndex);
            var setTipNodeRect=function(target_pop){
                if(!target_pop){
                    var iptWrapper=getIptWrapper(target),
                        ih1=isHidden(target),
                        ih2=isHidden(iptWrapper),
                        isFirst=true;
                    if(ih1&&ih2){
                        console.log("The tip cannot be displayed on a hidden target");
                        return;
                    }else if(ih1||(!ih2&&iptType.indexOf(iptWrapper.tagName)!=-1)){
                        target_pop=iptWrapper;
                    }else{
                        target_pop=target;
                    }
                }
                var mySuperWrapper=createWrapper(target_pop.parentNode);
                mySuperWrapper.appendChild(tipNode);
                var os=getComputedStyle(target_pop),
                    dw=function(obj){
                        var mySuperWrapper=obj.parentNode.mySuperWrapper,
                            offset=getOffset(obj,obj.parentNode),
                            tipNodeRect=tipNode.getBoundingClientRect();
                            bdw={
                                l:offset.left+toInt(os.paddingLeft),
                                t:offset.top-tipNodeRect.bottom+tipNodeRect.top-5+toInt(os.paddingTop)
                            };
                        if(os.position!="fixed"){
                            offset=getOffset(mySuperWrapper,mySuperWrapper.parentNode);
                            bdw={
                                l:bdw.l-offset.left,
                                t:bdw.t-offset.top
                            }
                        }
                        bdw.bl=bdw.l;
                        if(iptType.indexOf(obj.tagName)==-1){
                            bdw.sl=0;
                        }else{
                            var textRect=getTextRect.main(obj,os),
                                sl=toInt(os.paddingLeft)+toInt(os.borderLeftWidth)+textRect.w;
                            bdw={
                                l:bdw.l+sl- 0.5*(tipNodeRect.right-tipNodeRect.left),
                                t:bdw.t+textRect.t,
                                sl:sl,
                                bl:bdw.bl
                            }
                        }
                        return bdw;
                    }(target_pop);
                var tipNodeSquare=tipNode.tipNodeSquare;
                setStyleImportant(tipNodeSquare,"left: 0;right: 0;margin: auto");
                setStyleImportant(tipNode,"left:"+ dw.l+"px"+
                    ";top:"+dw.t+"px");
                var rs=isOverflow(tipNode);
                if(rs){
                    if(rs.dir=="left"||rs.dir=="right"){
                        if(dw.l!=dw.bl){
                            setStyleImportant(tipNode,"left:"+dw.bl);
                            if(isOverflow(tipNode)){
                                if(isFirst){
                                    setTipNodeRect(iptWrapper);
                                }else{
                                    console.log("0检测到错误提示被如下节点遮住,且无法被自动修复,请检查样式");
                                    console.log(rs.by);
                                }
                            }
                        }else if(isFirst){
                            setTipNodeRect(iptWrapper);
                        }else{
                            console.log("1检测到错误提示被如下节点遮住,且无法被自动修复,请检查样式");
                            console.log(rs.by);
                        }
                    }else if(isFirst){
                        setTipNodeRect(iptWrapper);
                    }else{
                        console.log("2检测到错误提示被如下节点遮住,且无法被自动修复,请检查样式");
                        console.log(rs.by);
                    }
                }
            };
            seajs.use("seajs-css",function(){
                seajs.use(assetsUrl+"css/seajs-validate.css",function(){
                    setTipNodeRect();
                });
            });
        };
    var prototypes={
        "showErrorTip":function (tip,focusOnError) {
            if(this.onIpt!=null)return;
            tip=tip||this.getAttribute("errorTip");
            var that=this,
                tip_pop_error,
                iptWrapper=getIptWrapper(that);
            errorNum++;
            //生成红边框错误提示
            if(that.getAttribute("noBorder")!="true"&&that.getAttribute("noErrorBorder")!="true"){
                var targetRect=iptWrapper.getBoundingClientRect();
                var w1=targetRect.right-targetRect.left,
                    h1=targetRect.bottom-targetRect.top;
                var oldCss=iptWrapper.style.cssText;
                setStyleImportant(iptWrapper,"border:1px solid red");
                targetRect=iptWrapper.getBoundingClientRect();
                var w2=targetRect.right-targetRect.left,
                    h2=targetRect.bottom-targetRect.top;
                if(w2!=w1||h2!=h1){
                    setStyleImportant(iptWrapper,"width:"+(w1+3)+"px");
                }
                that.targetForErrorTip=iptWrapper;
            }
            //生成浮动错误提示
            that.tipTxt=tip;
            if(that.getAttribute("noErrorTip")!="true") {
                tip_pop_error=that.tip_pop_error;
                if(!tip_pop_error){
                    tip_pop_error = document.createElement("validnode");
                    tip_pop_error.className = "vtip-pop-error";
                    var tipNodeSquare=document.createElement("validnode");
                    tipNodeSquare.className="vtip-pop-square";
                    tip_pop_error.tipNodeSquare=tipNodeSquare;
                    that.tip_pop_error=tip_pop_error;
                }
                tip_pop_error.innerHTML = tip;
                tip_pop_error.appendChild(tip_pop_error.tipNodeSquare);
                fixedTip(that,tip_pop_error);
                //插入自定义操作
                if(that.afterShowErrorTip)that.afterShowErrorTip();
            }
            //再次输入清除提示
            var bindType=(that.type=="checkbox"?"change":"input");
            var clearTip = function () {
                that.onIpt=function(){
                    if(tip_pop_error)tip_pop_error.parentNode.removeChild(tip_pop_error);
                    if(that.getAttribute("noBorder")!="true"){
                        iptWrapper.style.cssText=oldCss;
                        if(that.styleAfterError){
                            for(var o in that.styleAfterError){
                                if(that.styleAfterError.hasOwnProperty(o)){
                                    that.style[o]=that.styleAfterError[o];
                                }
                            }
                            that.styleAfterError=null;
                        }
                    }
                    //检测是否已经清除所有错误判断是否释放按钮
                    if (--errorNum == 0) {
                        //btn.style.backgroundColor=btnBacCl;
                        //btn.onclick=btnFuc;
                    }
                    that.removeEventListener(bindType, that.onIpt);
                    delete that.onIpt;
                    delete that.tipTxt;
                    if(that.afterClearErrorTip)that.afterClearErrorTip();
                };
                return that.onIpt;
            };
            that.addEventListener(bindType, clearTip());
            if((focusOnError==null||focusOnError==true)&&that.getAttribute("focusOnError")!="false"){
                setTimeout(function(){
                    that.focus();
                },0);
            }
        },
        "validMe":function (onlyValide) {
            var tip;var that=this;
            var iptValue = that.value;
            //取提示信息
            var getErrorTip = function (txt) {
                    var errorTip = that.getAttribute("errorTip");
                    if (errorTip != null) {
                        return errorTip;
                    } else {
                        return txt;
                    }
                },
            //校验是否已经清除上次错误
                checkFirst=function(){
                    tip=that.tipTxt;
                    return (tip == null);
                },
            //h5原生校验
                checkValidity=function(){
                    if(that.validity&&that.validity.badInput){
                        tip=getErrorTip("请输入合法字符");
                    }
                    return (tip == null);
                },
            //校验数字的函数
                checkNum = function () {
                    if (isNaN(iptValue)){
                        tip = getErrorTip("该输入框仅接受数字");
                    } else {
                        if (that.getAttribute("firstZero") == "false" && iptValue.substring(0, 1) == "0" && iptValue.substring(0, 2) != "0.") {
                            tip = getErrorTip("首位不可为零!");
                        }
                        var maxNum = that.getAttribute("maxNum");
                        if (maxNum != null) {
                            if(maxNum.indexOf("!")!=-1){
                                maxNum=maxNum.replace("!","")/1;
                                if(iptValue/1>=maxNum){
                                    tip = getErrorTip("该输入框内容应小于" + maxNum);
                                }
                            }else if(iptValue/1 > maxNum){
                                tip = getErrorTip("该输入框内容不能大于" + maxNum);
                            }
                        }
                        if(tip!=null)return false;
                        var minNum = that.getAttribute("minNum");
                        if (minNum != null&&tip==null) {
                            if(minNum.indexOf("!")!=-1){
                                minNum=minNum.replace("!","")/1;
                                if(iptValue/1<=minNum){
                                    tip = getErrorTip("该输入框内容应大于" + minNum);
                                }
                            }else if(iptValue/1 < minNum){
                                tip = getErrorTip("该输入框内容不能小于" + minNum);
                            }
                        }
                    }
                    return (tip == null);
                },
            //为空情况+isEmpty检测
                checkIsEmpty=function(){
                    if (that.getAttribute("noSpace")=="true") {
                        iptValue = iptValue.replace(/\s+/g, "");
                    }
                    var isEmpty = that.getAttribute("isEmpty");
                    return ((isEmpty||that.getAttribute("minLength")=="0") && (iptValue.length == 0||that.tagName=="SELECT"));
                },
            //长度判断
                checkLength = function () {
                    var maxLength = that.getAttribute("maxLength");
                    var minLength = that.getAttribute("minLength");
                    if(that.tagName=="SELECT"){
                        if(iptValue.replace(/\s+/g, "").indexOf("请选择")!=-1)tip = getErrorTip("尚未选择任何项");
                    }else{
                        var iptValue_length=iptValue.length;
                        if(that.getAttribute("isByte")=="true"){
                            iptValue_length=iptValue.replace(/[^\x00-\xff]/g, 'xx').length;
                        }
                        if (iptValue_length == 0) {
                            tip = getErrorTip("该输入框内容不能为空");
                        }else if (minLength != null && iptValue_length < minLength / 1) {
                            tip = getErrorTip("该输入框内容不能少于" + minLength + "位");
                        }else if (maxLength != null) {
                            if(that.getAttribute("isByte")=="true"){
                                var byteL=that.value.replace(/[^\x00-\xff]/g, 'xx').length;
                                if(byteL>maxLength/1){
                                    tip = getErrorTip("已超出"+(byteL-maxLength)+"个字节");
                                }
                            }else if(that.length>maxLength/1){
                                tip = getErrorTip("已超出"+(that.length-maxLength)+"个字");
                            }
                        }
                    }
                    return (tip == null);
                },
            //类型判断
                checkType = function () {
                    switch (that.getAttribute("validType")) {
                        case "num":
                        case "float":
                            var floatLength = that.getAttribute("floatLength");
                            if (checkNum() && floatLength != null && iptValue.indexOf(".") != -1 && iptValue.split(".")[1].length > floatLength) {
                                tip = getErrorTip("该输入框的小数位不能超过" + floatLength + "位");
                            }
                            break;
                        case "bankCard":
                            var isbankCard = true;
                        case "int":
                            if (checkNum() && iptValue.indexOf(".") != -1) {
                                if (isbankCard) {
                                    tip = getErrorTip("请输入正确的银行卡号!");
                                } else {
                                    tip = getErrorTip("该输入框仅接受整数!");
                                }
                            }else if(isbankCard&&!checkBankCard(iptValue)){
                                tip= getErrorTip("请输入正确的银行卡号!");
                            }
                            break;
                        case "phoneNum":
                            //var reg = /^1\d{10}$|^\+\d{2}1\d{10}$/;
                            var reg = /^1\d{10}$/;
                            if (!reg.test(iptValue)) {
                                tip = getErrorTip("请输入正确的手机号!");
                            }
                            break;
                        case "idCard":
                            var clsIDCard2 = new clsIDCard(iptValue);
                            if (!clsIDCard2.IsValid()) {
                                tip = getErrorTip("请输入正确的身份证号!");
                            }
                            break;
                    }
                    return (tip == null);
                },
                checkBankCard=function(cardNo){
                    var tmp=true,total=0;
                    for(var i=cardNo.length;i>0;i--){
                        var num=cardNo.substring(i,i-1);
                        if(tmp=!tmp,tmp)num=num*2;
                        var gw=num%10;
                        total+=(gw+(num-gw)/10);
                    }
                    return total%10==0;
                };
            var isok=true;
            if(!checkIsEmpty()){
                if(that.type!="checkbox"&&that.type!="file")isok=(checkFirst() && checkValidity() && checkLength() && checkType());
                if(isok){
                    if(that.myValid){
                        tip=that.myValid();
                        isok=isok&&(tip==null);
                    }
                }
            }
            if (onlyValide == null || onlyValide) {
                return isok;
            } else {
                return {"isok":isok, "tip": tip};
            }
        },
        "setVal": function(ss){
            this.value=ss;
            if(this.onIpt)this.onIpt();
        },
        "setHTML":function(ss){
            this.innerHTML=ss;
            if(this.onIpt)this.onIpt();
        },
        "addIptEvt":function(fuc){
            if(this.IptEvt){
                this.IptEvt.push(fuc);
            }else{
                this.IptEvt=[fuc];
            }
        },
        "removeIptEvt":function(fuc){
            if(this.IptEvt){
                this.IptEvt.splice(this.IptEvt.indexOf(fuc),1);
            }
        },
        "setStyleAfterError":function(style){
            if(!this.styleAfterError)this.styleAfterError={};
            for(var o in style){
                if(style.hasOwnProperty(o)){
                    this.styleAfterError[o]=style[o];
                    this.style[o]=style[o];
                }
            }
        },
        "myBlur":function(){
            this.ignoreOnce=true;
            this.blur();
        }
    }
    for(var m in prototypes){
        if(prototypes.hasOwnProperty(m)){
            var fuc=prototypes[m];
            HTMLInputElement.prototype[m] = fuc;
            HTMLTextAreaElement.prototype[m] = fuc;
            HTMLSelectElement.prototype[m] = fuc;
        }
    }
    //为所有的form增加校验功能
    HTMLFormElement.prototype.validMe=function(){
        var isok = true;
        for(var k=0;k<iptType.length;k++){
            var ipt = this.getElementsByTagName(iptType[k]);
            for (var i = 0; i < ipt.length; i++) {
                if (!ipt[i].getAttribute("forceValid")&&isHidden(ipt[i])){
                    continue;
                }
                var validResult = ipt[i].validMe(false);
                if (!validResult.isok) {
                    ipt[i].showErrorTip(validResult.tip,isok);
                    isok = false;
                }
            }
        }
        return isok;
    };
    //为表单元素添加全局监听
    var superBind=function(eType,fuc){
        document.addEventListener(eType,function(e){
            var target= e.srcElement|| e.target;
            for(var i=0;i<iptType.length;i++){
                if(target.tagName==iptType[i]){
                    if(!isHidden(target)){
                        fuc(target);
                    }
                    return;
                }
            }
        })
    };
    var validFuc=function(){
        if(!this.ignoreOnce){
            var validResult=this.validMe(false);
            if(!validResult.isok){
                this.showErrorTip(validResult.tip);
            }
        }else{
            this.ignoreOnce=false;
        }
        this.removeEventListener("blur",validFuc);
    };
    //这里扩展一些特殊的输入类型 比如银行卡 手机号
    var tipNode;
    var removeTip=function(){
        var tipPare;
        if(tipNode&&(tipPare=tipNode.parentNode,tipPare)){
            tipPare.removeChild(tipNode);
        }
        this.removeEventListener("blur",removeTip);
    };
    var specialIptFuc=function(){
        if(this.onIpt!=null)return;
        var specialTip="";
        var attr=this.getAttribute("validType");
        if(attr=="bankCard"){
            specialTip=this.value.replace(/\D/g,'').replace(/....(?!$)/g,'$&-');
        }else if(attr=="phoneNum"){
            specialTip=this.value.replace(/ /g,"");
            specialTip=specialTip.replace(/(^\+\d{2})(1\d{2})?(\d{4})?(\d{4})?|(^1\d{2})(\d{4})?(\d{4})?/,function(){
                var $=arguments,rs="",i=5,l=8;
                if($[1]){
                    i=1;l=5
                }
                for(i;i<l;i++){
                    if($[i]){
                        rs+=($[i]+"-");
                    }else{
                        break;
                    }
                }
                if(i==l){
                    rs=rs.substring(0,rs.length-1);
                }
                return rs;
            });
        }
        if(specialTip!=""){
            if(!tipNode){
                tipNode=document.createElement("validnode");
                tipNode.className="vtip-pop";
                var tipNodeSquare=document.createElement("validnode");
                tipNodeSquare.className="vtip-pop-square";
                tipNode.tipNodeSquare=tipNodeSquare;
            }
            this.addEventListener("focus",specialIptFuc);
            tipNode.innerHTML=specialTip;
            tipNode.appendChild(tipNode.tipNodeSquare);
            fixedTip(this,tipNode);
            this.focus();
            this.addEventListener("blur",removeTip);
        }else{
            removeTip.call(this);
        }
    };
    superBind("input",function(target){
        specialIptFuc.call(target);
        target.addEventListener("blur",validFuc);
        if(target.IptEvt){
            target.IptEvt.forEach(function(m){
                m();
            })
        }
    });
    exports.newInstance = function () {
        return exports;
    };
});
