import GameModel from "./GameModel";

class AI {

    constructor () {
        this.gameController = null;
        this.bDebug_Move = true;
    }

    setController(gameController) {
        this.gameController = gameController;
    }
    //设置深度
    setOption(option) {
        this.depth = option.depth;;
    }
    //设置AI颜色
    setColor(strColor) {
        this.strPieceColor = strColor;
    }

    //入口
    beginMove() {

        console.log("AI beginMove","AI color:",this.strPieceColor)
        setTimeout(() => {
            var oneMove = this.strategy();

            console.log("-------------------AI oneMove",oneMove)
            // if (bDebug_Move) {
            //     console.log("AI(", this.strPieceColor, ") move", oneMove,"--depth:",this.depth);   //移动打印
            // }
            this.gameController.getComponent("GameController").playerMove(this.strPieceColor, oneMove);
        }, 200);
    }

    //策略
    strategy(){
          // clone当前gameModel
        var anotherGameModel = GameModel.gameModel.clone();
        console.log("anotherGameModel.lstCurrentBoard:",anotherGameModel.lstCurrentBoard)

        var alpha = Number.MAX_VALUE * (-1);  //MAX_VALUE 属性是 JavaScript 中可表示的最大的数。它的近似值为 1.7976931348623157 x 10308。
        var beta = Number.MAX_VALUE;
        var isMax = true;

        var valueWithMove = this.AlphaBeta(anotherGameModel,this.depth,alpha,beta,isMax);

      
        console.log("asdasddddddddddddddadasd")
        console.log("strategy_HideToShow:",this.strategy_HideToShow(anotherGameModel))
        var finMove = valueWithMove.concat(this.strategy_HideToShow(anotherGameModel));
        console.log("finMove:",finMove)
        
        

        var nSelectMoveIndex = Math.floor(Math.random() * finMove.length);

        return finMove[nSelectMoveIndex];
    }

    strategy_HideToShow(gameModel) {
        
        var hideToShow_move = [];
        // console.log("111111111111111111111",hidePieces)
        var lstCurrentBoard = gameModel.getCurrentBoard();

        for(var i = 0; i < lstCurrentBoard.length; i++){
            var oneGird = lstCurrentBoard[i];
            if(oneGird.nShowHide === GameModel.PieceState.Hide){
                hideToShow_move.push(new gameModel.OneMove(i, null));
            }
        }
        return hideToShow_move;

    }
    //Alpha-Beta搜索  
    //当前局面 + 搜索深度 + alpha + beta + 是否是最大者
    AlphaBeta(currentGameModel, depth, alpha, beta, isMax){

        if (depth === 0) {
            console.log("depth 0 return")
           // return 评价函数
        }

        // 本方（AI）move
        if(isMax === true){
            return currentGameModel.getOnePlayerPossibleMove(this.strPieceColor,true)
        }
        // 对方（AI的对方）move
        else{

        }

    }
  
}

export default AI;
