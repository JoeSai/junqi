import BasePlatform_Api from "./BasePlatform_Api";
import Api from "./Apis";

cc.Class({
    extends: BasePlatform_Api,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    //重写 平台登陆
    
    loginPlatform(callback){
        var allowVisitorLogin = true;       //是否允许游客登录  默认
        if(allowVisitorLogin){
            var visitorId = this.getVisitorId();
            var isVisitorLogin = "true";
            var isPlatformLoginSuccess = false;  //游客登陆，未进行平台登录。
        }
        else{
            // TODO:平台登录优先 , 平台登录失败再进行游客登录
        }
        var platformInfo = {
            "visitorId": visitorId,
            "isVisitorLogin":isVisitorLogin
        }
        typeof(callback) === "function" && callback(platformInfo,isPlatformLoginSuccess);
    },

    loginServer(platformInfo,callback){
        
        Api.request({
            url:"login.php",
            params:platformInfo,
            succ:function(res){
                // console.log(JSON.stringify(res));
                typeof(callback) === "function" && callback(res,true);
            },
            fail:function(res){

                var serverInfo ={
                    "name":"游客",
                    "gold":5000,
                    "score":0,
                    "battlesWon":0,
                    "battlesAmount":0
                }
                var isServerLoginSuccess = true;
        
                typeof(callback) === "function" && callback(serverInfo,isServerLoginSuccess);

                // typeof(callback) === "function" && callback(res,false);
                // var res2 = JSON.parse(res);        //TODO: 改成后端直接回传json,前端不需要再这样字符串转json。
                // console.log(res2.state+"aaaaaaa111111aaa");
            }
        });

        // console.log(serverUrl);
        
        //TODO:服务器登录

        // var serverInfo ={
        //     "name":"游客",
        //     "gold":5000,
        //     "score":0,
        //     "battlesWon":0,
        //     "battlesAmount":0
        // }
        // var isServerLoginSuccess = true;

        // typeof(callback) === "function" && callback(serverInfo,isServerLoginSuccess);


    }
    
    // update (dt) {},
});
