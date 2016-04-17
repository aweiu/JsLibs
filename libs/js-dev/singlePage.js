(function(){
var scripts=document.scripts,
	scriptsDo=function(fuc){
		for (var i = scripts.length, script; script = scripts[--i]; ) {
			var tmp=fuc(script);
			if(tmp)return tmp;
        }
	},
	currentScript=function() {
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        if (document.currentScript){
			return document.currentScript.src;
		}
        var stack;
        try {
            a.b.c() //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack
            if (!stack && window.opera) {
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop() //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, "") //去掉行号与或许存在的出错字符起始位置
        }
        return scriptsDo(function(s){
        	if(s.readyState === 'interactive')return s.src;
        });
    }(),
    removeScripts=function(isAll){
		scriptsDo(function(s){
			if(isAll||s.src === currentScript){
				s.parentNode.removeChild(s);
				return !isAll;
			}
		});
	},
    getAsset=function(callBac){
    	var assetUrl=currentScript.substr((currentScript.indexOf("?")+1)||currentScript.length);
    	if(assetUrl!==""){
    		if(history.replaceState){
    			try{
    				window.stop();
    			}catch(e){
    				document.execCommand('stop');
    			}
    		}
    		var http=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
    		http.onreadystatechange=function(){
    			if (this.readyState == 4) {
	                if (this.status == 200) {
	                	if(callBac)callBac(this.responseText);
	                } else{
	                    throw Error("获取资源文件"+assetUrl+"失败!请检查");
	                }
	            }
    		}
			http.open("get",(assetUrl.substr(0,1)=="/"?"":"/")+assetUrl, true);
		    http.setRequestHeader("Content-type", "text/html;charset=utf-8");
		    http.setRequestHeader("X-Requested-With","httpRequest");
		    http.setRequestHeader("If-Modified-Since","0");
		    http.send();
    	}
    },
    myIfr=function(){
		var ifrs=window.parent.document.getElementsByTagName("iframe");
		for(var i=0,l=ifrs.length;i<l;i++){
			if(ifrs[i].contentWindow.document==document)return ifrs[i];
		}
	}(),
	getSubstr=function(s1,s2,isDouble){
		var i1=s1.indexOf("<"+s2+">");
		if(i1==-1){
			return (isDouble?"":getSubstr(s1,s2.toUpperCase(),true));
		}else{
			return s1.substring(i1+s2.length+2,s1.lastIndexOf("</"+s2+">"));
		}
	};
	if(!myIfr){
		getAsset(function(rs){
			if(history.replaceState){
				removeScripts(true);
				var html=document.documentElement.outerHTML;
				var isrc=window.location.href;
				isrc+=(isrc.indexOf("?")==-1?"?":"&")+"singlePage="+new Date().getTime();
				var onload=function(ifr){
					var myWin=ifr.contentWindow;
					ifr.height=Math.max(myWin.document.body.scrollHeight,myWin.document.documentElement.scrollHeight);
					if(!ifr.fsrc){
						ifr.fsrc=ifr.src;
					}else if(ifr.fsrc!=myWin.location.href){
						history.replaceState(null, myWin.document.title, myWin.location.href);
					}else{
						history.replaceState(null, myWin.document.title, ifr.fsrc.substring(0,ifr.fsrc.lastIndexOf("singlePage")-1));
					}
				}
				var ifr="<iframe src='"+isrc+"' width='100%' scrolling='no' frameborder='0' onload='("+onload+")(this)'></iframe>";
				html=html.replace(getSubstr(html,"body"),"\n"+ifr+"\n"+rs);
				document.write(html);
			}else{
				removeScripts();
				html=document.documentElement.outerHTML;
				var lb=getSubstr(html,"body");
				html=html.replace(lb,lb+"\n"+rs);
				document.write(html);
			}
			
		});
	}

})();