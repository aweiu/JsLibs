function PlaceHolder(){
    var fixPlaceHolder=function(obj){
        var os=window.getComputedStyle(obj),
            dw=function(){
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
            }(),
            or=obj.getBoundingClientRect(),
            h=or.bottom-or.top;
        obj.myPlaceHolder.style.cssText="color:#aca899;white-space:nowrap;width:auto;text-align:left;font-weight:normal;position:absolute;"+
            ";font-family:"+os.fontFamily+
            ";font-size:"+ os.fontSize+";"+
            ";padding-left:"+os.paddingLeft+
            ";padding-top:"+os.paddingTop+
            ";padding-bottom:"+os.paddingBottom+
            ";border-top-width:"+os.borderTopWidth+
            ";border-bottom-width:"+os.borderBottomWidth+
            ";border-left-width:"+os.borderLeftWidth+
            ";line-height:"+(isNaN(parseInt(os.lineHeight))?(h+"px"):os.lineHeight)+
            ";text-indent:"+os.textIndent+
            ";left:"+ dw.l+"px"+
            ";top:"+dw.t+"px"+
            ";height:"+(or.bottom-or.top)+"px";
        obj.myPlaceHolder.innerHTML=obj.getAttribute("placeholder");
    },
    getOffset=function(n1,n2){
        var nr1=n1.getBoundingClientRect(),
            nr2=n2.getBoundingClientRect();
        return {
            left:nr1.left-nr2.left,
            top:nr1.top-nr2.top
        }
    },
    canClear=function(node){
        var nodeS=getComputedStyle(node);
        if(node.value!=""||!node.getAttribute("placeholder")||node.type=="hidden"||nodeS.display=="none"||nodeS.visibility=="hidden"){
            return true;
        }else{
            var oldCss=node.style.cssText;
            node.style.height="10px";
            var nodeR=node.getBoundingClientRect();
            node.style.cssText=oldCss;
            if(nodeR.right-nodeR.left==0&&nodeR.bottom-nodeR.top==0){
                return true;
            }else{
                return false;
            }
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
    };
    HTMLInputElement.prototype.addPlaceHolder=function(){
        var txt=this.getAttribute("placeholder");
        if(txt){
            var that=this;
            if(this.myPlaceHolder){
                this.myPlaceHolder.innerHTML=txt;
                fixPlaceHolder(this);
                return;
            }
            var clearPlaceHolder=function(){
                that.myPlaceHolder.style.display="none";
            };
            this.myPlaceHolder=document.createElement("placeholdernode");
            this.myPlaceHolder.setAttribute("notTipNext","true");
            this.myPlaceHolder.style.cssText="display:none;position:absolute;";
            var t_ps=getComputedStyle(this).position;
            if(t_ps=="absolute"||t_ps=="fixed"){
                this.parentNode.insertBefore(this.myPlaceHolder,this.nextSibling);
            }else{
                var mySuperWrapper=createWrapper(this.parentNode);
                mySuperWrapper.appendChild(this.myPlaceHolder);
            }
            var blurFuc=function(){
                if(!canClear(that)){
                    that.myPlaceHolder.style.display="block";
                    fixPlaceHolder(that);
                }
            };
            this.addEventListener("blur", blurFuc);
            var iptFuc=function(){
                if(that.value==""){
                    blurFuc();
                }else{
                    clearPlaceHolder();
                }
            };
            this.addEventListener("propertychange",function(e){
                if(e.propertyName=="value")iptFuc();
            });
            this.addEventListener("focus",iptFuc);
            this.myPlaceHolder.addEventListener("mousedown",function(){
                that.focus();
            });
            blurFuc();
        }
    };
    HTMLInputElement.prototype.removePlaceHolder=function(){
        if(this.myPlaceHolder){
            this.parentNode.mySuperWrapper.removeChild(this.myPlaceHolder);
            delete this.myPlaceHolder;
        }
    };
    HTMLTextAreaElement.prototype.addPlaceHolder=HTMLInputElement.prototype.addPlaceHolder;
    this.main=function(wrapper){
        ["input","textarea"].forEach(function(m){
            var ipts=wrapper.getElementsByTagName(m);
            for(var i= 0,l=ipts.length;i<l;i++){
                ipts[i].addPlaceHolder();
            }
        });
    }
}
var myPlaceHolder=new PlaceHolder();
window.addEventListener("load",function(){
    myPlaceHolder.main(document);
});