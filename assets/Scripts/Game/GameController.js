import GameModel from "./GameModel";
import AI from "./AI";
import Base from "../Base";
cc.Class({
    extends: Base,

    properties: {
        playerHuman: cc.Node,
        playerHuman2: cc.Node,
        boardNode: cc.Node,
        myInfo:cc.Node,
        opponentInfo:cc.Node,
        layer:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.GameController = this;
    },

    start () {

        //当前玩家 和 对手
        this.thisPlayer = null;
        this.opponentPlayer = null;

        this.thisPlayer = this.playerHuman.getComponent("PlayerHuman");
        // this.opponentPlayer = this.playerHuman2.getComponent("PlayerHuman2");
        
        //创建AI
        this.opponentPlayer = new AI();
        this.opponentPlayer.setController(this);
        this.opponentPlayer.setOption({ depth: 2 })
        
        // 本方棋子颜色和对方棋子颜色
        this.thisPieceColor = null;
        this.opponentPieceColor = null;

        // 1：本方行棋，0：对方行棋
        this.nowTurn = 0;

        GameModel.gameModel.init();    //棋子初始化

        var coin = GameModel.gameModel.flipCoin();

        this.init(this.thisPlayer, this.opponentPlayer, coin);
    },


    init(thisPlayer, opponentPlayer, coin) {
        this.boardNode.getComponent("Board").init(); //初始化棋盘，棋子位置设置。

        //本方先走第一步
        if(coin == 1)
        {
            this.nowTurn = 1;
            thisPlayer.beginMove(); // “我” 开始下棋
            console.log("玩家--1--开始下棋")

            
            this.showTurnPlayer(this.nowTurn);
        }
        else{
            this.nowTurn = 0;
            opponentPlayer.beginMove(); // “对手” 开始下棋
            console.log("玩家--2--开始下棋")

            
            this.showTurnPlayer(this.nowTurn);
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

        //界面 显示玩家执子颜色 
        // 本方红色 对方黑色
        if(this.thisPieceColor === GameModel.PLAYER_COLOR_RED){
            this.myInfo.getChildByName("RED11").active = true;
            this.opponentInfo.getChildByName("BLACK11").active = true;
        }
        // 本方黑色 对方红色
        else{
            this.myInfo.getChildByName("BLACK11").active = true;
            this.opponentInfo.getChildByName("RED11").active = true;
        }

        //设置双方颜色
        this.thisPlayer.setColor(this.thisPieceColor);
        this.opponentPlayer.setColor(this.opponentPieceColor);
        

        //在board中 显示动作
        this.boardNode.getComponent("Board").showOneMove(moveResult);

        setTimeout(() => {
            console.log("更换下棋者")
            this.afterMove(this.nowTurn);
        }, 500);  //500
    },
    //一位玩家回合结束后  改变下棋者
    afterMove(lastTurn){  

        let debug = false;
 
        var gameOverLayer = this.layer.getChildByName("lay-gameover");
        var result_info = gameOverLayer.getChildByName("result-info").getComponent(cc.Label);
      
        if(debug){
            var isGameOver = GameModel.GameOver_State.Win;
            //TODO:判断输赢
            if(isGameOver === GameModel.GameOver_State.Win)
            {

               
                this.layerShow("lay-gameover");
            }
            
        }

        else{
                //上一步为 本方下   
            if(lastTurn === 1){
                var isGameOver = GameModel.gameModel.isGameOver(this.thisPieceColor); 
                // var isGameOver = GameModel.GameOver_State.Draw;

                console.log("isGameOver",isGameOver)
                //游戏结束
                if(isGameOver !== GameModel.GameOver_State.Go){
                    console.log("游戏结束",isGameOver)
                    if(isGameOver === GameModel.GameOver_State.Win){
                        result_info.string = "Congratulations! Yow win!"
                    }
                    else if(isGameOver === GameModel.GameOver_State.Lose){
                        result_info.string = "Yow lose ..Keep trying!"
                    }
                    else{
                        result_info.string = "Draw ..One more time!"
                    }
                    //显示结算窗口
                    this.layerShow("lay-gameover");

                
                }
                //游戏继续
                else{
                    this.opponentPlayer.beginMove();
                    this.nowTurn = 0;
                    console.log("玩家--2")
                    this.showTurnPlayer(this.nowTurn);
                }
            }
            //上一步为 对方下
            else{
                var isGameOver = GameModel.gameModel.isGameOver(this.opponentPieceColor); 

                //游戏结束
                if(isGameOver !== GameModel.GameOver_State.Go){
                    console.log("游戏结束",isGameOver)
                   //显示结算窗口
                    if(isGameOver === GameModel.GameOver_State.Win){
                        result_info.string = "Yow lose ..Keep trying!"
                    }
                    else if(isGameOver === GameModel.GameOver_State.Lose){
                        result_info.string =  "Congratulations! Yow win!"
                    }
                    else{
                        result_info.string = "draw ..One more time!"
                    }
                    this.layerShow("lay-gameover");
                }
                //游戏继续
                else{
                    this.thisPlayer.beginMove();
                    this.nowTurn = 1;
                    console.log("玩家--1");
                    this.showTurnPlayer(this.nowTurn);
                }
            }

        }
        

       
    },
    //当前下棋的 玩家
    showTurnPlayer(player){

        if(player === 1){
            this.myInfo.getChildByName("select").active = true;
            this.opponentInfo.getChildByName("select").active = false;
        }
        else{
            this.myInfo.getChildByName("select").active = false;
            this.opponentInfo.getChildByName("select").active = true;
        }
        
    }
});
