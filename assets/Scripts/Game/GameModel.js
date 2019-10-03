   
   
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
            { name: "炸弹", id: 0, amount: 2},
            { name: "司令", id: 1, amount: 1},
            { name: "军长", id: 2, amount: 1},
            { name: "师长", id: 3, amount: 2},
            { name: "旅长", id: 4, amount: 2},
            { name: "团长", id: 5, amount: 2},
            { name: "营长", id: 6, amount: 2}, 
            { name: "连长", id: 7, amount: 3}, 
            { name: "排长", id: 8, amount: 3}, 
            { name: "工兵", id: 9, amount: 3}, 
            { name: "地雷", id: 10, amount: 3}, 
            { name: "军旗", id: 11, amount: 1}, 
        ],
        PieceState = {
            Show: 1,
            Hide: 0,
        },

        Board = {
            Width: 5,
            Height: 13,
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

//构造函数
    constructor() {

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
            { y: 2, x: 0 },                     { y: 2, x: 2 },                     { y: 2, x: 4 },
            { y: 3, x: 0 },   { y: 3, x: 1 },                     { y: 3, x: 3 },   { y: 3, x: 4 },
            { y: 4, x: 0 },                     { y: 4, x: 2 },                     { y: 4, x: 4 },
            { y: 5, x: 0 },   { y: 5, x: 1 },   { y: 5, x: 2 },   { y: 5, x: 3 },   { y: 5, x: 4 },
            { y: 7, x: 0 },   { y: 7, x: 1 },   { y: 7, x: 2 },   { y: 7, x: 3 },   { y: 7, x: 4 },
            { y: 8, x: 0 },                     { y: 8, x: 2 },                     { y: 8, x: 4 },
            { y: 9, x: 0 },   { y: 9, x: 1 },                     { y: 9, x: 3 },   { y: 9, x: 4 },
            { y: 10, x: 0 },                     { y: 10, x: 2 },                     { y: 10, x: 4 },
            { y: 11, x: 0 },   { y: 11, x: 1 },   { y: 11, x: 2 },   { y: 11, x: 3 },   { y: 11, x: 4 },
            { y: 12, x: 0 },   { y: 12, x: 1 },   { y: 12, x: 2 },   { y: 12, x: 3 },   { y: 12, x: 4 },
        ]

        return trueBoard[nGridIndex];
        // return { x: 0, y: 0 };
    }

}

export default GameModel;