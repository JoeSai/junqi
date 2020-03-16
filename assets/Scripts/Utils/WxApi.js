import BasePlatformApi from "./BasePlatformApi";
import Api from "./Apis";

var WxApi = cc.Class({
    extends: BasePlatformApi,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      
    },

    start () {
     
    },

    getWxUserInfo(){
      var that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success () {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.getUserInfo({
                  success: function(res) {
                    var userInfo = res.userInfo
                    GameUserInfo.name = userInfo.nickName;  //保存昵称和头像url
                    GameUserInfo.avatarUrl = userInfo.avatarUrl;
                    console.log(userInfo,"userInfo");
                  }
                })
              }
            })
          }
          else{
            wx.getUserInfo({
              success: function(res) {
                var userInfo = res.userInfo
                GameUserInfo.name = userInfo.nickName;  //保存昵称和头像url
                GameUserInfo.avatarUrl = userInfo.avatarUrl;
                console.log(userInfo,"userInfo");
              }
            })
          }
        }
      })
    },
    //重写 平台登陆
    loginPlatform(callback){
      
        this.getWxUserInfo();
        var that = this;
        var allowVisitorLogin = false;       //是否允许游客登录  默认
        
        if(allowVisitorLogin){
            var platformInfo = {
                "visitorId": this.getVisitorId(),
                "isVisitorLogin": true,
            }
            typeof(callback) === "function" && callback(platformInfo,false);
        }
        else{
            var platformInfo = {
                "openid":"",
                "isVisitorLogin": false,
            }
            wx.showLoading({
                title: '加载中',
            })
            wx.login({
                success (res) {
                  if (res.code) {
                    wx.request({
                      url: 'http://junqi.2enjoy.life/wx_login.php',
                      data: {
                        code: res.code
                      },
                      success:function(res){
                        console.log(res.data.openid,"login 成功");

                        var platformInfo = {
                            "openid":res.data.openid,
                            "isVisitorLogin": false,
                            "name":GameUserInfo.name,
                            "avatarUrl":GameUserInfo.avatarUrl,
                        }
                        wx.hideLoading()
                        typeof(callback) === "function" && callback(platformInfo,true);

                        console.log(platformInfo,"platformInfo1111111")
                      },
                      fail:function(res){
                        console.log("loginPlatform 失败");
                        wx.hideLoading()
                        typeof(callback) === "function" && callback(platformInfo,false);
                      }
                    })
                    console.log("code",res.code)
                  } else {
                    wx.hideLoading()
                    typeof(callback) === "function" && callback(platformInfo,false);
                    console.log('登录失败！' + res.errMsg)
                  }
                }
                
            })
        }

        // typeof(callback) === "function" && callback(platformInfo,isPlatformLoginSuccess);异步问题
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

                var serverInfo = {
                    "visitorId":"登录失败",
                    "gold":5000,
                    "score":0,
                    "battlesWon":0,
                    "battlesAmount":0
                }
        
                typeof(callback) === "function" && callback(serverInfo,false);

                // typeof(callback) === "function" && callback(res,false);
                // var res2 = JSON.parse(res);        //TODO: 改成后端直接回传json,前端不需要再这样字符串转json。
                // console.log(res2.state+"aaaaaaa111111aaa");
            }
        });



    }
    
    // update (dt) {},
});
export default WxApi;
