import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        playerHuman: cc.Node,

        boardNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

        //当前玩家 和 对手
        this.thisPlayer = null;
        this.opponentPlayer = null;

        this.thisPlayer = this.playerHuman.getComponent("PlayerHuman");
        this.opponentPlayer = this.playerHuman.getComponent("PlayerHuman");

        GameModel.gameModel.init();    //棋子初始化
        this.init();
    },

    // update (dt) {},
    init() {
        this.boardNode.getComponent("Board").init();

        this.thisPlayer.beginMove(); // “我” 开始下棋
    }
});
