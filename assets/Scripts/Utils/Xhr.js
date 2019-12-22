
import { serverUrl, version,whichSource ,PLATFORM,XCX_VERSION } from "./Config";

var Xhr = {
    getXhr: function (option) {
        var that = this;
        // this.platformApi = getPlatformApi();

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", serverUrl + option.url, true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.timeout = 15000;
        xhr.onreadystatechange = function () {

            /*
            * xhr.readyState
            * 0: 请求未初始化
            * 1: 服务器连接已建立
            * 2: 请求已接收
            * 3: 请求处理中
            * 4: 请求已完成，且响应已就绪
            * 
            */
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // var res = xhr.responseText != "" ? JSON.parse(xhr.responseText) : "";
                    var res = xhr.responseText != "" ? xhr.responseText : "";
                    // console.log('xhr response', xhr.responseText);
                    // console.log('xhr response',res,"ddddddd");

                    // typeof option.succ === 'function' && option.succ(JSON.stringify(res));
                    typeof option.succ === 'function' && option.succ(res);
                } else {
                    console.log("xhr.status !== 200")
                    typeof option.fail === 'function' && option.fail(xhr.responseText);
                }
            }
        };
        xhr.ontimeout = function (e) {
            console.log('xhr ontimeout');
            typeof option.fail === 'function' && option.fail('请求连接超时，请检查当前网络');
        };
        xhr.onerror = function (e) {
            console.log('xhr onerror');
            typeof option.fail === 'function' && option.fail('请求连接失败，请检查当前网络');
        };
        xhr.send(option.params);

        console.log("XHR:" + (serverUrl + option.url));
        console.log("XHR PARAMS: " + JSON.stringify(option.params));
    },

    getCommonParams() {
        // var visitorId = (typeof GameUserInfo != 'undefined' && GameUserInfo != null && typeof GameUserInfo.visitor_id != 'undefined') ? GameUserInfo.visitor_id : "";
        return { platform: PLATFORM};
        //openid: typeof GameUserInfo.openid != 'undefined' ? GameUserInfo.openid : "", version: version,
    },

    getOtherXhr: function (option) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", option.url, true);
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.timeout = 10000;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    typeof option.succ === 'function' && option.succ(xhr.responseText != "" ? JSON.parse(xhr.responseText) : "");
                } else {
                    typeof option.fail === 'function' && option.fail(xhr.responseText);
                }
            }
        };
        xhr.ontimeout = function (e) {
            typeof option.fail === 'function' && option.fail('请求连接超时，请检查当前网络');
        };
        xhr.onerror = function (e) {
            typeof option.fail === 'function' && option.fail('请求连接失败，请检查当前网络');
        };
        xhr.send();
    },

    
}

export default Xhr;