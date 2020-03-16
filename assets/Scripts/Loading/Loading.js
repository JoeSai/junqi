

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.platform = window.getPlatform();  //FIXME:
        console.log(this.platform);

      
       
        var that = this;
        // 平台登陆
        this.platform.loginPlatform(function(platformInfo,isPlatformLoginSuccess){
        
            that.platformInfo = platformInfo;  //保存平台登录获取的信息
            //{platform: "web_desktop", visitorId: "k3zsag8o", isVisitorLogin: "true"}
            console.log("platformInfo",that.platformInfo)
            that._init();
        });
    

    
        
    },

    start () {

    },


    _init(){
        var that = this;
        //服务器登陆
    
        var storageGameUserInfo = cc.sys.localStorage.getItem("GameUserInfo");//本地缓存
        console.log("storageGameUserInfo",storageGameUserInfo);

        this.platform.loginServer(this.platformInfo,function(serverInfo,isServerLoginSuccess){
            var serverInfo = serverInfo;
            // var isServerLoginSuccess = isServerLoginSuccess;

            console.log(serverInfo,"serverInfo")
           
            /*  serverInfo 
            {
                "state": 1,
                "msg": "visitorId更新完毕，返回用户数据成功",
                "userInfo": {
                    "gold": 5000,
                    "score": 0,
                    "battlesWon": 0,
                    "battlesAmount": 0,
                    "platform": "web",
                    "_id": "5e6499a253fcd435c8251abf",
                    "name": "2",
                    "password": "1",
                    "__v": 0,
                    "visitorId": "lalala"
                }
            }
             */

            // if(!storageGameUserInfo){  //FIXME:
            //     cc.sys.localStorage.setItem("GameUserInfo",JSON.stringify(serverInfo));
            // }

            
            if(isServerLoginSuccess){  //登录成功进行缓存
                
                
                console.log("服务器登录成功");
                // console.log( cc.sys.localStorage.getItem("GameUserInfo") );
            }
            else{
                console.log("服务器登录失败");
                //TODO:
        
            }
            cc.sys.localStorage.setItem("GameUserInfo",JSON.stringify(serverInfo.userInfo));
            
            GameUserInfo = JSON.parse( cc.sys.localStorage.getItem("GameUserInfo") ); 
            console.log(JSON.stringify(GameUserInfo));
            // console.log(GameUserInfo.visitorId);
            cc.director.loadScene('Index');  //vconsole.min.js:11 loadScene: Failed to load scene 'Index' because 'Index' is already being loaded.  FIXME:
        })
            
        
        
    }
    // update (dt) {},
});
