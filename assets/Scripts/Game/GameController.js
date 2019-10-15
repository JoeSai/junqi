import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        playerHuman: cc.Node,
        playerHuman2: cc.Node,
        boardNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

        //当前玩家 和 对手
        this.thisPlayer = null;
        this.opponentPlayer = null;

        this.thisPlayer = this.playerHuman.getComponent("PlayerHuman");
        this.opponentPlayer = this.playerHuman2.getComponent("PlayerHuman2");

        // 本方棋子颜色和对方棋子颜色
        this.thisPieceColor = null;
        this.opponentPieceColor = null;

        // 1：本方行棋，0：对方行棋
        this.nowTurn = 0;

        GameModel.gameModel.init();    //棋子初始化

        var coin = GameModel.gameModel.flipCoin();

        this.init(this.thisPlayer, this.opponentPlayer, coin);
    },

    // update (dt) {},
    init(thisPlayer, opponentPlayer, coin) {
        this.boardNode.getComponent("Board").init(); //初始化棋盘，棋子位置设置。

        //本方先走第一步
        if(coin == 1)
        {
            this.nowTurn = 1;
            thisPlayer.beginMove(); // “我” 开始下棋
            console.log("玩家--1--开始下棋")
        }
        else{
            this.nowTurn = 0;
            opponentPlayer.beginMove(); // “对手” 开始下棋
            console.log("玩家--2--开始下棋")
        }
    },
    //在校验合法走棋之后
    playerMove(nPlayerColorId,oneMove){
        if (oneMove === null) {
            // console.log(nPlayerColorId, "没有走子");
            return;
        }

        
        var moveResult = GameModel.gameModel.playerMove(oneMove);
        var movingPieceColor = moveResult.fromOneGridWithPosition.oneGrid.strPieceColor;  //点击的棋子颜色
        // console.log(movingPieceColor+"1111111111111");

        //玩家尚未确定颜色
        if(this.thisPieceColor === null){
            if (this.nowTurn === 1) {
                // 当前行动的棋子的颜色设为本方颜色，对方为另一颜色
                this.thisPieceColor = movingPieceColor;
                this.opponentPieceColor = GameModel.gameModel.getOpponentColor(this.thisPieceColor);
            }
            // 当前是对方行棋
            else {
                // 当前行动的棋子的颜色设为对方颜色，本方为另一颜色
                this.opponentPieceColor = movingPieceColor;
                this.thisPieceColor = GameModel.gameModel.getOpponentColor(this.opponentPieceColor);
            }
        }

        console.log( "玩家1颜色：",this.thisPieceColor,"玩家2颜色：", this.opponentPieceColor,"11111111111111111")

        //设置双方颜色
        this.thisPlayer.setColor(this.thisPieceColor);
        this.opponentPlayer.setColor(this.opponentPieceColor);
        

        //在board中 显示动作
        this.boardNode.getComponent("Board").showOneMove(moveResult);

        setTimeout(() => {
            console.log("更换下棋者")
            this.afterMove();
        }, 500);  //500
    },
    //一位玩家回合结束后  改变下棋者
    afterMove(){
        if(this.nowTurn == 1){
            this.opponentPlayer.beginMove();
            this.nowTurn = 0;
            console.log("玩家--2")
        }
        else{
            this.thisPlayer.beginMove();
            this.nowTurn = 1;
            console.log("玩家--1")
        }
    }
});
