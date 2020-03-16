import Api from "../Utils/Apis";
import Base from "../Base";
import {PLATFORM, PLATFORM_TYPE} from "../Utils/Config";

cc.Class({
    extends: Base,

    properties: {
        userName:cc.EditBox,
        userPassword:cc.EditBox,
        tipPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(PLATFORM === PLATFORM_TYPE.WX){
            cc.director.loadScene('Loading');  //login登录页面专门为web设计 微信平台则直接进入loading场景
        }

    },

    start () {
        
    },



    webReg(){
        var that = this;
        var params = {
            "name":this.userName.getComponent(cc.EditBox).string,
            "password":this.userPassword.getComponent(cc.EditBox).string
        }
        // console.log(params)
        Api.request({
            url:"user/register",
            params:params,
            succ:function(res){
                console.log(JSON.stringify(res));
                //连接服务器成功
                //注册成功
                
                that.openLayer(null,'lay-regSucc')
                
                
               
            },
            fail:function(res){

                // var serverInfo ={
                //     "name":"游客",
                //     "gold":5000,
                //     "score":0,
                //     "battlesWon":0,
                //     "battlesAmount":0
                // }
                 //TODO:失败提示
                that.showToast("注册失败," + res.msg)
                console.log('注册失败')
        
                // typeof(callback) === "function" && callback(serverInfo,false);

                // typeof(callback) === "function" && callback(res,false);
                // var res2 = JSON.parse(res);        //TODO: 改成后端直接回传json,前端不需要再这样字符串转json。
                
            }
        });
    },
    webLogin(){
        var that = this;
        var params = {
            "name":this.userName.getComponent(cc.EditBox).string,
            "password":this.userPassword.getComponent(cc.EditBox).string
        }
        // console.log(params)
        Api.request({
            url:"user/login",
            params:params,
            succ:function(res){
                console.log(JSON.stringify(res));
                //连接服务器成功
                //注册成功
                window.GameUserInfo.name = params.name;  //登录成功 保存用户名称
                cc.director.loadScene('Loading'); 
                
                
               
            },
            fail:function(res){

                that.showToast("登录失败," + res.msg)
                //TODO:失败提示
                console.log('登录失败')
        
                
            }
        });
    },
    visitorLogin(){
        window.GameUserInfo.name = "";
        cc.director.loadScene('Loading');
    },

    openLayer(target,openLayer){
        this.layerShow(openLayer);
    },
    closeLayer(target,closeLayer){
        this.layerClose(closeLayer);
    },
    // update (dt) {},
});
