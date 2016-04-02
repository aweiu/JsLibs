/**
 * Created by awei on 15/8/21.
 */
define(function (require, exports, module) {
    exports.int=function(config){
        var h = 50;
        var switchButton = document.createElement("switchButton");
        switchButton.style.cssText="display:block;height:"+h+"px;background-color:white;";
        var switchButton_txt = document.createElement("switchButton");
        switchButton_txt.style.cssText="font-size:16px;color:#333;margin-left:15px;line-height:"+h + "px;";
        switchButton_txt.innerHTML = config.name;
        switchButton.appendChild(switchButton_txt);
        var switchButton_btn = document.createElement("switchButton");
        var s_b_h = (h / 1.5);
        var s_b_w = 75 * s_b_h / 44;
        switchButton_btn.style.cssText="background-color:white;float:right;border-radius:23px;position:relative;transition:background-color 0.2s ease-in 0s;height:"+s_b_h + "px;width:"+s_b_w + "px;margin:"+(h - s_b_h) / 2 + "px" + " 15px 0px 0px;";        
        var switchButton_btn_circle = document.createElement("switchButton");
        switchButton_btn_circle.style.cssText="background-color:white;border-radius:50%;transition:left 0.2s ease-in 0s;position:absolute;left:0px;border:1px solid #e1e1e1;";
        switchButton_btn.appendChild(switchButton_btn_circle);
        var change = ["0px", (s_b_w - s_b_h + 2) + "px", "white", "#79d787", config.onChange, "1px solid #e1e1e1", "none"],isOn=config.isOn;
        var changeState=function(){
            isOn = !isOn;
            switchButton_btn_circle.style.left = change[isOn / 1];
            switchButton_btn.style.backgroundColor = change[isOn / 1 + 2];
            switchButton_btn_circle.style.height = (s_b_h - isOn * 2) + "px";
            switchButton_btn_circle.style.width = (s_b_h - isOn * 2) + "px";
            switchButton_btn.style.border = change[isOn / 1 + 5];
        }
        switchButton_btn.onmousedown = function () {
            changeState();
            var fuc=change[4];
            if(fuc)fuc(isOn);
        }
        switchButton.appendChild(switchButton_btn);
        config.parentNode.appendChild(switchButton);
        isOn = !isOn;changeState();
    }
    exports.newInstance = function (fuc) {
        return function () {
            fuc += "";
            if (fuc.indexOf("\nexports=this;") == -1) {
                fuc = ("0,(" + fuc + ")").replace("{", "{\nexports=this;");
            }
            return new (eval(fuc))(require,exports,module);
        }
    }(arguments.callee);
})