import Util from "../Utils/Util";
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
   
   /* 存在棋子的data
    * pos: 在棋盘上的位置，与棋盘矩阵对应
    * role: 角色号码
    *       0-炸弹 1-司令 2-军长 3-师长 4-旅长 5-团长 6-营长 7-连长 8-排长 9-工兵 10-地雷 11-军旗
    * group: 0-黑方 1-红方
    * status: 是否已揭开 0-未揭 1-揭开
    * */

const   PLAYER_COLOR_RED = "RED",
        PLAYER_COLOR_BLACK = "BLACK",
        Pieces = [
            //TODO: 炸弹吃子 === 同归于尽
            { name: "炸弹", id: 0, amount: 2, kill: {"0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1 } },
            { name: "司令", id: 1, amount: 1, kill: {"1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } },
            { name: "军长", id: 2, amount: 1, kill: {"2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } },
            { name: "师长", id: 3, amount: 2, kill: {"3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } },
            { name: "旅长", id: 4, amount: 2, kill: {"4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } },
            { name: "团长", id: 5, amount: 2, kill: {"5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } },
            { name: "营长", id: 6, amount: 2, kill: {"6": 1, "7": 1, "8": 1, "9": 1, "11": 1 } }, 
            { name: "连长", id: 7, amount: 3, kill: {"7": 1, "8": 1, "9": 1, "11": 1 } }, 
            { name: "排长", id: 8, amount: 3, kill: {"8": 1, "9": 1, "11": 1 } }, 
            { name: "工兵", id: 9, amount: 3, kill: {"9": 1, "10": 1, "11": 1  } }, 
            { name: "地雷", id: 10, amount: 3, kill: {} }, 
            { name: "军旗", id: 11, amount: 1, kill: {} }, 
        ],
        PieceState = {
            Show: 1,
            Hide: 0,
        },

        Board = {
            Width: 5,
            Height: 13,
        },

        MOVING_TYPE = {
            SHOW: 1,
            MOVE: 2,
            KILL: 3,
            KILL_DIE:4,   //同归于尽
        },
        NULL_PIECE = -1,  //无棋子
        MOUNTAIN = -2,//山界和前线

        Filed = [11,13,17,21,23,41,43,47,51,53],   //大本营位置

        Protect = [0,1,11,13,17,21,23,41,43,47,51,53,61,63], //大本营和行营 安全岛
        //六条铁路
        leftRailway = [5,10,15,20,25,35,40,45,50,55],
        rightRailway = [9,14,19,24,29,39,44,49,54,59],
        midRailway1 = [5,6,7,8,9],
        midRailway2 = [25,26,27,28,29],
        midRailway3 = [35,36,37,38,39],
        midRailway4 = [55,56,57,58,59],

        //行棋step对象
        Piece_step = {
            "5": leftRailway.concat(midRailway1, [0,11]),
            "25": leftRailway.concat(midRailway2, 21),
            "9": rightRailway.concat(midRailway1, [4,13]),
            "29": rightRailway.concat(midRailway2, 23),
            "35": leftRailway.concat(midRailway3, 41),
            "55": leftRailway.concat(midRailway4, [51,60]),
            "39": rightRailway.concat(midRailway3, 43),
            "59": rightRailway.concat(midRailway4, [53,64]),

            "10": leftRailway.concat(11),
            "15": leftRailway.concat([11,16,21]),
            "20": leftRailway.concat(21),
            "14": rightRailway.concat(13),
            "19": rightRailway.concat([13,18,23]),
            "24": rightRailway.concat(23),

            "40": leftRailway.concat(41),
            "45": leftRailway.concat([41,46,51]),
            "50": leftRailway.concat(51),
            "44": rightRailway.concat(43),
            "49": rightRailway.concat([43,48,53]),
            "54": rightRailway.concat(53),

            "6": midRailway1.concat([1,11]),
            "7": midRailway1.concat([2,11,12,13]),
            "8": midRailway1.concat([3,13]),
            "26": midRailway2.concat(21),
            "27": midRailway2.concat([21,22,23,37]),
            "28": midRailway2.concat(23),

            "36":  midRailway3.concat(41),
            "37":  midRailway3.concat([27,41,42,43]),
            "38":  midRailway3.concat(43),
            "56":  midRailway3.concat(51),
            "57":  midRailway3.concat([51,52,53,62]),
            "58":  midRailway3.concat(53),

            "0": [1,5],
            "1": [0,2,6],
            "2": [1,3,7],
            "3": [2,4,8],
            "4": [3,9],
            "11": [5,6,7,10,12,15,16,17],
            "12": [7,11,13,17],
            "13": [7,8,9,12,14,17,18,19],
            "16": [11,15,17,21],
            "17": [11,12,13,16,18,21,22,23],
            "18": [13,17,19,23],
            "21": [15,16,17,20,22,25,26,27],
            "22": [17,21,23,27],
            "23": [17,18,19,22,24,27,28,29],
            
            "41": [35,36,37,40,42,45,46,47],
            "42": [37,41,43,47],
            "43": [37,38,39,42,44,47,48,49],
            "46": [41,45,47,51],
            "47": [41,42,43,46,48,51,52,53],
            "48": [43,47,49,53],
            "51": [45,46,47,50,52,55,56,57],
            "52": [47,51,53,57],
            "53": [47,48,49,52,54,27,58,59],
            "60": [55,61],
            "61": [56,60,62],
            "62": [57,61,63],
            "63": [58,62,64],
            "64": [59,63]

        }
        

//-注意上面格式，极其容易出错--//

var gameModel = null;

class GameModel {

//TODO:理解 调用 方法 GameModel.gameModel ---->
    static get gameModel() {               //设计模式之单例模式  https://www.cnblogs.com/binaway/p/8889184.html
        if (gameModel === null) {
            gameModel = new GameModel();
            // console.log("new GameModel()");
        }
        return gameModel;
    }
    static get Board() {  //当 GameModel.Board.Width;时 返回 上面定义的Board
        return Board;
    }
    static get PieceState() {
        return PieceState;
    }
    static get Filed() {
        return Filed;
    }
    static get Pieces() {
        return Pieces;
    }
    static get MOVING_TYPE() {
        return MOVING_TYPE;
    }
    static get NULL_PIECE() {
        return NULL_PIECE;
    }

//构造函数
    constructor() {
        let that = this;

        this.OneGrid = (function() {
            function OneGrid(nShowHide, strPieceColor, nPieceId) {
                this.nShowHide = nShowHide;
                this.strPieceColor = strPieceColor;
                this.nPieceId = nPieceId;
            }

            OneGrid.prototype.clone = function() {
                return new OneGrid(this.nShowHide, this.strPieceColor, this.nPieceId);
            };

            return OneGrid;
        })();


         //翻转棋子时：
        //oneMove = new GameModel.gameModel.OneMove(nClickPieceIndex, null);
        
        this.OneMove = (function() {
            function OneMove(nFromIndex, nToIndex) {
                this.nFromIndex = nFromIndex;
                this.nToIndex = nToIndex;
            }
        //prototype 属性使您有能力向对象添加属性和方法。  https://www.w3school.com.cn/jsref/jsref_prototype_array.asp
            // OneMove.prototype.clone = function() {
            //     return new OneMove(this.nFromIndex, this.nToIndex);
            // };

            OneMove.prototype.toString = function() {
                // console.log("执行clone--------")
                // console.log("this.nFromIndex =", this.nFromIndex, ", that.lstCurrentBoard[this.nFromIndex] =", that.lstCurrentBoard[this.nFromIndex]);
                var strPieceColor = that.lstCurrentBoard[this.nFromIndex].strPieceColor;  //strPieceColor 选中棋子的颜色
                // console.log("strPieceColor:"+strPieceColor)
                if (that.lstCurrentBoard[this.nFromIndex].nPieceId === NULL_PIECE) {
                    var strPiece = "NULL_PIECE";
                } else {
                    var strPiece = GameModel.Pieces[that.lstCurrentBoard[this.nFromIndex].nPieceId].name;
                }

                var fromGridXY = that.gridIndexToGridXY(this.nFromIndex);
                var toGridXY = that.gridIndexToGridXY(this.nToIndex);

                var strOneMove = strPieceColor + " " + strPiece + " [" + fromGridXY.x + "," + fromGridXY.y + "] -> [" + toGridXY.x + "," + toGridXY.y + "]";
                return strOneMove;
            };
            // console.log("执行测试")
            return OneMove;
        })();

        this.MoveResult = (function() {
            function MoveResult() {
                this.nMovingType = 0;
                this.fromOneGridWithPosition = null;
                this.toOneGridWithPosition = null;
            }

            return MoveResult;
        })();


        this.OneGridWithPosition = (function() {
            function OneGridWithPosition(nPositionIndex, oneGrid) {
                this.nPositionIndex = nPositionIndex;
                this.oneGrid = oneGrid;
            }

            return OneGridWithPosition;
        })();
    }

    init() {
        this.lstCurrentBoard = [];

        //玩家颜色
        var PLAYER_COLORS = [];
        PLAYER_COLORS.push(PLAYER_COLOR_RED);
        PLAYER_COLORS.push(PLAYER_COLOR_BLACK);

        //生成棋子
        for (var i = 0; i < PLAYER_COLORS.length; i++) {
            var playerColor = PLAYER_COLORS[i];

            for (var j = 0; j < Pieces.length; j++) {
                var piece = Pieces[j];

                for (var k = 0; k < piece.amount; k++) {
                    var oneGrid = new this.OneGrid(PieceState.Hide, playerColor, piece.id);
                    this.lstCurrentBoard.push(oneGrid);
                    console.log("oneGrid =", oneGrid);
                }
            }
        }
        // 为什么先打印后 后洗牌 this.lstCurrentBoard 会改变 ？  
        // 在打印 某些 较长对象的时候 ，可能 会先执行下一行  。-------> 解决方法 使用 JSON.stringify()方法转换格式 打印。
        // console.log("GameModel, this.lstCurrentBoard =", JSON.stringify(this.lstCurrentBoard));
        this.lstCurrentBoard = this.shuffle(this.lstCurrentBoard);  //洗牌方法


        // console.log("GameModel, this.lstCurrentBoard =", JSON.stringify(this.lstCurrentBoard));  
       

        //在棋盘 行营位置 加入 空棋子 id -1
        var nullGrid = new this.OneGrid(null,null,NULL_PIECE);
        // console.log("nullGrid = :",nullGrid);
        for(var i = 0; i < Filed.length/2; i++)
        {
            var filed = Filed[i];
            console.log("filed xxxxxxxxxxxxxxxxxx",filed)
            this.lstCurrentBoard.splice(filed, 0, nullGrid);
        }

         //在棋盘 "前线 && 山界"位置 加入 空棋子 id -2
        nullGrid = new this.OneGrid(null,null,MOUNTAIN);
         for(var i = 0; i < 5; i++)
         {
             this.lstCurrentBoard.splice(30, 0, nullGrid);
         }
        
        nullGrid = new this.OneGrid(null,null,NULL_PIECE);
        for(var i = Filed.length/2; i < Filed.length; i++)
        {
            var filed = Filed[i];
            console.log("filed xxxxxxxxxxxxxxxxxx",filed)
            this.lstCurrentBoard.splice(filed, 0, nullGrid);
        }
        console.log("GameModel, this.lstCurrentBoard =", this.lstCurrentBoard);  
      
    }
/*
* Math.random()  [0，1)
* Math.floor   向下取整
*/
    shuffle(array) {   //洗牌 打乱
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            
            //针对每array每一个元素 执行一次 与随机的另一个元素 进行位置交换
        }

        return array;
    }


    getCurrentBoard() {
        return this.lstCurrentBoard;
    }

    gridIndexToGridXY(nGridIndex) {
        var trueBoard = [
            { y: 0, x: 0 },   { y: 0, x: 1 },   { y: 0, x: 2 },   { y: 0, x: 3 },   { y: 0, x: 4 },
            { y: 1, x: 0 },   { y: 1, x: 1 },   { y: 1, x: 2 },   { y: 1, x: 3 },   { y: 1, x: 4 },
            { y: 2, x: 0 },   { y: 2, x: 1 },   { y: 2, x: 2 },   { y: 2, x: 3 },   { y: 2, x: 4 },
            { y: 3, x: 0 },   { y: 3, x: 1 },   { y: 3, x: 2 },   { y: 3, x: 3 },   { y: 3, x: 4 },
            { y: 4, x: 0 },   { y: 4, x: 1 },   { y: 4, x: 2 },   { y: 4, x: 3 },   { y: 4, x: 4 },
            { y: 5, x: 0 },   { y: 5, x: 1 },   { y: 5, x: 2 },   { y: 5, x: 3 },   { y: 5, x: 4 },

            { y: 6, x: 0 },   { y: 6, x: 1 },   { y: 6, x: 2 },   { y: 6, x: 3 },   { y: 6, x: 4 },

            { y: 7, x: 0 },   { y: 7, x: 1 },   { y: 7, x: 2 },   { y: 7, x: 3 },   { y: 7, x: 4 },
            { y: 8, x: 0 },   { y: 8, x: 1 },   { y: 8, x: 2 },   { y: 8, x: 3 },   { y: 8, x: 4 },
            { y: 9, x: 0 },   { y: 9, x: 1 },   { y: 9, x: 2 },   { y: 9, x: 3 },   { y: 9, x: 4 },
            { y: 10, x: 0 },   { y: 10, x: 1 },   { y: 10, x: 2 },   { y: 10, x: 3 },   { y: 10, x: 4 },
            { y: 11, x: 0 },   { y: 11, x: 1 },   { y: 11, x: 2 },   { y: 11, x: 3 },   { y: 11, x: 4 },
            { y: 12, x: 0 },   { y: 12, x: 1 },   { y: 12, x: 2 },   { y: 12, x: 3 },   { y: 12, x: 4 },
        ]
        if(nGridIndex != null)
        {
            return trueBoard[nGridIndex];
        }
        else //nGridIndex === null
            // return trueBoard[0];
            return { x: null, y: null };
    }

    //根据 棋子index 返回棋子
    getOneGrid(nClickPieceIndex) {  
        // console.log("getOneGrid(), this.lstCurrentBoard =", this.lstCurrentBoard);  
        return this.lstCurrentBoard[nClickPieceIndex];
    }


    //检验走子是否符合规则
    verifyMove(oneMove) {

        var fromOneGrid = this.getOneGrid(oneMove.nFromIndex);
        // console.log("verifyMove(), fromOneGrid =", fromOneGrid);

        // 拿起暗子
        if (fromOneGrid.nShowHide === PieceState.Hide) {
            return true;
        }
        // console.log(oneMove);

        //检验行棋 是否超出边界
        var verify_GirdInBoard = this.verifyMove_GirdInBoard(oneMove);
        if(verify_GirdInBoard === false){
            return false;
        }

        //一个明棋 移动到另一个位置 （可能存在其他棋子）
        //1.判断是否可移动到  2.判断是否为
        if(oneMove.nFromIndex != null && oneMove.nToIndex != null)
        {
            var passable = this.verifyMove_Passable(oneMove.nFromIndex,oneMove.nToIndex);

            /*没有阻挡 可以通行时
            * 判断 :
            * 1.目标点有棋子 
            *  1.1 是明棋 --> 比大小  大才能吃
            *  1.2是暗棋 --> 不能吃暗子
            * 
            * 2.目标点没有棋子 --> 可以移动
            */
            if(passable){ //道路通畅 判断击杀情况
                return this.verifyMove_canHit(oneMove.nFromIndex,oneMove.nToIndex);
            }
            else{  //有棋子阻挡不可通行
                console.log("有棋子阻挡不可通行")
                return false;
            }
        }

    }

    //路径通畅(passable)  后攻击检测
    verifyMove_canHit(nFromIndex,nToIndex){
        // var canKill = false;
        //出发地 和 目的地 的两个棋子
        var fromGird = this.getOneGrid(nFromIndex);
        var toGird = this.getOneGrid(nToIndex);

        //可以移动到空格
        if(toGird.nPieceId === NULL_PIECE){   
            return true;
        }
        //目的地有棋子
        else{
            //攻击棋子在行营或大本营 安全岛内
            if(Util.inArray(nToIndex,Protect) != -1){
                console.log("不能吃安全岛内的棋子")
                return false;
            }
            //不能吃暗子
            else if(toGird.nShowHide === PieceState.Hide){
                console.log("不能吃暗子")
                return false;
            }
            else{
                //不能吃自己的棋子
                if(toGird.strPieceColor === fromGird.strPieceColor){
                    console.log("不能吃掉自己的棋子")
                    return false;
                }
                //对方棋子
                else{
                    if(this.canKill(fromGird.nPieceId,toGird.nPieceId,toGird.strPieceColor)){
                        console.log("比对方棋子大 可以击杀")
                        return true;
                    }
                    else{
                        console.log("吃不掉")
                        return false;
                    }
                }
            }
        }
       

    }
    //是否可以击杀
    canKill(nKillingPiece, nKilledPiece,toGirdColor){
        //如果是炸弹
        if((Pieces[nKillingPiece].name === "炸弹" || Pieces[nKilledPiece].name === "炸弹")&& Pieces[nKilledPiece].name != "军旗"){
            console.log("其中一个棋子为炸弹 TODO >>")
            return true;
        }
        else if(nKillingPiece === nKilledPiece){
            console.log("两个相同棋子，同归于尽")
            return true;
        }
        else{
            console.log("比大小:")   //抬棋约束
            if(Pieces[nKilledPiece].name === "军旗"){
                var mineAmount = this.getMinesByColor(toGirdColor)
                console.log("敌方剩余地雷个数：",mineAmount)
                if(mineAmount != 0){
                    return false;   //地雷还没有挖完 ，不可以抬军旗
                }
                else{
                    return true;
                }
               
            }
            else{
                return nKilledPiece in Pieces[nKillingPiece].kill;
            }
        }

    }
    verifyMove_Passable(nFromIndex,nToIndex){
        console.log("verifyMove_Passable:",nFromIndex,nToIndex)
        var passable = false;

        //检测无阻挡可到达的位置
        for(var i = 0; i < Piece_step[nFromIndex].length; i++){
            if(Piece_step[nFromIndex][i] === nToIndex){
                passable = true;
            }
        }

        //限制垂直铁路上棋子的行走，存在 midGird 中间棋子的阻挡 则无法通过
        var verRailway = [leftRailway,rightRailway];
        for(var i = 0;i < verRailway.length;i++)
        {
            if(Util.inArray(nFromIndex,verRailway[i]) > -1 && Util.inArray(nToIndex,verRailway[i]) > -1){
                if(nFromIndex > nToIndex){
                    var temp = nFromIndex;
                    nFromIndex = nToIndex;
                    nToIndex= temp;
                }
                for(var j = Number(Util.inArray(nFromIndex,verRailway[i])) + 1; j<Util.inArray(nToIndex,verRailway[i]);j++){
                    console.log("j++++++",j,"search +++++++++",verRailway[i][j]);
                    var midGird = this.getOneGrid(verRailway[i][j]);
                    if(midGird.nPieceId >= 0){
                        passable = false;   //TODO:可以优化 ，有阻挡后直接返回 不再检测 阻挡后面的棋子
                        // console.log("有棋子阻挡")
                    }
                }
            }
        }

        //限制水平铁路上棋子的行走，存在 midGird 中间棋子的阻挡 则无法通过
        var horRailway = [midRailway1,midRailway2,midRailway3,midRailway4];
        for(var i = 0;i < horRailway.length;i++)
        {
            if(Util.inArray(nFromIndex,horRailway[i]) > -1 && Util.inArray(nToIndex,horRailway[i]) > -1){
                if(nFromIndex > nToIndex){
                    var temp = nFromIndex;
                    nFromIndex = nToIndex;
                    nToIndex= temp;
                }
                for(var j = Number(Util.inArray(nFromIndex,horRailway[i])) + 1; j<Util.inArray(nToIndex,horRailway[i]);j++){
                    console.log("j++++++",j,"search +++++++++",horRailway[i][j]);
                    var midGird = this.getOneGrid(horRailway[i][j]);
                    if(midGird.nPieceId >= 0){
                        passable = false;
                        // console.log("有棋子阻挡")
                    }
                }
            }
        }

        console.log("passable:",passable);
        return passable;
    }
    verifyMove_GirdInBoard(oneMove){  //检验行棋 是否超出边界
        var girdInBoard = true;
        if(oneMove.nFromIndex < 0 && oneMove.nFromIndex > Board.Width * Board.Height){
            girdInBoard = false;
        }
        if(oneMove.nToIndex < 0 && oneMove.nToIndex > Board.Width * Board.Height){
            girdInBoard = false;
        }
        return girdInBoard;
    }

    playerMove(oneMove){
        var moveResult = new this.MoveResult();

        // 选择要走的棋子
        var selectedGrid = this.lstCurrentBoard[oneMove.nFromIndex];
        console.log("selectedGrid",selectedGrid);

        // 返回棋子的变化
        var fromOneGird = selectedGrid.clone();
        moveResult.fromOneGridWithPosition = new this.OneGridWithPosition(oneMove.nFromIndex, fromOneGird);
       


        // 暗棋
        if (selectedGrid.nShowHide === PieceState.Hide) {
            // 翻明
            if (oneMove.nToIndex === null) {
                selectedGrid.nShowHide = PieceState.Show;
                
                // 返回棋子的变化
                moveResult.nMovingType = MOVING_TYPE.SHOW;
                moveResult.toOneGridWithPosition = new this.OneGridWithPosition(oneMove.nFromIndex, null);
                // console.log("GameModel.playerMove(), moveResult2 =", moveResult);
            }
          
        }

        //TODO:明棋移动到目标位置

        //FIXME: 10.16

        //明棋移动到目标位置
        else{
            var targetGrid = this.lstCurrentBoard[oneMove.nToIndex];
            console.log("targetGrid:",targetGrid);

            //无棋子 直接移动
            if(targetGrid.nPieceId === NULL_PIECE){
                moveResult.nMovingType = MOVING_TYPE.MOVE;
                moveResult.toOneGridWithPosition = new this.OneGridWithPosition(oneMove.nToIndex, null);
            }
            //有棋子 同归于尽
            else if(targetGrid.nPieceId === selectedGrid.nPieceId ||Pieces[targetGrid.nPieceId].name ==="炸弹"||Pieces[selectedGrid.nPieceId].name ==="炸弹"){
                moveResult.nMovingType = MOVING_TYPE.KILL_DIE;
                var toOneGird = targetGrid.clone();
                moveResult.toOneGridWithPosition = new this.OneGridWithPosition(oneMove.nToIndex, toOneGird);
            }
            //有棋子 吃掉
            else{
                moveResult.nMovingType = MOVING_TYPE.KILL;
                var toOneGird = targetGrid.clone();
                moveResult.toOneGridWithPosition = new this.OneGridWithPosition(oneMove.nToIndex, toOneGird);
            }

            
            if(moveResult.nMovingType != MOVING_TYPE.KILL_DIE){
                this.lstCurrentBoard[oneMove.nFromIndex] = new this.OneGrid(null,null,NULL_PIECE);
                this.lstCurrentBoard[oneMove.nToIndex] = selectedGrid;   //原位置改为null ，选中棋子改到目标位置
            }else{
                 //原位置 和 目标位置都改为null
                this.lstCurrentBoard[oneMove.nFromIndex] = new this.OneGrid(null,null,NULL_PIECE);
                this.lstCurrentBoard[oneMove.nToIndex] = new this.OneGrid(null,null,NULL_PIECE);  
            }
       
        }

        console.log("GameModel.playerMove(), moveResult1 =", moveResult);
        return moveResult;
    }

    //丢硬币决定先后
    flipCoin() {
        return Math.round(Math.random());   //Math.random [0,1)  , Math.round 四舍五入
    }

    getOpponentColor(strPieceColor) {  //返回对手的颜色
        if (strPieceColor === PLAYER_COLOR_BLACK) {
            return PLAYER_COLOR_RED;
        } else if (strPieceColor === PLAYER_COLOR_RED) {
            return PLAYER_COLOR_BLACK;
        } else {
            return null;
        }
    } 
    
    getNullGird(){
        return new this.OneGrid(null,null,NULL_PIECE);
    }

    /*胜利条件:
    *不需要翻出所有棋子，只要地雷挖光，并且扛掉一方军旗即胜利；
    * 
    */
   //FIXME:似乎存在bug
    isGameOver(strPieceColor){ 
        var opponentColor = this.getOpponentColor(strPieceColor);
        var gameOver = true;
        for(var i = 0; i < this.lstCurrentBoard.length; i++){
            if(this.lstCurrentBoard[i].strPieceColor === opponentColor &&Pieces[this.lstCurrentBoard[i].nPieceId].name === "军旗"){
                gameOver = false;
                console.log(this.lstCurrentBoard[i].strPieceColor,Pieces[this.lstCurrentBoard[i].nPieceId].name,"gameover:",gameOver)
            }
        }
      
        return gameOver;

    }

    //通过颜色 获取剩余的地雷数 
    getMinesByColor(strPieceColor){
        var mineAmount = 0;
        for(var i = 0; i < this.lstCurrentBoard.length; i++){
            if(this.lstCurrentBoard[i].strPieceColor === strPieceColor && Pieces[this.lstCurrentBoard[i].nPieceId].name === "地雷"){
                mineAmount++;
            }
        }
        return mineAmount;
    }
}

export default GameModel;