import GameModel from "./GameModel";

cc.Class({
    extends: cc.Component,

    properties: {
       
        audio_select:{
            default: null,
            type: cc.AudioClip
        },
        audio_move:{
            default: null,
            type: cc.AudioClip
        },
        audio_kill:{
            default: null,
            type: cc.AudioClip
        },
        audio_kill_die:{
            default: null,
            type: cc.AudioClip
        },
        select_icon:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.Animation = this;
        this.haveVolume = true;  //是否打开音量
    },

    start () {

    },

    pieceUpAction(node,targetBoardXY){  //棋子node 和 棋子中心position
        node.runAction(cc.scaleTo(0.2, 1.7));
        this.playAudio("pieceUpAction");
        this.select_icon.setPosition(targetBoardXY);
    },
    pieceDownAction(node){
        node.runAction(cc.scaleTo(0.2, 1.5));
        this.playAudio("pieceDownAction");
    },
    pieceDownBeforeMoveAction(node){  //棋子移动 之前 缩小动作 不播放音效
        node.runAction(cc.scaleTo(0.2, 1.5));
    },
    pieceMoveAction(movingNode,fromBoardXY,targetBoardXY,nMovingType){
        this.select_icon.setPosition(fromBoardXY);
        movingNode.runAction(cc.moveTo(0.3, targetBoardXY))
        switch (nMovingType){
            case GameModel.MOVING_TYPE.MOVE:
                this.playAudio("pieceMoveAction_MOVE");
                break;
            case GameModel.MOVING_TYPE.KILL:
                this.playAudio("pieceMoveAction_KILL");
                break;
            case GameModel.MOVING_TYPE.KILL_DIE:
                this.playAudio("pieceMoveAction_KILL_DIE");
                break;
        }
        this.select_icon.runAction(cc.moveTo(0.3,targetBoardXY));
    },
    hidePieceToShow(targetBoardXY){  //翻棋只播放音效
        this.playAudio("hidePieceToShow");
        this.select_icon.setPosition(targetBoardXY);

    },
    playAudio(type){
        if(this.haveVolume){  //如果开启音量
            switch (type){
                case "pieceUpAction":
                    cc.audioEngine.play(this.audio_select, false, 1);
                    break;
                case "pieceDownAction":
                    cc.audioEngine.play(this.audio_select, false, 1);
                    break;
                case "pieceMoveAction_MOVE":
                    cc.audioEngine.play(this.audio_move, false, 1);
                    break
                case "pieceMoveAction_KILL":
                    cc.audioEngine.play(this.audio_move, false, 1);
                    break
                case "pieceMoveAction_KILL_DIE":
                    cc.audioEngine.play(this.audio_move, false, 1);
                    break
                case "hidePieceToShow":
                    cc.audioEngine.play(this.audio_select, false, 1);
                    break
            }
        }
        
    }
    
    

    // update (dt) {},
});
