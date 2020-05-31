/* 棋盘position:

60 61 62 63 64
55 56 57 58 59
50 51 52 53 54
45 46 47 48 49
40 41 42 43 44
35 36 37 38 39

30 31 32 33 34

25 26 27 28 29 
20 21 22 23 24 
15 16 17 18 19 
10 11 12 13 14
5  6  7  8  9
0  1  2  3  4

*/

import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
        // te: cc.spriteFrame
        piecesAtlas: cc.SpriteAtlas,
    },


    onLoad () {
        
        this.animation = this.getComponent("Animation");

        //每一个棋子 所占 地图格子的 长和宽
        this.nOneGridWidth = this.node.getContentSize().width / GameModel.Board.Width;
        this.nOneGridHeight = this.node.getContentSize().height / GameModel.Board.Height;
        this.SPRITEFRAME_HIDE = "Hide";

    },

    start () {
        this.lstCurrentBoardInfo = [];

        //当前棋子 与 已吃棋子
        this.lstCurrentBoardNodes = [];
        this.lstKilledNode = [];


    },

    init(){
        // var that=this;
        // cc.loader.loadRes('img/cocos', cc.SpriteFrame, function (err, spriteFrame) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }
        //     console.log("1",spriteFrame)
        //     that.te1  = spriteFrame;
        //     that.a="ok";

        // });
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

       

        for (var i = 0; i < lstCurrentBoard.length; i++) { 

            // 棋盘每个格子一个棋子
            var oneGrid = lstCurrentBoard[i];           //such us ：{ nShowHide: 0, strPieceColor: "RED", nPieceId: 4 }
            var node = new cc.Node('OnePiece');
            //添加精灵渲染组件
            var sp = node.addComponent(cc.Sprite);

            // cc.loader.loadRes('img/cocos', cc.SpriteFrame, function (err, spriteFrame) {
            //     if (err) {
            //         cc.error(err.message || err);
            //         return;
            //     }
            //     console.log("spriteFrame",spriteFrame)
            //     sp.spriteFrame  = spriteFrame;
    
            // });
            // if(this.a == "ok")
            // {
            // sp.spriteFrame = this.te1;
            // console.log("1111111")
            // }
            // else{
            //     console.log("22222222")
            // }
            sp.spriteFrame = this.getSpriteFrameOfOneGrid(oneGrid);
            node.setScale(1.5);
            node.parent = this.node;

            var gridXY = GameModel.gameModel.gridIndexToGridXY(i);         //     return { x: nX, y: nY };
            // console.log("gridXY =", gridXY);

            var fPieceCenterX = gridXY.x * this.nOneGridWidth + this.nOneGridWidth / 2 - this.node.getContentSize().width / 2;
            var fPieceCenterY = gridXY.y * this.nOneGridHeight + this.nOneGridHeight / 2 - this.node.getContentSize().height / 2;
            // console.log("fPieceCenterX =", fPieceCenterX);
            node.setPosition(fPieceCenterX, fPieceCenterY);               //设置每个棋子position
            // console.log("add")

            this.lstCurrentBoardNodes.push(node);
        }
    },
    getSpriteFrameOfOneGrid(oneGrid) {
        // console.log("getSpriteFrameOfOneGrid(), GameModel.PieceState =", GameModel.PieceState);

        if (oneGrid === null) {
            return null;
        } else if (oneGrid.nShowHide === GameModel.PieceState.Hide) {
            return this.piecesAtlas.getSpriteFrame(this.SPRITEFRAME_HIDE);          //棋子背面
        } else {
            // console.log("------------------"+oneGrid.strPieceColor +"-----------------"+ oneGrid.nPieceId)
            return this.piecesAtlas.getSpriteFrame(oneGrid.strPieceColor + oneGrid.nPieceId);           //颜色 + 棋子ID
        }
    },
    enablePlay(player) {
        // console.log("Board.enablePlay()");
        this.currentPlayer = player;
        this.node.on(cc.Node.EventType.TOUCH_START, this.playerTouchStart, this);       //开启监听
    },
    disablePlay() {
        // console.log("Board.disablePlay()");
        this.currentPlayer = null;
        this.node.off(cc.Node.EventType.TOUCH_START, this.playerTouchStart, this);
    },

    playerTouchStart(event) {
        // console.log("Board.playerTouchStart()");
        // this.node.off(cc.Node.EventType.TOUCH_START, this.playerTouchStart, this);
        this.touchLoc = event.getLocation();
        // console.log("touchLoc1 =", this.touchLoc);

        this.touchLoc = this.node.convertToNodeSpaceAR(this.touchLoc);  //将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
        console.log("touchLoc2 =", this.touchLoc);


        /*   convertToNodeSpaceAR转换后  以board中心点为 （0，0）
        *  
        *             -----  
        *       <---   (0，0)   --->     
        *             ------  
        * 
        */
        var nClickPieceIndex = this.pointToPieceIndex(this.touchLoc);
        
        if (this.currentPlayer !== null) {
            this.currentPlayer.move(nClickPieceIndex);       //玩家move 动作
        }
    },

    pointToPieceIndex(point){
        var clickV2 = cc.v2();

        // Node.getContentSize
        // 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
        // 坐标右移，统一为正数
        clickV2.x = point.x + this.node.getContentSize().width / 2;
        clickV2.y = point.y + this.node.getContentSize().height /2;

        var ix = Math.floor(clickV2.x / (this.node.getContentSize().width / GameModel.Board.Width));
        var iy = Math.floor(clickV2.y / (this.node.getContentSize().height / GameModel.Board.Height));

        // console.log("Board, ix =", ix, ", iy =", iy);

        // 期望 ix 为 0 1 2 3 4 
        // 会出现 Board, ix = 5 , iy = 1 
        if(ix >= GameModel.Board.Width){
            ix = GameModel.Board.Width - 1;
        }
        if(iy >= GameModel.Board.Height){
            iy = GameModel.Board.Height - 1;
        }
        var index = ix + iy * GameModel.Board.Width;
        console.log("Board, ix =", ix, ", iy =", iy, ", index =", index);
        return index;

    },

    showOneMove(oneMoveResult){
        console.log("oneMoveResult:",oneMoveResult)
        // 暗棋翻明棋
        if (oneMoveResult.nMovingType === GameModel.MOVING_TYPE.SHOW) {

            let showOneGrid = this.hidePieceToShow(oneMoveResult.fromOneGridWithPosition);
        }
        //明棋移动到 空格
        else if(oneMoveResult.nMovingType === GameModel.MOVING_TYPE.MOVE){
            console.log("GameModel.gameModel.getNullGird()",GameModel.gameModel.getNullGird())

            //数组变化
            var movingNode = this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex];
            this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex] = GameModel.gameModel.getNullGird();  //原位置改为null
            this.lstCurrentBoardNodes[oneMoveResult.toOneGridWithPosition.nPositionIndex] = movingNode;

            var fromBoardXY = this.gridIndexToBoardXY(oneMoveResult.fromOneGridWithPosition.nPositionIndex);
            var targetBoardXY = this.gridIndexToBoardXY(oneMoveResult.toOneGridWithPosition.nPositionIndex);
            
            this.pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,GameModel.MOVING_TYPE.MOVE);
            
        }
        else if(oneMoveResult.nMovingType === GameModel.MOVING_TYPE.KILL){

            var killedNode = this.lstCurrentBoardNodes[oneMoveResult.toOneGridWithPosition.nPositionIndex];
            killedNode.runAction(cc.removeSelf(true));
            this.lstKilledNode.push(killedNode);  //记录被杀的棋子

            //数组变化
            var movingNode = this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex];
            this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex] = GameModel.gameModel.getNullGird();
            this.lstCurrentBoardNodes[oneMoveResult.toOneGridWithPosition.nPositionIndex] = movingNode;

            var fromBoardXY = this.gridIndexToBoardXY(oneMoveResult.fromOneGridWithPosition.nPositionIndex);
            var targetBoardXY = this.gridIndexToBoardXY(oneMoveResult.toOneGridWithPosition.nPositionIndex);
            
            this.pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,GameModel.MOVING_TYPE.KILL);
        }
        else if(oneMoveResult.nMovingType === GameModel.MOVING_TYPE.KILL_DIE){
            var killedNode = this.lstCurrentBoardNodes[oneMoveResult.toOneGridWithPosition.nPositionIndex];
            var movingNode = this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex];

            this.lstCurrentBoardNodes[oneMoveResult.fromOneGridWithPosition.nPositionIndex] = GameModel.gameModel.getNullGird();
            this.lstCurrentBoardNodes[oneMoveResult.toOneGridWithPosition.nPositionIndex] = GameModel.gameModel.getNullGird();

            var fromBoardXY = this.gridIndexToBoardXY(oneMoveResult.fromOneGridWithPosition.nPositionIndex);
            var targetBoardXY = this.gridIndexToBoardXY(oneMoveResult.toOneGridWithPosition.nPositionIndex);
            
            this.pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,GameModel.MOVING_TYPE.KILL_DIE);

            killedNode.runAction(cc.removeSelf(true));
            movingNode.runAction(cc.removeSelf(true));
            this.lstKilledNode.push(killedNode);  //记录同归于尽的两个的棋子
            this.lstKilledNode.push(movingNode); 
        }
    },

    hidePieceToShow(fromOneGridWithPosition) {   //棋子暗翻明
        // console.log("hidePieceToShow(), oneGridWithPosition =", fromOneGridWithPosition);pieceUpAction

        fromOneGridWithPosition.oneGrid.nShowHide = GameModel.PieceState.Show;
        var spriteFrame = this.getSpriteFrameOfOneGrid(fromOneGridWithPosition.oneGrid);

        let node = this.lstCurrentBoardNodes[fromOneGridWithPosition.nPositionIndex];
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        // console.log("222222222222222222222222",_node)
        // this.animation.piecesReversal(_node, spriteFrame);
        // _node.piecesId = spriteFrame._name;
        let boardXY = this.gridIndexToBoardXY(fromOneGridWithPosition.nPositionIndex);
        this.animation.hidePieceToShow(boardXY);

        // console.log("1111111111111111111111111111",spriteFrame)
        return spriteFrame._name;
    },

    pieceUpAction(index){ //选中棋子
        let node = this.lstCurrentBoardNodes[index];
        let boardXY = this.gridIndexToBoardXY(index);
        // node.runAction(cc.scaleTo(0.2, 1.7));
        this.animation.pieceUpAction(node,boardXY);

    },
    pieceDownAction(index){ //棋子不移动的缩小
        let node = this.lstCurrentBoardNodes[index];
        // node.runAction(cc.scaleTo(0.2, 1.5));
        this.animation.pieceDownAction(node);

    },

    pieceDownBeforeMoveAction(index){  //棋子移动之前的缩小
        let node = this.lstCurrentBoardNodes[index];
        this.animation.pieceDownBeforeMoveAction(node);
    },
    /*
    *移动三种不同情况 音效不同
    *1.移动到空格
    *2.吃子pieceMoveAction
    *3.同归于尽
    */
    pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,nMovingType){
        this.animation.pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,nMovingType)
        // movingNode.runAction(cc.moveTo(0.3, targetBoardXY))  //cc.jumpTo 用跳跃的方式移动到目标位置。  20  1
    },
    gridIndexToBoardXY(nGridIndex) {  //index 转 xy 坐标

        var gridXY = GameModel.gameModel.gridIndexToGridXY(nGridIndex);
        // console.log("gridXY =", gridXY);
        var x = gridXY.x * this.nOneGridWidth + this.nOneGridWidth / 2 - this.node.getContentSize().width / 2;
        var y = gridXY.y * this.nOneGridHeight + this.nOneGridHeight / 2 - this.node.getContentSize().height / 2;
        // console.log("node.x =", node.x, ", node.y =", node.y);
        return new cc.v2(x, y);
    },
    // update (dt) {},
});
