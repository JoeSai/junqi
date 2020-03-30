import Api from "../Utils/Apis";
import Base from "../Base";

cc.Class({
    extends: Base,

    properties: {
        userIcon:cc.Node,
        userName:cc.Label,
        userGold:cc.Label,
        userRank:cc.Label,

        infoLayout:cc.Node,
        Layer : cc.Node,

        rankItemPrefab: cc.Prefab,
        rankList: cc.Node,    //排名列表
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this.userName.string = GameUserInfo.name !== "" ?  GameUserInfo.name : "游客"+GameUserInfo.visitorId;
        this.userGold.string = GameUserInfo.gold;
        //TODO:更改前端信息。

        this.userRank.string = GameUserInfo.score;
        

        this.infoLayout.getChildByName('name').getChildByName('nameLabel').getComponent(cc.Label).string =  this.userName.string;
        this.infoLayout.getChildByName('rank').getChildByName('rankLabel').getComponent(cc.Label).string =  this.userRank.string;
      
        console.log(GameUserInfo.battlesWon,"aaaaaaaaa",GameUserInfo.battlesAmount,111,1/2)
        var rate = GameUserInfo.battlesWon == 0 ? 0 : ((GameUserInfo.battlesWon / GameUserInfo.battlesAmount) * 100).toFixed();
    
        this.infoLayout.getChildByName('rate').getChildByName('rateLabel').getComponent(cc.Label).string =  rate + "%";
        this.infoLayout.getChildByName('totalBattle').getChildByName('totalBattleLabel').getComponent(cc.Label).string =  GameUserInfo.battlesAmount;
    },

    start () {

    },
    startBtn(){
        cc.director.loadScene("Level");
    },

    openLayer(target,openLayer){
        this.layerShow(openLayer);
    },
    closeLayer(target,closeLayer){
        this.layerClose(closeLayer);
    },
    getRank(){
        this.openLayer(null,'lay-rank');
        var that = this;
        Api.request({
            url:"user/getRank",
            
            succ:function(res){
                // console.log(JSON.stringify(res));
                
                window.GameAppInfo.rank = res.rankInfo;  
                console.log(" window.GameAppInfo.rank", window.GameAppInfo.rank)
                console.log(" window.GameAppInfo.rank", window.GameAppInfo.rank[0])
                for(var i=0; i<5; i++) {
                    var node = cc.instantiate(that.rankItemPrefab);
                    that.rankList.addChild(node);
                    node.getComponent("RankItem").setData(i, window.GameAppInfo.rank[i]);
                }
                
               
            },
            fail:function(res){

                that.showToast("获取排行榜失败," + res.msg)
                //TODO:失败提示
                console.log('获取排行榜失败')
        
                
            }
        });

        
    }
    // update (dt) {},
});
