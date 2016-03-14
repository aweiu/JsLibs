/**
 * Created by awei on 2015/7/29.
 */
define(function (require, exports, module) {
    var myValid = require("seajs-validate");
    var httpClient=require("seajs-httpClient");
    var waiting=require("seajs-waiting");
    var actions={},
        disForm=function(e){
            e.preventDefault();
            e.stopPropagation();
            e.returnValue = false;
        },
        formCtrl=new function(){
            this.enable=function(form){
                form.disabled=false;
            },
            this.disable=function(form,e){
                if(!form.hasOwnProperty("lastAction"))form.lastAction=form.action;
                if(form.lastAction==form.action){
                    if(form.disabled===true){
                        disForm(e);
                        return true;
                    }
                }else{
                    form.lastAction=form.action;
                }
                return false;
            } 
        }(),
        subFuc=function (e,target) {
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
                                        formCtrl.enable(target);
                                        return;
                                    }
                                    if(rs.code!=0||target.getAttribute("canReSubmit")=="true")formCtrl.enable(target);
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
                        formCtrl.enable(target);
                    }
                }catch(error){
                    //console.log(error);
                }finally{
                    disForm(e);
                }
            }else{
                formCtrl.enable(target);
                if(!target.validMe()||(target.myValid&&!target.myValid())){
                    disForm(e);
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
                if(formCtrl.disable(form,e))return;
                form.disabled=true;
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
                    var tmp = document.getElementById(enterTo);
                    if (tmp) {
                        disForm(e);
                        setTimeout(function () {
                            tmp.click();
                        }, 0);
                    }
                }else{
                    if(formCtrl.disable(form,e))return;
                    form.disabled=true;
                    subFuc(e,form);
                }
            }
        }
    });
    HTMLFormElement.prototype.mySubmit=function(onlySubmit){
        if(window.event&&window.event.type=="click"){
            var btn=window.event.srcElement || window.event.target;
            if(btn.tagName=="BUTTON"){
                form.disabled=true;
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
        for (var j = 0,l=iptType.length; j <l ; j++) {
            var ipts = frm.getElementsByTagName(iptType[j]);
            for (var k = 0,m=ipts.length; k < m; k++) {
                var ipt=ipts[k];
                if(ipt.type=="radio"&&!ipt.checked)continue;
                if (ipt.name != "") {
                    data += ipt.name + "=" + ipt.value + "&";
                }
            }
        }
        return data.substring(0,data.length-1);
    }
    exports.newInstance=function(){
        return exports;
    }
});