import Xhr from "./Xhr";

let Apis = {
    /**
     * 封装公共参数 openid version sourcekey
     * @param  { url:'', params, succ, fail} options 
     */
    request(options) {
        Xhr.getXhr({
            url: options.url,
            params: JSON.stringify(Object.assign(Xhr.getCommonParams(), options.params)), //传输的 参数 转换成json格式
            succ: function(res) {
                console.log(res,"api------------dddddddddd")
                var res = JSON.parse(res);   //FIXME:12.13 接收数据直接转json
                if (res.state === 1) {
                    typeof options.succ === "function" && options.succ(res);
                } else {
                    console.log("Api request callback (fail) because res.state !== 1")      //FIXME:测试12.12日
                    typeof options.fail === "function" && options.fail(res);
                }
            },
            fail: function(res) {
                
                typeof options.fail === "function" && options.fail(res);
            }
        });
    }
}

export default Apis;



// let Apis = {
//     /**
//      * 封装公共参数 openid version sourcekey
//      * @param  { url:'', params, succ, fail} options 
//      */
//     request(options) {
//         options.url = options.url;
//         var param = Object.assign(Xhr.getCommonParams(), options.params);
//         if (!param) {
//             var commonParams = Xhr.getCommonParams();
//             param = options.params;
//             for (const key in commonParams) {
//                 if (commonParams.hasOwnProperty(key)) {
//                     param[key] = commonParams[key];
//                 }
//             }
//         }
//         Xhr.getXhr({
//             url: options.url,
//             params: JSON.stringify(param),
//             succ: function (res) {
//                 if (res.code === 1) {         //---------------------------------------
//                     typeof options.succ === "function" && options.succ(res);
//                 } else {
//                     console.log("api err => " + options.url, res);
//                     typeof options.fail === "function" && options.fail(res);
//                 }
//             },
//             fail: function (res) {
//                 // WxApi.showToast(res);
//                 console.log("api err => " + options.url, res);
//                 typeof options.fail === "function" && options.fail(res);
//             }
//         });
//     },

//     requestGet(options) {
//         Xhr.getOtherXhr({
//             url: Xhr.getOtherUrl(options.url,options.params),
//             succ: function (res) {
//                 if (res.code === 0) {
//                     typeof options.succ === "function" && options.succ(res);
//                 } else {
//                     console.log("api err => " + options.url, res);
//                     typeof options.fail === "function" && options.fail(res);
//                 }
//             },
//             fail: function (res) {
//                 // WxApi.showToast(res);
//                 console.log("api err => " + options.url, res);
//                 typeof options.fail === "function" && options.fail(res);
//             }
//         });
//     },

   
// }

// export default Apis;