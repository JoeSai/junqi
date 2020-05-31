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
            { name: "炸弹", id: 0, amount: 2, kill: {"0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1 }, score: 22 },
            { name: "司令", id: 1, amount: 1, kill: {"1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 30 },
            { name: "军长", id: 2, amount: 1, kill: {"2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 24 },
            { name: "师长", id: 3, amount: 2, kill: {"3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 22 },
            { name: "旅长", id: 4, amount: 2, kill: {"4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 20 },
            { name: "团长", id: 5, amount: 2, kill: {"5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 18 },
            { name: "营长", id: 6, amount: 2, kill: {"6": 1, "7": 1, "8": 1, "9": 1, "11": 1 }, score: 16 }, 
            { name: "连长", id: 7, amount: 3, kill: {"7": 1, "8": 1, "9": 1, "11": 1 }, score: 14 }, 
            { name: "排长", id: 8, amount: 3, kill: {"8": 1, "9": 1, "11": 1 }, score: 12 }, 
            { name: "工兵", id: 9, amount: 3, kill: {"9": 1, "10": 1, "11": 1  }, score: 10 }, 
            { name: "地雷", id: 10, amount: 3, kill: {}, score: 18 }, 
            { name: "军旗", id: 11, amount: 1, kill: {}, score: 1000 }, 
        ],
        PieceState = {
            Show: 1,
            Hide: 0,
        },

        Board = {
            Width: 5,
            Height: 13,
        },

        //游戏结束状态
        GameOver_State = {
            Go:0,
            Win:1,
            Draw:2,
            Lose:3
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

        Protect = [11,13,17,21,23,41,43,47,51,53], //行营 安全岛   //大本营 因为在开始时候默认有棋子 会影响抬军棋、挖地雷 故不做保护
        //六条铁路
        leftRailway = [5,10,15,20,25,35,40,45,50,55],
        rightRailway = [9,14,19,24,29,39,44,49,54,59],
        midRailway1 = [5,6,7,8,9],
        midRailway2 = [25,26,27,28,29],
        midRailway3 = [35,36,37,38,39],
        midRailway4 = [55,56,57,58,59],

        //clearRepeat()  数组去重 
        allRailway = Util.clearRepeat(leftRailway.concat(rightRailway).concat(midRailway1).concat(midRailway2).concat(midRailway3).concat(midRailway4)),

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
            "56":  midRailway4.concat(51,61),
            "57":  midRailway4.concat([51,52,53,62]),
            "58":  midRailway4.concat([53,63]),

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
            "53": [47,48,49,52,54,57,58,59],
            "60": [55,61],
            "61": [56,60,62],
            "62": [57,61,63],
            "63": [58,62,64],
            "64": [59,63]

        }
//----------A star -----------

var isUserAStar = true;
        //可能要走的路线
var	openArr = [];
		//已经关闭的路线
var	closeArr = [];
var	map = [
			
		];
		//最终线路数组
var resultParent = [];
var endLi;
var beginLi;

var AStarTime = 0;
        

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
    static get PLAYER_COLOR_RED() {
        return PLAYER_COLOR_RED;
    }

    static get PLAYER_COLOR_BLACK() {
        return PLAYER_COLOR_BLACK;
    }
    static get GameOver_State() {
        return GameOver_State;
    }
    // static get openArr(){
    //     return openArr;
    // }
    // static get closeArr(){
    //     return closeArr;
    // }
    // static get map(){
    //     return map;
    // }
    // static get resultParent(){
    //     return resultParent;
    // }
    


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
            OneMove.prototype.clone = function() {
                return new OneMove(this.nFromIndex, this.nToIndex);
            };

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

    //克隆局面
    clone() {
        var gameModel = new GameModel();

        gameModel.lstCurrentBoard = [];
    
        for (var i = 0; i < this.lstCurrentBoard.length; i++) {
            if (this.lstCurrentBoard[i] === null) {
                gameModel.lstCurrentBoard[i] = null;
            } else {
                gameModel.lstCurrentBoard.push(this.lstCurrentBoard[i].clone());
            }
        }

        return gameModel;
    }

    init() {
        this.lstCurrentBoard = [];
        window.lstCurrentBoard =  this.lstCurrentBoard;
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
        for(var i = 0; i < Filed.length/2; i++) //0-4 下方行营
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
        for(var i = Filed.length/2; i < Filed.length; i++)  //5-9 上方行营
        {
            var filed = Filed[i];
            console.log("filed xxxxxxxxxxxxxxxxxx",filed)
            this.lstCurrentBoard.splice(filed, 0, nullGrid);
        }
        console.log("GameModel, this.lstCurrentBoard =", this.lstCurrentBoard);  
      
    }



    //测试算法用
    initForTest() {
        this.lstCurrentBoard = [];

        //玩家颜色
        var PLAYER_COLORS = [];
        PLAYER_COLORS.push(PLAYER_COLOR_RED);
        PLAYER_COLORS.push(PLAYER_COLOR_BLACK);


        var nullGrid = new this.OneGrid(null,null,NULL_PIECE);
        var bFlag = new this.OneGrid(PieceState.Hide, PLAYER_COLOR_BLACK,11);
        var rFlag = new this.OneGrid(PieceState.Hide, PLAYER_COLOR_RED,11);
        var bEng = new this.OneGrid(PieceState.Hide, PLAYER_COLOR_BLACK,9);
        var rEng = new this.OneGrid(PieceState.Hide, PLAYER_COLOR_RED,9);

        // var bEng = new this.OneGrid(PieceState.Show, PLAYER_COLOR_RED,0);
        // var rEng = new this.OneGrid(PieceState.Show, PLAYER_COLOR_BLACK,5);
        //生成棋子
     
        
        for(var i = 0;i < 50;i++){
            this.lstCurrentBoard.push(nullGrid);
        }
        this.lstCurrentBoard[5] = bEng;
        this.lstCurrentBoard[6] = bFlag
       
        ;
        // this.lstCurrentBoard[5] = rEng;
        // this.lstCurrentBoard[6] = nullGrid;
        // this.lstCurrentBoard[7] = nullGrid;
        // this.lstCurrentBoard[8] = nullGrid;
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

        this.lstCurrentBoard[59] = rEng;
        this.lstCurrentBoard[58] = rFlag
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

    //工兵 检测 攻击
    isEngineerCanKill(nFromIndex,nToIndex){

        return this.verifyMove_canHit(nFromIndex,nToIndex)
       
    }
//-------------------------A star ---------------------------------------------

//map 1为起点 2为障碍 3为终点

    engineerAStar(nFromIndex,nToIndex){  //TODO:优化
        
        var that = this;
        console.log('起点',nFromIndex,'终点',nToIndex)
        console.log('op',openArr)

        //先判断地图是否生成成功， =>终点是否可以kill ，再判断是否存在通路。
        this.createMap(nFromIndex,nToIndex,function(status){
        
            if(status){    
                // console.log('8888888888888888888888888888888',that.openFn(nFromIndex,nToIndex))
                that.openFn(nFromIndex,nToIndex)                   
            }
            else{
              
            }
        });
        if(resultParent.length !== 0){
            return true;
        }
        else{
            return false;
        }
      
    }

    createMap(nFromIndex,nToIndex,callback){
      
        
        //重置
        map = [];
        // number 对象
        openArr = [];
        closeArr = [];
        resultParent = [];

        var status = true;

        for(let i=0 ;i<this.lstCurrentBoard.length;i++){
            map[i] = 0;
            if(Util.inArray(i,allRailway)=== -1){    //不在铁轨上 2
                map[i] = 2;
             
                closeArr.push(new Number(i));
            }
            else if(i !== nFromIndex && i !== nToIndex && this.getOneGrid(i).nPieceId !== -1){   //在铁轨上但是不是空位 2
                map[i] = 2;
               
                closeArr.push(new Number(i));
            }
        }

        
        //终点不能为障碍
        map[nFromIndex] = 1;
        // console.log(map,'11111111111',map[nToIndex]);
        // console.log('map[nToIndex]',map[nToIndex])
        if(!this.isEngineerCanKill(nFromIndex,nToIndex)){   
            status = false;
            //终点为障碍物
            map[nToIndex] = 2;
            console.log('终点为障碍物 或吃不掉')
        }else{
            map[nToIndex] = 3;
            // number 对象
            beginLi = new Number(nFromIndex);
            endLi = new Number(nToIndex);
            console.log('begin li ------------',beginLi)
            // openArr.push(beginLi);
            console.log('op before push',openArr,'nFromIndex',nFromIndex);
            openArr.push(new Number(nFromIndex));

            console.log(map,map[nToIndex]);
            console.log('op and clo arr',openArr,closeArr)
            console.log('终点为空')
        }
      

        



        typeof(callback) === "function" && callback(status);
    }

    openFn(){
    	//nodeLi 表示 当前open队列中的元素  也就是说 先去除第一个起始节点
        //shift 方法的作用： 把数组中的第一个元素删除，并且返回这个被删除的元素
        AStarTime++;
        console.log('主循环次数',AStarTime,'zzzzzzzzzzzzz',openArr.length,openArr)
		if(openArr.length == 0){
			console.log('空——---------------')
          
            return;
		}
        var nodeLi = openArr.shift();
        console.log('nodeli`````````````````',nodeLi)
		//如果nodeLi 和 endLi 一样了 那么证明已经走到目标点了 ，这个时候需要停止调用
		if(Number(nodeLi) == Number(endLi)){
            console.log('找到终点了88888888888888')
            console.log('找到路径888888888888',this.showPath());
           
            //重新设置openArr 使得计算次数从2290 -> 1169 !!!!!!!!!!!!!!!!!!!!!!
            openArr = [];   
           
            return;
        }
        //把open队列中删除的元素 添加到 close队列中
		this.closeFn(nodeLi)
		//接下来 需要找到 nodeLi 周围的节点
        this.findLi(nodeLi);
        
        openArr.sort(function(li1,li2){
            return li1.num - li2.num      //从小到大
        })

        //进行递归操作 找下一步需要走的节点 在这个过程中，也需要执行相同的步骤 那就是查找相邻的节点  但是查找出来的结果可能和上一次的重复，也就是说上一次动作已经把这个元素添加到open队列中了
		//那么就没有必要再进行push操作了  所以还需要在过滤函数中加一段代码
        this.openFn();
    }
    //评估函数
    fn(nMidIndex){
        // console.log('g',g(nowLi),'h',h(nowLi));
        return this.g(nMidIndex) + this.h(nMidIndex)
    }
    //初始点到当前节点的实际代价
    g(nMidIndex){
        //勾股定理
        var x = this.gridIndexToGridXY(nMidIndex).x - this.gridIndexToGridXY(beginLi).x ;
        var y = this.gridIndexToGridXY(nMidIndex).y - this.gridIndexToGridXY(beginLi).y ;
        return Math.sqrt(x*x+y*y)
    }

    //当前节点到目标点的实际代价
	h(nMidIndex){
		//勾股定理
        var x = this.gridIndexToGridXY(nMidIndex).x - this.gridIndexToGridXY(endLi).x ;
        var y = this.gridIndexToGridXY(nMidIndex).y - this.gridIndexToGridXY(endLi).y ;
        return Math.sqrt(x*x+y*y)
	}

    closeFn(nodeLi){
        //open队列中删除的元素 被 push到close队列中
        closeArr.push(nodeLi);
    }

    /**
	* 封装函数查找某个节点周围的节点
	*/
	findLi(nodeLi){
      
		//创建一个结果数组 把查找到的结果放到这个数组中
		var result = [];
		//循环所有的li节点 进行查找
		// for(var i=0;i<this.getCurrentBoard().length;i++){
		// 	//如果经过过滤 返回的是true 表示 这个节点不是障碍物 那么需要添加到result结果数组中
		// 	if(this.filter(i)){
                
        //         result.push(new Number(i));
        //     }
        //     console.log('result-------------------',result)
        // }
        
        for(var i=0;i<allRailway.length;i++){    //对全体轨道点  进行  过滤 =>result数组
            //如果经过过滤 返回的是true 表示 这个节点不是障碍物 那么需要添加到result结果数组中
            var railwayNode = allRailway[i];
			if(this.filter(railwayNode)){
                
                result.push(new Number(railwayNode));
            }
            // console.log('result-------------------',result)
		}
		//接下来需要在没有障碍物的结果中去找 和 当前节点相邻的节点
        //判断条件是 他们的横纵坐标的差值需要小于 等于 网格大小
        var nodeLiY = this.gridIndexToGridXY(Number(nodeLi)).y;
        var nodeLiX = this.gridIndexToGridXY(Number(nodeLi)).x;

        // console.log('findli',result,nodeLiY,nodeLiX,nodeLi)
		for(var i=0;i<result.length;i++){

            var iY = this.gridIndexToGridXY(Number(result[i])).y;
            var iX = this.gridIndexToGridXY(Number(result[i])).x;

            // console.log("ix iy ",iX,iY)

            if(Number(nodeLi)>= 25 && Number(nodeLi) <= 39 && Number(result[i])>=25 && Number(result[i])<=39)  //在中间两条铁路  考虑山界因素
            {
                // console.log('山界盘轨道')
                if( Math.sqrt((nodeLiX-iX)*(nodeLiX-iX)+(nodeLiY-iY)*(nodeLiY-iY)) < 2 || ((nodeLiX === iX) && (Math.abs(nodeLiY - iY) === 2) && (nodeLiX !== 1) && (nodeLiX !== 3)) ){
                    //这里的result[i]就是当前目标点相邻的节点  把这些节点传入到估价函数就能得到他们的估值，并且要把这些估值挂载到他们自身的一个自定义属性上
                    result[i].num = this.fn(Number(result[i]));         //FIXME:
                    result[i].parent = nodeLi;
                    //nodeLi 是当前的位置  result[i] 是当前位置相邻的点  下一次要走的位置就在这几个点中，所以给result[i]定义一个parent属性
                    //来存上一次的路径 ，最终把这些路径联系起来就是完整的路径
                    openArr.push(result[i]);
                    // console.log('parent test',result[i],result[i].parent)
                    // console.log('findli pushhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
                }
            }
            else{
                if(((nodeLiX-iX)*(nodeLiX-iX)+(nodeLiY-iY)*(nodeLiY-iY)) == 1){  //1²+0²
                    //这里的result[i]就是当前目标点相邻的节点  把这些节点传入到估价函数就能得到他们的估值，并且要把这些估值挂载到他们自身的一个自定义属性上
                    result[i].num = this.fn(Number(result[i]));         //FIXME:
                    result[i].parent = nodeLi;
                    //nodeLi 是当前的位置  result[i] 是当前位置相邻的点  下一次要走的位置就在这几个点中，所以给result[i]定义一个parent属性
                    //来存上一次的路径 ，最终把这些路径联系起来就是完整的路径
                    openArr.push(result[i]);
                    // console.log('parent test',result[i],result[i].parent)
                    // console.log('findli pushhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
                }
            }
            
			// if(Math.abs(nodeLi.offsetLeft - result[i].offsetLeft)<=21 && Math.abs(nodeLi.offsetTop - result[i].offsetTop)<=20+1 ){
			// 	//这里的result[i]就是当前目标点相邻的节点  把这些节点传入到估价函数就能得到他们的估值，并且要把这些估值挂载到他们自身的一个自定义属性上
			// 	result[i].num = fn(result[i]);
            //     console.log(result[i],'----',result[i].num);
			// 	//nodeLi 是当前的位置  result[i] 是当前位置相邻的点  下一次要走的位置就在这几个点中，所以给result[i]定义一个parent属性
			// 	//来存上一次的路径 ，最终把这些路径联系起来就是完整的路径
			// 	result[i].parent = nodeLi;
			// 	openArr.push(result[i]);
			// }
		}
    }
    filter(nodeLi){
        //循环close队列中的所有元素 与传过来的节点进行比对 如果比对成功 返回false 
        for(var i=0;i<closeArr.length;i++){
            if(nodeLi == closeArr[i]){
                return false;
            }
        }
        for(var i=0;i<openArr.length;i++){
            if(nodeLi == openArr[i]){
                return false;
            }
        }
        //如果循环完都没有匹配上 那么证明当前传过来的 li节点 并不是障碍物 
        return true;
    }
    showPath(){
        //closeArr中最后一个 就是 找到目标点的前一个位置  因为走过的位置都会被存放在closeArr中
        var lastLi = closeArr.pop();
       
        //调用findParent函数 来找上一个节点
        return this.findParent(lastLi)
        
       
    }

    /*
	* 定义一个函数来找到上一次走过的节点
	*/
			
	findParent(li){
        
        resultParent.unshift(li);
        console.log('resultParent````````````````````````qqqqqqqqq',resultParent);
        if(Number(li) == Number(beginLi)){
            return resultParent;
        }
        
		if(Number(li.parent) == Number(beginLi)){
			return resultParent;
		}
		this.findParent(li.parent);
	}







//-------------------------A star ---------------------------------------------


//----------------------------------console.log---------------------------------------

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
        

        var fromGird = this.getOneGrid(oneMove.nFromIndex);
        
        //工兵 A star ：初始位置和移动目的地都在铁路上 开关

        if(isUserAStar){
            if(oneMove.nFromIndex != null && oneMove.nToIndex != null && Pieces[fromGird.nPieceId].name === '工兵' && (Util.inArray(oneMove.nFromIndex,allRailway) != -1) && (Util.inArray(oneMove.nToIndex,allRailway) != -1)){

                if(oneMove.nToIndex !== oneMove.nFromIndex){
                    console.log('工兵 a星') //TODO:3.3 
                    return this.engineerAStar(oneMove.nFromIndex,oneMove.nToIndex);
                    
                }
                else{
                    return false;
                }
            }   
    
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
                // console.log("有棋子阻挡不可通行")
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
            //攻击棋子在行营 安全岛内
            if(Util.inArray(nToIndex,Protect) != -1){
                // console.log("不能吃安全岛内的棋子")
                return false;
            }
            //不能吃暗子
            else if(toGird.nShowHide === PieceState.Hide){
                // console.log("不能吃暗子")
                return false;
            }
            else{
                //不能吃自己的棋子
                if(toGird.strPieceColor === fromGird.strPieceColor){
                    // console.log("不能吃掉自己的棋子")
                    return false;
                }
                //对方棋子
                else{
                    if(this.canKill(fromGird.nPieceId,toGird.nPieceId,toGird.strPieceColor)){
                        // console.log("比对方棋子大 可以击杀")
                        return true;
                    }
                    else{
                        // console.log("吃不掉")
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
            // console.log("其中一个棋子为炸弹 TODO >>")
            return true;
        }
        else if(nKillingPiece === nKilledPiece){
            // console.log("两个相同棋子，同归于尽")
            return true;
        }
        else{
            // console.log("比大小:")   //抬棋约束
            if(Pieces[nKilledPiece].name === "军旗"){
                var mineAmount = this.getMinesByColor(toGirdColor)
                // console.log("敌方剩余地雷个数：",mineAmount)
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
    verifyMove_Passable(nFromIndex,nToIndex){  //非工兵
        // console.log("verifyMove_Passable:",nFromIndex,nToIndex)
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
                    // console.log("j++++++",j,"search +++++++++",verRailway[i][j]);
                    var midGird = this.getOneGrid(verRailway[i][j]);
                    if(midGird.nPieceId >= 0){
                        passable = false;   //TODO:可以优化 ，有阻挡后直接返回 不再检测 阻挡后面的棋子 break
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
                    // console.log("j++++++",j,"search +++++++++",horRailway[i][j]);
                    var midGird = this.getOneGrid(horRailway[i][j]);
                    if(midGird.nPieceId >= 0){
                        passable = false;
                        // console.log("有棋子阻挡")
                    }
                }
            }
        }

        // console.log("passable:",passable);
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
        // console.log("selectedGrid",selectedGrid);

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
            // console.log("targetGrid:",targetGrid);

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

        // console.log("GameModel.playerMove(), moveResult1 =", moveResult);
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


   /*
    本方移动一步后 进行胜负判断：

    //本方无损失
    1.	抬走对方军棋 --------win
    2.	对方无可移动的子、无暗棋可翻 ------win
    3.	对方无可移动的子、有暗棋可翻 (但是暗棋中无对方可以移动的棋子) ------win

    //本方有损失
    1.最后一个可移动的棋子 与敌方棋子同归于尽，对方还有棋子（可移动） ----lose
    2.最后一个可移动的棋子 与敌方棋子同归于尽，对方也没有可移动的棋子了---- draw

    //步数问题 TODO

    //其他情况 游戏继续
   */
    isGameOver(strPieceColor){ ;
        if(strPieceColor === undefined){//还未确定颜色
           return GameOver_State.Go;
        }
        var opponentColor = this.getOpponentColor(strPieceColor);
        var has_flag = false; //军旗是否还在
        for(var i = 0; i < this.lstCurrentBoard.length; i++){
            if(this.lstCurrentBoard[i].strPieceColor === opponentColor &&Pieces[this.lstCurrentBoard[i].nPieceId].name === "军旗"){
                has_flag = true;
                break;
                // console.log(this.lstCurrentBoard[i].strPieceColor,Pieces[this.lstCurrentBoard[i].nPieceId].name,"gameover:",gameOver)
            }
        }
        //1.	抬走对方军棋 --------win
        if(!has_flag){
            console.log("111 抬走对方军棋 --------win")
            return GameOver_State.Win;
        }

        // console.log("明棋是否可移动？",this.isOnePlayerHasPossibleMove(strPieceColor),"暗棋是否有必要翻？",this.isOnePlayerHasCanMovePieces(strPieceColor))
        //2.	对方无可移动的子、无暗棋可翻 ------win
        //3.	对方无可移动的子、有暗棋可翻 (但是暗棋中无对方可以移动的棋子) ------win
        //5. 最后一个可移动的棋子 与敌方棋子同归于尽，对方也没有可移动的棋子了--
        if(this.isOnePlayerHasPossibleMove(opponentColor) === false && this.isOnePlayerHasCanMovePieces(opponentColor) === false){
            if(this.isOnePlayerHasPossibleMove(strPieceColor) === false && this.isOnePlayerHasCanMovePieces(strPieceColor) === false){
                // console.log("555 双方 无可移动的棋子、没有翻棋的必要（能移动的已经被吃光了）")
                return GameOver_State.Draw;
            }
            else{
                // console.log(" 2233 无可移动的棋子、没有翻棋的必要（能移动的已经被吃光了）")
                return GameOver_State.Win;
            }
           
        }
        //4.（！本方！）最后一个可移动的棋子 与敌方棋子同归于尽 对方还有棋子（可移动)
        if(this.isOnePlayerHasPossibleMove(strPieceColor) === false && this.isOnePlayerHasCanMovePieces(strPieceColor) === false){
            // console.log(" 4 本方 无可移动的棋子、没有翻棋的必要（能移动的已经被吃光了）")
            return GameOver_State.Lose;
        }
      
       
        return GameOver_State.Go;

    }

    //通过颜色 查看暗棋中 是否还有 可以移动的棋子 （走投无路时候，是否还有必要翻棋）
    isOnePlayerHasCanMovePieces(strPieceColor){
        var hasCanMovePieces = false;
        for(var i = 0; i < this.lstCurrentBoard.length; i++){
            if(this.lstCurrentBoard[i].strPieceColor === strPieceColor && this.lstCurrentBoard[i].nShowHide === PieceState.Hide &&this.lstCurrentBoard[i].nPieceId < 10){
               hasCanMovePieces = true;
               break;       //发现存在 则 停止查询
            }
        }
        return hasCanMovePieces;
    }

    //通过颜色 查看暗棋中 是否还有 可以移动的棋子 （是否被逼得走投无路）
    isOnePlayerHasPossibleMove(strPieceColor){

        var hasPossibleMove = false;
        //所有可以移动的 本方明棋
        var lstPossibleMovePieces = this.getOnePlayerPossibleMovePieces(strPieceColor,true);
        for (var i = 0; i < lstPossibleMovePieces.length; i++) {
            var oneGridWithPosition = lstPossibleMovePieces[i];
            var lstPossibleMoves = this.getPossibleMovesQuickReturn(oneGridWithPosition.nPositionIndex);   //FIXME:
            if(lstPossibleMoves.length > 0){
                hasPossibleMove = true;  //发现存在 有可以移动的明棋 则停止查询
                break;
            }
        }
        return hasPossibleMove;
    }

    getPossibleMovesQuickReturn(nGridIndex){       //用于判断isGameOver 中的 getPossibleMoves的优化
        console.log('getPossibleMoves')

        var oneGrid = this.lstCurrentBoard[nGridIndex];
        var lstPossibleMoves = [];

        // 暗棋只能翻成明棋
        if (oneGrid.nShowHide == PieceState.Hide) {
            lstPossibleMoves.push(new this.OneMove(nGridIndex, null));
        }
        else if(Pieces[oneGrid.nPieceId].name === "军旗" || Pieces[oneGrid.nPieceId].name === "地雷" ){
            // console.log("AI 不能移动军旗、地雷");
        }
        // 明棋只能移动
        else if(Pieces[oneGrid.nPieceId].name === "工兵" && (Util.inArray(nGridIndex,allRailway) != -1)){  //工兵 且在铁道上
            var allRailwayAndOther = Util.clearRepeat(allRailway.concat(Piece_step[nGridIndex]));  //全部铁道 + 可到达的非铁道
            for (let i = 0; i < allRailwayAndOther.length; i++) {
                var nToIndex = allRailwayAndOther[i];  //全部铁道 + 可到达的非铁道
                var oneMove = new this.OneMove(nGridIndex,nToIndex);
                // lstPossibleMoves.push(oneMove);   //FIXME: del 校验move合法则 push  
                if(this.verifyMove(oneMove)){
                    lstPossibleMoves.push(oneMove);   //FIXME: 校验move合法则 push  
                    break;     //校验有一条合格比便停止搜索
                }
            }
            //再加入非铁轨的部分 nTOIndex TODO:
            console.log('工兵测试....................',lstPossibleMoves)
        }
        else{
            for(var i = 0; i < Piece_step[nGridIndex].length; i++){
                var nToIndex = Piece_step[nGridIndex][i];
                // console.log("----------------------nToIndex:",nGridIndex,nToIndex);

                var oneMove = new this.OneMove(nGridIndex,nToIndex);
                if(this.verifyMove(oneMove)){
                    lstPossibleMoves.push(oneMove);   //FIXME: 校验move合法则 push  
                    break;                      //校验有一条合格比便停止搜索
                }

            }


        }
        return lstPossibleMoves;
        // console.log("----------------------lstPossibleMoves:",lstPossibleMoves);

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

    //获得颜色对应玩家 所有可能的移动 only明棋
    getOnePlayerPossibleMove(strPieceColor){
        var lstPossibleMoves = [];

        //所有可以移动的 本方明棋
        var lstPossibleMovePieces = this.getOnePlayerPossibleMovePieces(strPieceColor,true);
        console.log(strPieceColor,'可移动的明棋',lstPossibleMovePieces);

        // console.log("----------------------lstPossibleMovePieces:",lstPossibleMovePieces)
        for (var i = 0; i < lstPossibleMovePieces.length; i++) {
            var oneGridWithPosition = lstPossibleMovePieces[i];
            var lstPossibleMoves1 = this.getPossibleMoves(oneGridWithPosition.nPositionIndex);   //FIXME:
            // console.log("  lstPossibleMoves1(index", oneGridWithPosition.nPositionIndex, ") =", lstPossibleMoves1);
            lstPossibleMoves = lstPossibleMoves.concat(lstPossibleMoves1);
        }
        // console.log("lstPossibleMoves",lstPossibleMoves)
        return lstPossibleMoves;
       
    }
    getPossibleMoves(nGridIndex){
        console.log('getPossibleMoves')

        var oneGrid = this.lstCurrentBoard[nGridIndex];
        var lstPossibleMoves = [];

        // 暗棋只能翻成明棋
        if (oneGrid.nShowHide == PieceState.Hide) {
            lstPossibleMoves.push(new this.OneMove(nGridIndex, null));
        }
        else if(Pieces[oneGrid.nPieceId].name === "军旗" || Pieces[oneGrid.nPieceId].name === "地雷" ){
            // console.log("AI 不能移动军旗、地雷");
        }
        // 明棋只能移动
        else if(Pieces[oneGrid.nPieceId].name === "工兵" && (Util.inArray(nGridIndex,allRailway) != -1)){  //工兵 且在铁道上
            var allRailwayAndOther = Util.clearRepeat(allRailway.concat(Piece_step[nGridIndex]));  //全部铁道 + 可到达的非铁道
            console.log("allRailwayAndOther",allRailwayAndOther)
            for (let i = 0; i < allRailwayAndOther.length; i++) {
                var nToIndex = allRailwayAndOther[i];  //全部铁道 + 可到达的非铁道
                var oneMove = new this.OneMove(nGridIndex,nToIndex);
                // lstPossibleMoves.push(oneMove);   //FIXME: del 校验move合法则 push  
                if(this.verifyMove(oneMove)){
                    lstPossibleMoves.push(oneMove);   //FIXME: 校验move合法则 push  
                                                    
                }
            }
            //再加入非铁轨的部分 nTOIndex TODO:
            console.log('工兵测试....................',lstPossibleMoves)
        }
        else{
            for(var i = 0; i < Piece_step[nGridIndex].length; i++){
                var nToIndex = Piece_step[nGridIndex][i];
                // console.log("----------------------nToIndex:",nGridIndex,nToIndex);

                var oneMove = new this.OneMove(nGridIndex,nToIndex);
                if(this.verifyMove(oneMove)){
                    lstPossibleMoves.push(oneMove);   //FIXME: 校验move合法则 push  
                                                    
                }

            }


        }
        return lstPossibleMoves;
        // console.log("----------------------lstPossibleMoves:",lstPossibleMoves);

    }



    
     /*getOnePlayerPossibleMovePieces:
     * -------获取可以移动的棋子-------
     * 1.isOnlyShowPiece === true时：仅仅返回所有 自己的明棋
     * 2.isOnlyShowPiece === false时:返回自己的所有明棋+所有剩余暗棋
     */
    getOnePlayerPossibleMovePieces(strPieceColor,isOnlyShowPiece){
        var lstShowPieces =  this.getOnePlayerPieces(strPieceColor);
        if(isOnlyShowPiece === true){
            return lstShowPieces;
        }
        var lstHidePieces = this.getShowOrHidePieces(PieceState.Hide);
        return lstShowPieces.concat(lstHidePieces);
    }

    //根据颜色 获得 明棋 状态对应的所有棋子
    getOnePlayerPieces(strPieceColor){
        var lstPieces = [];

        for (var i = 0; i < this.lstCurrentBoard.length; i++) {
            var oneGrid = this.lstCurrentBoard[i];
            if (oneGrid.nPieceId !== null && oneGrid.strPieceColor === strPieceColor && oneGrid.nShowHide === PieceState.Show) {
                var oneGridWithPosition = new this.OneGridWithPosition(i, oneGrid);
                lstPieces.push(oneGridWithPosition);
            }
        }

        return lstPieces;
    }

    //获取 所有 明棋/暗棋  （不分颜色）
    getShowOrHidePieces(nPieceState) {
        var lstPieces = [];

        for (var i = 0; i < this.lstCurrentBoard.length; i++) {
            var oneGrid = this.lstCurrentBoard[i];
            if (oneGrid !== null && oneGrid.nShowHide === nPieceState) {
                var oneGridWithPosition = new this.OneGridWithPosition(i, oneGrid);
                lstPieces.push(oneGridWithPosition);
            }
        }
        console.log(lstPieces);

        return lstPieces;
    }


    //计算相对分数 评估函数
    getRelativeScore(gameModel, strPieceColor){
        var lstCurrentBoard = gameModel.lstCurrentBoard;  //FIXME:
        // console.log("getRelativeScore+++++++++lstCurrentBoard:",lstCurrentBoard)
        var strPieceColorScore = 0;
        var opponentColorScore = 0;
        for (var i = 0; i < lstCurrentBoard.length; i++) {
            var oneGrid = lstCurrentBoard[i];

            if(oneGrid.strPieceColor !== null){
                if(oneGrid.strPieceColor === strPieceColor){
                    strPieceColorScore += Pieces[oneGrid.nPieceId].score;
                }
                else{
                    opponentColorScore += Pieces[oneGrid.nPieceId].score;
                }
            }
         
        }

        // console.log("strPieceColorScore opponentColorScore",strPieceColorScore,opponentColorScore)
        return {strPieceColorScore:strPieceColorScore,opponentColorScore:opponentColorScore,relativeScore:strPieceColorScore - opponentColorScore};
    }

    //获得暗棋 及 数量  BLACK_0：2
    getHidePieces() {
        var dictHidePieces = {};
        var nNumHidePieces = 0;

        for (var i = 0; i < this.lstCurrentBoard.length; i++) {
            var oneGrid = this.lstCurrentBoard[i];
            if (oneGrid.nPieceId >= 0 && oneGrid.nShowHide === PieceState.Hide) {
           
                var strKey = oneGrid.strPieceColor + "_" + oneGrid.nPieceId;   //BLACK_0
                if (strKey in dictHidePieces) { //JavaScript的in操作符在**if( in )**语句中 ，用来判断一个属性是否属于一个对象。
                    var nCount = dictHidePieces[strKey];
                    nCount++;
                    dictHidePieces[strKey] = nCount;
                } else {
                    dictHidePieces[strKey] = 1;
                }

                nNumHidePieces++;
            }
        }

        return { dictHidePieces: dictHidePieces, nNumHidePieces: nNumHidePieces };
    }
}

export default GameModel;