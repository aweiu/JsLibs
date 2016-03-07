define(function (require, exports, module) {
    var assetsUrl=module.uri;
    assetsUrl=assetsUrl.substring(0,assetsUrl.lastIndexOf("/js/"))+"/";
	var modal=require("seajs-modal-common").newInstance();
	var div=document.createElement("div");
	div.style.cssText="text-align: center;overflow:hidden";
	var img=document.createElement("img");
	img.width=50;img.height=57;
	img.src=assetsUrl+"imgs/seajs-common-tip-success.png";
	var tip_txt=document.createElement("div");
	tip_txt.style.cssText="margin-top:20px;color:#333333;font-size:18px;";
	div.appendChild(img);
	div.appendChild(tip_txt);
	modal.int({
		hasBac:false,
		content:div,
		padding:"50px 60px",
		hideOnClickOut:true,
		hasShadow:true,
		autoHide:true,
        canClickOut:true
	});
	exports.show=function(txt,isSuccess){
		tip_txt.innerHTML=txt;
		img.src=assetsUrl+"imgs/seajs-common-tip-success.png";
		if(isSuccess===false){
			img.src=assetsUrl+"imgs/seajs-common-tip-fail.png";
		}
		modal.show();
	};
    exports.newInstance = function () {
        return exports;
    };
})