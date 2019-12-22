import GameModel from "./GameModel";

class AI {

    constructor () {
        this.gameController = null;
        this.bDebug = false;
        this.currentValue = 0;  //当前局面 相对分 value
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

        // console.log("AI beginMove","AI color:",this.strPieceColor)
        setTimeout(() => {
            var oneMove = this.strategy();

            // console.log("-------------------AI oneMove",oneMove)
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
        // console.log("anotherGameModel.lstCurrentBoard:",anotherGameModel.lstCurrentBoard)

        var alpha = Number.MAX_VALUE * (-1);  //MAX_VALUE 属性是 JavaScript 中可表示的最大的数。它的近似值为 1.7976931348623157 x 10308。
        var beta = Number.MAX_VALUE;
        var isMax = true;

        var valueWithMove = this.AlphaBeta(anotherGameModel,this.depth,alpha,beta,isMax);
        console.log("行棋de分值 -------------------- :",valueWithMove.value);

        // console.log("lstMaxValueMove----------------->",valueWithMove.lstMaxValueMove)

        /*
        * 策略： 1.明棋皆不可移动    2.明棋存在至少一种行棋
        * 
        * 1.1 有暗棋可翻  --> 翻棋策略
        * 1.2 暗棋都翻完了 -->走投无路，游戏结束
        *
        * 2.1 有暗棋可翻
        *  2.1.1 行棋更优  -->行棋策略
        *  2.1.2 翻棋更优  -->翻棋策略
        *  2.1.3 行棋翻棋相同 -->随机
        * 
        * 2.2 暗棋都翻完了  -->行棋策略
        */


        //明棋皆不可移动
        if(valueWithMove.move === null){
            //有暗棋可翻
            if(this.strategy_HideToShow(anotherGameModel)){
                console.log("222222明棋皆不可移动，有暗棋可翻");
                return this.strategy_HideToShow(anotherGameModel);
            }
            //暗棋都翻完了
            else{
                console.log("222222GameOver  AI  lose"); //TODO:
            }
           
        }  
        //明棋存在至少一种行棋
        //FIXME:
        else{
            //有暗棋可以翻时
            if(this.strategy_HideToShow(anotherGameModel)){
                var opponent_valueWithMove = this.AlphaBeta(anotherGameModel,this.depth - 1,alpha,beta,false);
                console.log("不行棋de分值 -------------------- ",opponent_valueWithMove.value)

                if(valueWithMove.value > opponent_valueWithMove.value){
                    console.log("222222行棋比翻棋更优",valueWithMove.lstMaxValueMove)
                    var amountOfMoves = valueWithMove.lstMaxValueMove.length;
                    var randomIndex = Math.floor(Math.random() * amountOfMoves);
                    return valueWithMove.lstMaxValueMove[randomIndex];
                }
                else if(valueWithMove.value === opponent_valueWithMove.value){
                    if(Math.random() >= 0.5){
                        console.log("222222行棋分值和不行棋分值一样，选择了翻棋",valueWithMove.lstMaxValueMove);
                        return this.strategy_HideToShow(anotherGameModel);
                    }
                    else{
                        console.log("222222行棋分值和不行棋分值一样，选择了行棋",valueWithMove.lstMaxValueMove);
                        var amountOfMoves = valueWithMove.lstMaxValueMove.length;
                        var randomIndex = Math.floor(Math.random() * amountOfMoves);
                        return valueWithMove.lstMaxValueMove[randomIndex];
                    }
                }
                else{
                    console.log("222222行棋不利");
                    return this.strategy_HideToShow(anotherGameModel);
                }
            }
            //暗棋都翻完
            else{
                console.log("222222暗棋都翻完")
                var amountOfMoves = valueWithMove.lstMaxValueMove.length;
                var randomIndex = Math.floor(Math.random() * amountOfMoves);
                return valueWithMove.lstMaxValueMove[randomIndex];
            }


            // //当 行棋后 局面分不变时  
            // console.log("valueWithMove.value",valueWithMove.value,"this.currentValue",this.currentValue)
            // if(valueWithMove.value === this.currentValue){

            //     //对手下
            //     var opponent_valueWithMove = this.AlphaBeta(anotherGameModel,this.depth - 1,alpha,beta,false);
            //     //若选择翻棋后 AI并不会吃亏
            //     //解决 存在若不行棋 局面分下降的情况
            //     if(opponent_valueWithMove.value === this.currentValue){
            //          //50%概率 翻棋 50%概率随便移动
            //         if(Math.random() >= 0.5){
            //             console.log("222222局面分不变时，50%概率 翻棋");
            //             return this.strategy_HideToShow(anotherGameModel);
            //         }
            //         else{
            //             console.log("222222局面分不变时，50%概率随便移动");
            //             var amountOfMoves = valueWithMove.lstMaxValueMove.length;
            //             var randomIndex = Math.floor(Math.random() * amountOfMoves);
            //             return valueWithMove.lstMaxValueMove[randomIndex];
            //         }
            //     }
            //     else{
            //         console.log("222222不吃亏，此时的最优下法");
            //         var amountOfMoves = valueWithMove.lstMaxValueMove.length;
            //         var randomIndex = Math.floor(Math.random() * amountOfMoves);
            //         return valueWithMove.lstMaxValueMove[randomIndex];
            //     }

               
            // }
            // //行棋更有利
            // else if(valueWithMove.value > this.currentValue){
            //     console.log("222222行棋子有利，选择最优下法");
            //     var amountOfMoves = valueWithMove.lstMaxValueMove.length;
            //     var randomIndex = Math.floor(Math.random() * amountOfMoves);
    
            //     // console.log("randomMove index:",randomIndex)

            //     this.currentValue = valueWithMove.value;  //重置局面分

            //     return valueWithMove.lstMaxValueMove[randomIndex];
            // }
            // //行棋子更不利
            // else{
            //     //可以翻棋
            //     if(this.strategy_HideToShow(anotherGameModel)){
            //         console.log("222222行棋子更不利,翻棋");
            //         return this.strategy_HideToShow(anotherGameModel);
            //     }
            //     //暗棋都翻完了
            //     else{
            //         var amountOfMoves = valueWithMove.lstMaxValueMove.length;
            //         var randomIndex = Math.floor(Math.random() * amountOfMoves);
            //         console.log("222222行棋子更不利,暗棋都翻完了,随便下");
            //         this.currentValue = valueWithMove.value;  //重置局面分
            //         return valueWithMove.lstMaxValueMove[randomIndex];
            //     }
            // }
           
        }
        // console.log("asdasddddddddddddddadasd")
        // console.log("strategy_HideToShow:",this.strategy_HideToShow(anotherGameModel))

        // var finMove = valueWithMove.concat(this.strategy_HideToShow(anotherGameModel));
        // console.log("finMove:",finMove)
        
        // var nSelectMoveIndex = Math.floor(Math.random() * finMove.length);

        // return finMove[nSelectMoveIndex];
    }
    

    strategy_HideToShow(gameModel) {
        
        var hidePieces = gameModel.getHidePieces();
        var lstCurrentBoard = gameModel.getCurrentBoard();
        var hideToShow_move = []; // 最大分值的 移动方式 数组 （用于当多种行棋 评估分值相同时 随机选择一种下法）
        var value = Number.MAX_VALUE * (-1);    //节点最大收益

        var bDebug = false;

        console.log("hidePieces:",hidePieces)

        for(var i = 0; i < lstCurrentBoard.length; i++){
            var oneGrid = lstCurrentBoard[i];
            if (oneGrid.nPieceId >= 0  && oneGrid.nShowHide === GameModel.PieceState.Hide) {
                var oneMove = new gameModel.OneMove(i, null);
                hideToShow_move.push(oneMove);
            }
        }
        //如果有可翻开的棋子 则随机返回一个OneMove
        if(hideToShow_move.length > 0){
            var nSelectMoveIndex = Math.floor(Math.random() * hideToShow_move.length);
            return hideToShow_move[nSelectMoveIndex];
        }
        else{
            return false;
        }
       

    }
    //Alpha-Beta搜索  
    //当前局面 + 搜索深度 + alpha + beta + 是否是最大者
    AlphaBeta(currentGameModel, depth, alpha, beta, isMax){

        //当前游戏胜负是否分出
        // console.log("AI AlphaBeta depth",depth)
        var currentResult = currentGameModel.isGameOver(this.strPieceColor);

        //AI取胜
        if(currentResult === GameModel.GameOver_State.Win){
            return {value : 10000, move : null}
        }
        
        if (depth === 0) {
            // console.log("evaluate() -----------------------")
            return {value : this.evaluate(currentGameModel, this.strPieceColor), move : null};       //TODO:理解-----
           // return 评价函数
        }

        // 本方（AI）move
        if(isMax === true){
            if(this.bDebug){
                console.log("AI getOnePlayerPossibleMove")
            }
          
            var lstShowPieceMove = currentGameModel.getOnePlayerPossibleMove(this.strPieceColor,true)
            
            if(this.bDebug){
                console.log("AI 明棋可能的 move：",lstShowPieceMove);
            }
       

            var value = Number.MAX_VALUE * (-1);    //节点最大收益
            var move = null;
            var lstMaxValueMove = []; // 最大分值的 移动方式 数组 （用于当多种行棋 评估分值相同时 随机选择一种下法）

            //没有可走的棋 (明棋都不可以移动))
            // 本方（AI）走空步，让对方（AI的对方）走
            if(lstShowPieceMove.length === 0){
                var cloneGameModel = currentGameModel.clone();
                var valueWithMove = this.AlphaBeta(cloneGameModel, depth - 1, alpha, beta, false);

                if(this.bDebug){
                    console.log("AI valueMove222222:",valueWithMove);
                }
              
                if(valueWithMove.value > value){
                    value = valueWithMove.value;
                }
                return {value : value , move : move}  //FIXME:
            }

            for(var i = 0; i < lstShowPieceMove.length; i++){
                var currentMove = lstShowPieceMove[i];

                if(this.bDebug){
                    console.log("AI currentMove:",currentMove);
                }

                //移动棋子
                var cloneGameModel = currentGameModel.clone();
                cloneGameModel.playerMove(currentMove);

                var valueWithMove = this.AlphaBeta(cloneGameModel, depth - 1, alpha, beta, false);

                if(valueWithMove.value > value){
                    value = valueWithMove.value;
                    move = currentMove;
                    lstMaxValueMove = [];        //发现更优下法时，清空之前记录，重新push 
                    lstMaxValueMove.push(move);
                }
                else if(valueWithMove.value === value){
                    move = currentMove;
                    lstMaxValueMove.push(move);
                }

                alpha = Math.max(alpha, value);

                if (this.bDebug) {
                    console.log("   alpha =", alpha, ", beta =", beta);
                }
                 //  (* beta cut-off *)
                 if (alpha > beta) {
                    if(this.bDebug){
                        console.log("beta cut-off");
                    }
                    
                    break;
                }
            }
            return {value : value, move : move, lstMaxValueMove : lstMaxValueMove};
        }
        // 对方（AI的对方）move
        else{
            if(this.bDebug){
                console.log("AI的对方 getOnePlayerPossibleMove")
            }
            
            var lstShowPieceMove = currentGameModel.getOnePlayerPossibleMove(GameModel.gameModel.getOpponentColor(this.strPieceColor));

            var value = Number.MAX_VALUE;
            var move = null;

            if(lstShowPieceMove.length === 0){
                var cloneGameModel = currentGameModel.clone();
                var valueWithMove = this.AlphaBeta(cloneGameModel, depth - 1, alpha, beta, false);

                if(this.bDebug){
                    console.log("AI 对方 valueMove222222:",valueWithMove);
                }
              
                if(valueWithMove.value < value){
                    value = valueWithMove.value;
                }
                return {value : value , move : move}  //FIXME:
            }

            for(var i = 0; i < lstShowPieceMove.length; i++){
                var currentMove = lstShowPieceMove[i];

                if(this.bDebug){
                    console.log("AI 的对方 currentMove:",currentMove);
                }

                //移动棋子
                var cloneGameModel = currentGameModel.clone();
                cloneGameModel.playerMove(currentMove);

                var valueWithMove = this.AlphaBeta(cloneGameModel, depth - 1, alpha, beta, true);

                if(valueWithMove.value < value){
                    value = valueWithMove.value;
                    move = currentMove;
                }

                beta = Math.min(beta, value);

                if (this.bDebug) {
                    console.log("   alpha =", alpha, ", beta =", beta);
                }
                   //  (* alpha cut-off *)
                if (alpha > beta) {
                    if(this.bDebug){
                        console.log("alpha cut-off");
                    }
                    
                    break;
                }
            }
            return {value : value, move : move};
        }

    }
    evaluate(gameModel, strPieceColor) {
        
    

        if (strPieceColor !== GameModel.PLAYER_COLOR_RED && strPieceColor !== GameModel.PLAYER_COLOR_BLACK) {
            if(this.bDebug){
                console.log(strPieceColor,GameModel.PLAYER_COLOR_RED,GameModel.PLAYER_COLOR_BLACK)
                console.log("aaaaaaaaaaaaaaaaaaaaaaa")
            }
           
            return 0;
        }

        //return相对分数，（本方得分 - 对方得分）
        
        var relativeScore = GameModel.gameModel.getRelativeScore(gameModel,strPieceColor).relativeScore;
        if(this.bDebug){
            console.log("  evaluate(), relativeScore =", relativeScore);
        }
        // console.log("  evaluate(), relativeScore =", relativeScore);

        return relativeScore;
    }
  
}

export default AI;
