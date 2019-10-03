// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       
        boardNode: cc.Node,
        gameController: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // console.log("PlayerHuman(", this.nColorId, ",) board1 =", this.boardNode);
        this.board = this.boardNode.getComponent("Board");
    },

    start () {

    },

    beginMove() {
        // console.log("PlayerHuman(", this.nColorId, ") beginMove()");
        // console.log("board3 =", this.board);
        this.bMove = true;
        this.nSelectedPieceIndex = null;
        this.board.enablePlay(this);
    },
    // update (dt) {},
});
