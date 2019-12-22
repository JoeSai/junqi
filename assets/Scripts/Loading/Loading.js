

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.platform = getPlatform();

      

        var that = this;
        //平台登陆
        this.platform.loginPlatform(function(platformInfo,isPlatformLoginSuccess){
        
            that.platformInfo = platformInfo;  //保存平台登录获取的信息
            //{platform: "web_desktop", visitorId: "k3zsag8o", isVisitorLogin: "true"}
        });

        // console.log("platformInfo",this.platformInfo)
        this._init();
    },

    start () {

    },


    _init(){
        var that = this;
        //服务器登陆
        var storageGameUserInfo = cc.sys.localStorage.getItem("GameUserInfo");
        this.platform.loginServer(this.platformInfo,function(serverInfo,isServerLoginSuccess){
            var serverInfo = serverInfo;
            var isServerLoginSuccess = isServerLoginSuccess;

            console.log(serverInfo,"serverInfo")
           
            if(!storageGameUserInfo){
                cc.sys.localStorage.setItem("GameUserInfo",JSON.stringify(serverInfo));
            }
            
            if(isServerLoginSuccess){  //登录成功且没有缓存 则进行缓存
                // GameUserInfo.name = serverInfo.name + that.platformInfo.visitorId;
                // GameUserInfo.gold = serverInfo.gold;
                // GameUserInfo.score = serverInfo.score;
                // GameUserInfo.battlesWon = serverInfo.battlesWon;
                // GameUserInfo.battlesAmount = serverInfo.battlesAmount;
                //保存用户信息 然后跳转到

                console.log("服务器登录成功");
                // console.log( cc.sys.localStorage.getItem("GameUserInfo") );
            }
            else{
                console.log("服务器登录失败");
            }
            GameUserInfo = JSON.parse( cc.sys.localStorage.getItem("GameUserInfo") ); 
            // console.log(JSON.stringify(GameUserInfo));
            // console.log(GameUserInfo.visitorId);
            cc.director.loadScene('Index');
        })
            
        
        
    }
    // update (dt) {},
});
