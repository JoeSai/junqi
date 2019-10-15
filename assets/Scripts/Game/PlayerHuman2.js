import GameModel from "./GameModel";
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

    setColor(strColor) {  //设置玩家棋子颜色
        this.nColorId = strColor;
    },


    beginMove() {
        // console.log("PlayerHuman(", this.nColorId, ") beginMove()");
        // console.log("board3 =", this.board);
        this.bMove = true;
        this.nSelectedPieceIndex = null;  //选择的棋子
        this.board.enablePlay(this);
    },

    move(nClickPieceIndex){

        var oneMove = null;
        //未点击过棋子
        if(this.nSelectedPieceIndex === null)
        {
            var selectedGrid = GameModel.gameModel.getOneGrid(nClickPieceIndex);  //获取选中的棋子

            console.log("selectedGrid = :",selectedGrid);
            
            //点击暗棋
            if(selectedGrid.nShowHide === GameModel.PieceState.Hide){
                oneMove = new GameModel.gameModel.OneMove(nClickPieceIndex, null);
                console.log("oneMove:+++"+oneMove);
            }
            //点击明棋
            else{
                if(selectedGrid.strPieceColor === this.nColorId)
                {
                    //记录选中的本方棋子 
                    this.nSelectedPieceIndex = nClickPieceIndex;
                    this.board.pieceUpAction(nClickPieceIndex);  //棋子拿起
                    //执行选中效果 TODO:
                }
                else{
                    //不能点击对方的棋子
                }
            }
        }
        //已点击过棋子
        else{
            if(nClickPieceIndex === this.nSelectedPieceIndex){ //如果点击的棋子为之前拿起的
                this.nSelectedPieceIndex = null;
                this.board.pieceDownAction(nClickPieceIndex);  //棋子放下

            }
            else{  //点击其他位置
                this.board.pieceDownAction(this.nSelectedPieceIndex);
                // 用户希望移动棋子
                oneMove = new GameModel.gameModel.OneMove(this.nSelectedPieceIndex, nClickPieceIndex);
                console.log(oneMove);
            }
        }

        if(oneMove != null){
            var moveResult = GameModel.gameModel.verifyMove(oneMove);

            if(moveResult === true){

                console.log("合法走棋");
                
                this.board.disablePlay();//取消点击监听

                this.gameController.getComponent("GameController").playerMove("RED", oneMove);
            }
            else{

                this.nSelectedPieceIndex = null;
                console.log("不合法的走棋");
            }


        }
        





    }
    // update (dt) {},
});
