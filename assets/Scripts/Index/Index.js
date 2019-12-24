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

    // update (dt) {},
});
