

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
           
            
            // if(!storageGameUserInfo){  //FIXME:
            //     cc.sys.localStorage.setItem("GameUserInfo",JSON.stringify(serverInfo));
            // }

            
            if(isServerLoginSuccess){  //登录成功进行缓存
                
                cc.sys.localStorage.setItem("GameUserInfo",JSON.stringify(serverInfo));
                console.log("服务器登录成功");
                // console.log( cc.sys.localStorage.getItem("GameUserInfo") );
            }
            else{
                console.log("服务器登录失败");
        
            }
            GameUserInfo = JSON.parse( cc.sys.localStorage.getItem("GameUserInfo") ); 
            console.log(JSON.stringify(GameUserInfo));
            // console.log(GameUserInfo.visitorId);
            cc.director.loadScene('Index');  //vconsole.min.js:11 loadScene: Failed to load scene 'Index' because 'Index' is already being loaded.  FIXME:
        })
            
        
        
    }
    // update (dt) {},
});
