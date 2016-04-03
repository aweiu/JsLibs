/**
 * Created by 余阿伟 on 2016/3/21.
 */
define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
    var utils=require("seajs-utils");
    var $ = require("seajs-jquery"), jQuery = $;
    var createWrapper=function(node){
        var mySuperWrapper=node.mySuperWrapper;
        if(!mySuperWrapper){
            mySuperWrapper=document.createElement("mySuperWrapper");
            node.mySuperWrapper=mySuperWrapper;
            mySuperWrapper.style.cssText="position:relative;float:left;";
        }
        node.insertBefore(mySuperWrapper,node.firstChild);
        return mySuperWrapper;
    },getOffset=function(n1,n2){
        var nr1=n1.getBoundingClientRect(),
            nr2=n2.getBoundingClientRect();
        return {
            left:nr1.left-nr2.left,
            top:nr1.top-nr2.top
        }
    };
    exports.bind=function(ipts,config){
        utils.use([
            [assetsUrl+"css/calendar.css","calendar"]
        ],function(){
            if(ipts.tagName)ipts=[ipts];
            for(var i= 0,l=ipts.length;i<l;i++){
                var obj=ipts[i];
                var wrapper=createWrapper(obj.parentNode),
                    calendarNode=document.createElement("calendarNode");
                calendarNode.style.cssText="position:absolute;";
                wrapper.appendChild(calendarNode);
                var os=window.getComputedStyle(obj),
                    getDw=function(os,obj){
                        var mySuperWrapper=obj.parentNode.mySuperWrapper,
                            offset=getOffset(obj,obj.parentNode),
                            rValue={
                                l:offset.left,
                                t:offset.top
                            };
                        if(os.position=="fixed"){
                            return rValue;
                        }else{
                            offset=getOffset(mySuperWrapper,mySuperWrapper.parentNode);
                            return {
                                l:rValue.l-offset.left,
                                t:rValue.t-offset.top
                            }
                        }
                    },
                    dw=getDw(os,obj);
                config=config||{};
                config.trigger=$(obj);
                var onSelected=config.onSelected;
                config.onSelected=function(view, date, value){
                    if(obj.onIpt)obj.onIpt();
                    if(onSelected)onSelected.apply(null,arguments);
                }
                config.date=new Date(config.date||((config.selectedRang&&config.selectedRang.length==2)?config.selectedRang[1]:new Date()));
                $(calendarNode).calendar(config);
                calendarNode.style.cssText+=";left:"+dw.l+"px;top:"+(dw.t+obj.getBoundingClientRect().height)+"px;";
            }
            if(config.canEditYear===false)return;
            $(".calendar-display").on("click",function(e){
                var target= e.srcElement|| e.target,
                    spans=target.getElementsByTagName("span");
                if(spans.length>0){
                    e.stopPropagation();
                    var yearIpt=target.yearIpt;
                    if(!yearIpt){
                        var calendarNode=target.parentNode.parentNode.parentNode.parentNode.parentNode;
                        var wrapper=createWrapper(target.parentNode),
                            yearIpt=document.createElement("input");
                        yearIpt.className="calendar-display";
                        yearIpt.maxLength=4;
                        yearIpt.style.cssText="position:absolute;outline:none;border:0;width:"+(target.getBoundingClientRect().width-spans[0].getBoundingClientRect().width-13)+"px;";
                        yearIpt.addEventListener("blur",function(){
                            var date=new Date();
                            date.setFullYear(this.value);
                            var t=date.getTime();
                            if(!isNaN(t)&&(!config.selectedRang||(t>=new Date(config.selectedRang[0]).getTime()&&t<=new Date(config.selectedRang[1]).getTime()))){
                                $(calendarNode).data('calendar').updateMonthView(this.value);
                            }
                            yearIpt.style.display="none";
                        });
                        wrapper.appendChild(yearIpt);
                        target.yearIpt=yearIpt;
                    }else{
                        yearIpt.style.display="block";
                    }
                    yearIpt.value=target.innerHTML.split("/")[0];
                    setTimeout(function(){
                        yearIpt.focus();
                    },0);
                }
            });
        });
    };
});