import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        te: cc.spriteFrame
    },


    onLoad () {
        var that = this;
       
    },

    start () {
        this.lstCurrentBoardInfo = [];

        //当前棋子 与 已击吃棋子
        this.lstCurrentBoardNodes = [];
        this.lstKilledNode = [];


    },

    init(){
        //清除之前的棋子节点
        for (var i = 0; i < this.lstCurrentBoardNodes.length; i++) {
            if (this.lstCurrentBoardNodes[i] !== null) {
                this.lstCurrentBoardNodes[i].destroy();
            }
        }
        // 清除之前被吃掉的棋子节点
        for (var i = 0; i < this.lstKilledNode.length; i++) {
            if (this.lstKilledNode[i] !== null) {
                this.lstKilledNode[i].destroy();
            }
        }
        //重置
        this.lstCurrentBoardNodes = [];
        this.lstKilledNode = [];

        //获取生成的开局 棋子数组
        var lstCurrentBoard = GameModel.gameModel.getCurrentBoard();

       
        console.log(this.tea)

        for (var i = 0; i < lstCurrentBoard.length; i++) { 

            // 棋盘每个格子一个棋子
            var oneGrid = lstCurrentBoard[i];           //such us ：{ nShowHide: 0, strPieceColor: "RED", nPieceId: 4 }
            var node = new cc.Node('OnePiece');
            //添加精灵渲染组件
            var sp = node.addComponent(cc.Sprite);

            cc.loader.loadRes('img/cocos', cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                console.log("spriteFrame",spriteFrame)
                sp.spriteFrame  = spriteFrame;
    
            });
            
            node.setScale(1.5);
            node.parent = this.node;
            node.setPosition(0, 0);  
            console.log("add")
        }
    }

    // update (dt) {},
});
