import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        boardNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {


        GameModel.gameModel.init();    //棋子初始化
        this.init();
    },

    // update (dt) {},
    init() {
        this.boardNode.getComponent("Board").init();

    }
});
