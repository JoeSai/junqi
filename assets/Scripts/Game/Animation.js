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
       
        audio_select:{
            default: null,
            type: cc.AudioClip
        },
        audio_move:{
            default: null,
            type: cc.AudioClip
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    pieceUpAction(node){
        node.runAction(cc.scaleTo(0.2, 1.7));
        cc.audioEngine.play(this.audio_select, false, 1);
    },
    pieceDownAction(node){
        node.runAction(cc.scaleTo(0.2, 1.5));
        cc.audioEngine.play(this.audio_select, false, 1);
    },
    pieceDownBeforeMoveAction(node){  //棋子移动 之前 缩小动作 不播放音效
        node.runAction(cc.scaleTo(0.2, 1.5));
    },
    pieceMoveAction(movingNode,targetBoardXY){
        movingNode.runAction(cc.moveTo(0.3, targetBoardXY))
        cc.audioEngine.play(this.audio_move,false,1);
    },
    hidePieceToShow(){  //翻棋只播放音效
        cc.audioEngine.play(this.audio_select, false, 1);
    }
    
    

    // update (dt) {},
});
