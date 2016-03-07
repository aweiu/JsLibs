/**
 * Created by awei on 2015/7/29.
 */
define(function (require, exports, module) {
    var myValid = require("seajs-validate");
    var httpClient=require("seajs-httpClient");
    var waiting=require("seajs-waiting");
    var actions={};
    var disBtn={
        map:{},
        disable:function(form,btn){
            btn.disabled="true";
            if(this.map[form]){
                this.map[form].push(btn);
            }else{
                this.map[form]=[btn];
            }
        },
        enable:function(form){
            var btns=this.map[form];
            if(btns){
                for(var i= 0,l=btns.length;i<l;i++){
                    btns[i].removeAttribute("disabled");
                }
                this.map[form]=null;
            }
        }
    };
    var subFuc=function (e,target) {
        if(target.getAttribute("actionName") != null){
            try{
                if (target.validMe()&&(!target.myValid||target.myValid())) {
                    var data = exports.getFormData(target);
                    if (data != "") {
                        var url = target.getAttribute("action");
                        var actionName=target.getAttribute("actionName");
                        if (url != null) {
                            httpClient.post(url, data, function(rs,txt){
                                if(rs=="enableBtn"){
                                    disBtn.enable(target);
                                    return;
                                }
                                if(rs.code!=0||target.getAttribute("canReSubmit")=="true")disBtn.enable(target);
                                if(actions[actionName]){
                                    actions[actionName](rs,txt);
                                }else{
                                    if(exports.onFormResult)exports.onFormResult(rs, actionName,txt);
                                }
                            });
                        } else {
                            alert("该表单尚未设置提交地址,请检查!");
                        }
                    } else {
                        alert("该表单尚未绑定任何字段,请检查!");
                    }
                }else{
                    disBtn.enable(target);
                }
            }catch(error){
                //console.log(error);
            }finally{
                e.preventDefault();
                e.returnValue = false;
            }
        }else{
            disBtn.enable(target);
            if(!target.validMe()||(target.myValid&&!target.myValid())){
                e.preventDefault();
                e.returnValue = false;
            }else{
                waiting.show();
            }
        }
    };
    document.addEventListener("click", function (e) {
        var target= e.srcElement|| e.target;
        if(target.type=="submit"){
            var form=target.form;
            if(form){
                disBtn.disable(form,target);
                subFuc(e,form);
            }
        }
    });
    document.addEventListener("keydown",function(e){
        if(e.keyCode==13) {
            var target = e.srcElement || e.target;
            var form=target.form;
            if (form) {
                var enterTo = form.getAttribute("enterTo");
                if (enterTo != null) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.returnValue = false;
                    var tmp = document.getElementById(enterTo);
                    if (tmp) {
                        setTimeout(function () {
                            tmp.click();
                        }, 0);
                    }
                }else{
                    subFuc(e,form);
                }
            }
        }
    });
    HTMLFormElement.prototype.mySubmit=function(onlySubmit){
        if(window.event&&window.event.type=="click"){
            var btn=window.event.srcElement || window.event.target;
            if(btn.tagName=="BUTTON"){
                disBtn.disable(this,btn);
            }
        }
        if(onlySubmit){
            waiting.show();
            this.submit();
            return;
        }
        if(!this.subBtn){
            this.subBtn=document.createElement("button");
            this.subBtn.style.display="none";
            this.appendChild(this.subBtn);
        }
        this.subBtn.click();
    };
    exports.addActionResult=function(actionName,fuc){
        actions[actionName]=fuc;
    };
    exports.getFormData=function(frm){
        var data = "";
        var iptType = ["input", "textarea", "select"];
        for (var j = 0; j < iptType.length; j++) {
            var ipts = frm.getElementsByTagName(iptType[j]);
            for (var k = 0; k < ipts.length; k++) {
                if(ipts[k].type=="radio"&&!ipts[k].checked)continue;
                if (ipts[k].name != "") {
                    data += ipts[k].name + "=" + ipts[k].value + "&";
                }
            }
        }
        return data;
    }
    exports.newInstance=function(){
        return exports;
    }
});