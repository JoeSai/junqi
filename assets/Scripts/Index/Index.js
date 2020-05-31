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

        //积分制
        this.userRank.string = GameUserInfo.score;


        //暂时前端简单的判断，以后写在后端中实现。
        var rankName = ["小兵","副班长","班长","副排长","排长","副连长","连长","副营长","营长","副团长","团长","副旅长","旅长","副师长","师长","副军长","军长","司令"]
        if(GameUserInfo.score < 0){
            var rankNameIndex = 0;
        }
        else{
            var rankNameIndex = (GameUserInfo.score / 10) <= 17 ? parseInt(GameUserInfo.score / 10) : 17;
        }
        
        var userRankName = rankName[rankNameIndex];
        // this.userRank.string = rankName[rankNameIndex];
        
        this.infoLayout.getChildByName('name').getChildByName('nameLabel').getComponent(cc.Label).string =  this.userName.string;
        this.infoLayout.getChildByName('rank').getChildByName('rankLabel').getComponent(cc.Label).string =  userRankName;
      
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

                var rankLength = (res.rankInfo.length > 5) ? 5 : res.rankInfo.length;;

                if(that.rankList.children.length > 0){
                    // var b = that.rankList.children.length;
                    // for(var i = 0 ; i < b; i ++){
                    //     // that.rankList.removeChild(that.rankList.children[0]);  //先清空子节点  children[i] 下标会随着删除变化  //length同样也会变化
                    //     that.rankList.removeChild(that.rankList.children[0]);
                    //     // that.rankList.removeAllChildren();
                    that.rankList.removeAllChildren();
                    // }
                    // console.log(that.rankList.children[0],"aaa",that.rankList.children[1])
                    // that.rankList.removeChild(that.rankList.children[0]);
                    // // that.rankList.removeChild(that.rankList.children[1]);
                    // that.rankList.removeChild(that.rankList.children[0]);
                    console.log("清空排行榜子节点 ",rankLength,"---",that.rankList.children)
                }

                for(var i=0; i < rankLength; i++) {
                    var node = cc.instantiate(that.rankItemPrefab);
                    that.rankList.addChild(node);
                    node.getComponent("RankItem").setData(i, window.GameAppInfo.rank[i]);
                    console.log("增加排行榜子节点",i)
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
