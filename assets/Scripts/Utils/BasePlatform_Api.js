import Apis from "./Apis"
import Util from "./Util"
var BasePlatformApi = cc.Class({



    //获取游客id
    getVisitorId(){

        var visitorId =cc.sys.localStorage.getItem("visitorId");

        //有缓存 则 return缓存的 游客id ，无缓存则生成新的游客id并缓存.
        if(!visitorId){
            var visitorId = Util.getUniqueId();
            cc.sys.localStorage.setItem("visitorId",visitorId);
            
        }
        return visitorId;
  
    },



    //登录平台
    loginPlatform(){
        console.log("sddddddddasd");
    },

    //登录服务器
    loginServer(){

    }

});

module.exports = BasePlatformApi;

